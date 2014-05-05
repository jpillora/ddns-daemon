ddns-daemon
===========

A Simple DynamicDNS Daemon using Node.js and Route53

## Usage 

Run your own

```
npm install -g ddns-daemon
```

Run on Heroku

```
git clone *this-repo*
heroku apps:create *your-app-name*
# this should add remote: "heroku git@heroku.com:*your-app-name*.git"
git push heroku
```

## Environment Variables

* `AWS_ACCESS_KEY_ID` (Required)
* `AWS_SECRET_ACCESS_KEY` (Required)
* `PASSWORD` (Optional)
* `PORT` (Optional *defaults to `3000`*)

*Tip: `heroku config:set --app your-app-name PASSWORD=sup3rt0ps3cr3t`*

## API

If `PASSWORD` is defined, it must be included in the URL

* `/<PASSWORD>/<[SUB]DOMAIN>/<IP-ADDRESS>` - Creates or updates this domain or subdomain with the given IP address (defines an A record)
* `/<PASSWORD>/show/version` - Shows `ddns-daemon` version
* `/<PASSWORD>/show/logs` - Shows primitive web logs
* `/<PASSWORD>/show/records` - Shows all records in all zones

### Notes

* In order for your router to consume this API, you'll need to use a custom URL as the Dynamic DNS service. I'm currently using the open source [TomatoUSB](http://tomatousb.org/) firmware. Otherwise, you could run a script on a *host* inside your network which periodically checks [your public IP](http://canihazip.com/s) and fires off an update when required.
* Domains are about $3.00/yr and then managing these on AWS Route53 is about $0.50each/mth
* Free heroku instances may be brought down due to innactivity, to keep them up - use [UptimeRobot](https://uptimerobot.com/)
* Free heroku instances are not secured, so requests would be vuln to a MitM
* Logs get wiped on app restart
* AWS Route53 Docs can be found [here](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html)

### Todo

* Allow this to run in real OS daemon mode on system start and function as the *host* described above

#### MIT License

Copyright © 2014 Jaime Pillora &lt;dev@jpillora.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
