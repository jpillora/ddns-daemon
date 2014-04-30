ddns-daemon
===========

A Simple Dynamic DNS Daemon using Node.js and Route53

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

* `/<PASSWORD>/<DOMAIN>/<IP-ADDRESS>` - Sets an A record for this value
* `/<PASSWORD>/show/version` - Shows `ddns-daemon` version
* `/<PASSWORD>/show/logs` - Shows primitive web logs
* `/<PASSWORD>/show/records` - Shows all records in all zones

### Notes

* Domains are about $3.00/yr and then managing these on AWS Route53 is about $0.50each/mth
* On free heroku, apps can be brought down due to innactivity, to keep them up - use [UptimeRobot](https://uptimerobot.com/)
* On free heroku, a `ddns-daemon` server would not be secured, so requests would be vuln to a MitM
* Logs get wiped on app restart

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
