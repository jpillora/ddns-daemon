var pkg = require('./package.json');
var async = require('async');
var net = require('net');
var http = require('http');
var AWS = require('aws-sdk');
var level = require('level');
var db = level('log.db', { valueEncoding: 'json' });

var port = process.env.PORT || parseInt(process.argv[2], 10) || 3000;
var PASSWORD = process.env.PASSWORD;

if(!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('Missing AWS credentials');
  process.exit(1);
}
var route53 = new AWS.Route53();

String.prototype.endsWith = function(str) {
  return this.indexOf(str) === (this.length - str.length);
};

function findZone(name, value, callback) {
  if(!name.endsWith('.'))
    name += '.';
  route53.listHostedZones({}, function(err, data) {
    if(err)
      return callback(err);
    var zones = data.HostedZones;
    for(var i = 0; i < zones.length; i++) {
      if(name.endsWith(zones[i].Name)) 
        return callback(null, zones[i], name, value);
    }
    callback('Zone not found for: ' + name);
  });
}

function insertRecord(zone, name, value, callback) {
  route53.changeResourceRecordSets({
    ChangeBatch: {
      Changes: [{
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: name,
          Type: 'A',
          ResourceRecords: [{
            Value: value,
          }],
          TTL: 1800
        }
      }]
    },
    HostedZoneId: zone.Id,
  }, callback);
}

function showRecords(callback) {
  route53.listHostedZones({}, function gotZones(err, data){
    if(err)
      return callback(err);
    var output = [];
    var fns = data.HostedZones.map(makeFn.bind(null, output));
    async.parallel(fns, function(err) {
      callback(err, output.join('\n\n'));
    });
  });
  function makeFn(output, zone) {
    return function getRecords(cb) {
      route53.listResourceRecordSets({HostedZoneId:zone.Id}, function(err, data) {
        if(err)
          return cb(err);
        var str = zone.Name + '\n' +
          data.ResourceRecordSets.map(function(rec) {
            return '  ' + rec.Name + ' ' + rec.ResourceRecords.map(function(res) {
              return res.Value;
            }).join(', ');
          }).join('\n');
        output.push(str);
        cb(null);
      });
    };
  }
}

function showLogs(callback) {
  var logs = [];
  db.createReadStream()
    .on('data', function(obj) {
      obj.value.date = new Date(obj.value.date).toString();
      logs.push(obj.value);
    })
    .on('end', function() {
      callback(null, logs);
    });
}

http.createServer(function setRecord(req, res) {

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  function callback(err, msg) {
    //log it
    var d = Date.now();
    db.put('log-'+d, { date: d, ip: ip, status: err ? ('ERROR: ' + err) : 'OK' });
    //respond
    res.writeHead(err ? 400 : 200);
    var out = err ? err : msg;
    if(typeof out !== 'string')
      out = JSON.stringify(out,0,2);
    res.end(out);
  }

  if(!/^(\/([^\/]+))?\/(.+)\/(.+)\/?$/.test(req.url))
    return callback('Invalid request: '+req.url);

  var password = RegExp.$2,
      name = RegExp.$3,
      value = RegExp.$4;

  if(PASSWORD && PASSWORD !== password)
    return callback('Invalid password');

  //specials
  if(name === 'show')
    if(value === 'records')
      return showRecords(callback);
    else if(value === 'logs')
      return showLogs(callback);
    else if(value === 'version')
      return callback(null, pkg.version);

  if(!net.isIPv4(value))
    return callback('Invalid value');

  //call aws!
  async.waterfall([
    findZone.bind(null, name, value),
    insertRecord
  ], callback);

}).listen(port, function() {
  console.log('listening on '+port+'...');
});
