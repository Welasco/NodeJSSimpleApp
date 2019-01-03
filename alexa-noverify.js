var http = require("http");
var https = require('https');
var express = require("express");
var bodyParser = require('body-parser')
var os = require('os')
var fs = require('fs');
var app = express();
var nconf = require('nconf');
var spawn = require('child_process').spawn;
var netstat = require('node-netstat');
//var verifier = require('alexa-verifier');
var verifier = require('alexa-verifier-middleware')

nconf.file({ file: './childstatus.json' });
//nconf.use('memory');
nconf.set('pid', null);
nconf.save();

console.log("Modules Loaded");                                                                                              

var connections = 0;


var sslOptions = {
    key: fs.readFileSync('hepoca.key'),
    cert: fs.readFileSync('hepoca.crt'),
    passphrase: '123'
  };


// Loading Environment Variables
var envPort = process.env.envPort || 3000;
var envbackend = process.env.envbackend || "127.0.0.1";
var envbackendport = process.env.envbackendport || 3001;

console.log("HTTP Port: " + envPort);
console.log("HTTP BackEnd Address: " + envbackend);
console.log("HTTP BackEnd Port: " + envbackendport);

// create a router and attach to express before doing anything else
//var alexaRouter = express.Router()
//app.use('/alexa', alexaRouter)
//alexaRouter.use(verifier)

// Configuring Express to use my public folder and ejs for handering html
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get("/", function(req,res) {
    var hostname = os.hostname();
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var useragent = req.headers['user-agent']
    var url = req.url;
    var urlquery = url.split('?');
    var query = "";

    if(urlquery.length >= 2){
        query = urlquery[1];
    }
    else{
        query = "";
    }
    
    if (query == "api") {
        function callbackapi(data) {
            console.log("Log in callbackapi: " + data);
            var datajson = JSON.parse(data);
            var datajsonstringfy = JSON.stringify(data);
            //console.log("Log in callbackapi json: " + datajson.hostname);
            /*
            var html = "";
            html += "<html><body><h1>Node.JS SimpleWebSite Query</h1>"
            html += "<br><b>Host Name: "+ hostname
            html += "<br>Query: " + query
            html += "</b><br><b>Request received from: </b>" + ip
            html += "<br>User Agent: </b>"+ req.headers['user-agent']
            html += "<br>Forwarder IP: </b>"+ ipfw
            html += "<br>Received backend server Json: " + data
            html += "<br><br><b>Parsered Json</b>";
            html += "<br><b>HostName: </b>" + datajson.hostname;
            html += "<br><b>IP: </b>" + datajson.ip;
            html += "<br><b>IPFW: </b>" + datajson.ipfw;
            html += "<br><b>Date: </b>" + datajson.date;
            html += "</body></html>"
            res.send(html);
            */
            //res.send("<html><body><h1>Node.JS SimpleWebSite Query</h1><br><b>Host Name: "+ hostname +"<br>Query: " + query + "</b><br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
            var htmlvar = {
                hostname: hostname,
                ip: ip,
                ipfw: ipfw,
                useragent: useragent,
                query: query,
                data: data,
                datajson: datajson
            };
    
            res.render("api.html", htmlvar);            
        }
        webapicall(callbackapi);
        //res.send("<html><body><h1>Node.JS SimpleWebSite Query</h1><br><b>Host Name: "+ hostname +"<br>Query: " + query + "</b><br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
    }
    else{
        console.log(req.url);
        /*
        var html = "";
        html += "<html><body><h1>Node.JS SimpleWebSite Query</h1>"
        html += "<br><b>Host Name: "+ hostname
        html += "</b><br><b>Request received from: </b>" + ip
        html += "<br>User Agent: </b>"+ req.headers['user-agent']
        html += "<br>Forwarder IP: </b>"+ ipfw
        //html += "<br><script>document.write(5+5)</script>"
        html += "<script>var currentURL = window.location.hostname + \":\" + window.location.port;var burl = " + "\"" + "http://" + "\"" + " + currentURL + " + "\"" +"?api" + "\";"
        html += "document.write(burl);"
        //html += "<button type=\"button\" onclick=\"alert(burl)\">Click Me!</button>;"
        html += "var form = " + "\"" + "http://" + "\"" + " + currentURL + " + "\"" +"/tcpportexhaustion" + "\";"
        html += "</script>"
        html += "<br><button type=\"button\" onclick=\"alert(burl)\">Click Me!</button>"
        html += "<br><br><button type=\"button\" onclick=\"window.location.href=burl\">RestAPI</button>"
        html += "<br><br><button type=\"button\" onclick=\"window.location.href=form\">TCPPortExhaustion</button>"
        html += "</body></html>"
        res.send(html)
        */

        var htmlvar = {
            hostname: hostname,
            ip: ip,
            ipfw: ipfw,
            useragent: useragent
        };

        res.render("index.html", htmlvar);

        
    }
    
    console.log("Request received from: " + ip + " Forwarder IP: " + ipfw);
    //res.send("<html><body><h1>Node.JS SimpleWebSite</h1><br><b>Host Name: "+ hostname +"</b><br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
});

app.post("/api/jsonpost", function(req,res){
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Request received at /api/jsonpost from: " + ip + " Forwarder IP: " + ipfw);
    console.log(req.body);      // your JSON
    res.send(req.body);    // echo the result back    
    res.end();
});

//alexaRouter.get('/weather_info', function(req, res) { ... })

app.post("/alexa/television", function(req,res) {
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var testjson = {
          "version": "1.0",
          "sessionAttributes": {
            "supportedHoroscopePeriods": {
              "daily": true,
              "weekly": false,
              "monthly": false
            }
          },
          "response": {
            "outputSpeech": {
              "type": "PlainText",
              "text": "Uhuuuu so far so good!"
            },
            "card": {
              "type": "Simple",
              "title": "Television",
              "content": "Today will provide you a new learning opportunity.  Stick with it and the possibilities will be endless."
            },
            "reprompt": {
              "outputSpeech": {
                "type": "PlainText",
                "text": "Can I help you with anything else?"
              }
            },
            "shouldEndSession": false
          }
    }

    console.log("Request received at POST /api/television from: " + ip);
    //var jparse = req.body;
    //console.log("Intent: " + jparse.request.intent.name);
    console.log("POST Body: " + JSON.stringify(req.body));
    res.send(testjson);
    res.end();
});

// catch 404 and forward to error handler
// note this is after all good routes and is not an error handler
// to get a 404, it has to fall through to this route - no error involved
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log("Chegou no 404");
  console.log("POST Body: " + JSON.stringify(req.body));
  console.log("Headers: " + JSON.stringify(req.headers));
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

//check if request has a signaturecertchainurl (this is all for authentication)
/*
app.use(function(req, res, next) {
  if (!req.headers.signaturecertchainurl) {
    return next();
  }
 
  // mark the request body as already having been parsed so it's ignored by 
  // other body parser middlewares 
  req._body = true;
  req.rawBody = '';

  //once we get data, add it on to our body
  req.on('data', function(data) {
    return req.rawBody += data;
  });

  //once its all over
  req.on('end', function() {

    var cert_url, er, error, requestBody, signature;

    //parse the raw body
    try {
      req.body = JSON.parse(req.rawBody);
    } catch (error) {
      er = error;
      req.body = {};
    }

    //get the information needed to verify the request
    cert_url = req.headers.signaturecertchainurl;
    signature = req.headers.signature;
    requestBody = req.rawBody;

    //verify the request
    verifier(cert_url, signature, requestBody, function(er) {

      if (er) {
        //if it fails, throw an error and return a failure
        console.error('error validating the alexa cert:', er);
        res.status(401).json({ status: 'failure', reason: er });
      } else {
        //proceed
        console.log("verified!")
        next();
      }

    });
  });

});
*/

//////////////////////////////////////
/////    Creating WebServer       ////
//////////////////////////////////////
// HTTPs Server
var serverhttps = https.createServer(sslOptions,app);
serverhttps.listen(4443);
// HTTP Server
var serverhttp = http.createServer(app);
serverhttp.listen(envPort);