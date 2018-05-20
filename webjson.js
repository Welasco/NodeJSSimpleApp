var http = require("http");
var https = require('https');
var express = require("express");
var bodyParser = require('body-parser')
var fs = require('fs');
var app = express();
console.log("Modules Loaded");                                                                                              

var sslOptions = {
    //key: fs.readFileSync('key.pem'),
    //cert: fs.readFileSync('cert.pem'),
    passphrase: '1234'
  };

app.use(bodyParser.json());
app.get("/", function(req,res) {
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Request received from: " + ip + " Forwarder IP: " + ipfw);
    res.send("<html><body><h1>Json Test</h1><br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
});

app.get("/api/json", function(req,res) {
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Request received at /api/json from: " + ip);
    garageDoor("Test");
    res.end();
});

app.post("/api/jsonpost", function(req,res){
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Request received at /api/jsonpost from: " + ip + " Forwarder IP: " + ipfw);
    console.log(req.body);      // your JSON
    //console.log(JSON.stringify(req.headers));
    console.log(req.headers);
    res.send(req.body);    // echo the result back    
    res.end();
});

app.get("/sendcommand", function(req,res){
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Request received at /sendcommand from: " + ip + " Forwarder IP: " + ipfw);
    var msg = JSON.stringify({type: 'zone', partition: '1', zone: 1, state: 'active'});
    notify(msg);    
    res.end();
});


app.get('/subscribe/:host', function (req, res) {
    var parts = req.params.host.split(":");
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Request received at /subscribe from: " + ip + " Forwarder IP: " + ipfw);
    console.log("parts: " + parts);
    console.log(req.body);      // your JSON
    //console.log(JSON.stringify(req.headers));
    console.log(req.headers);    
    res.end();
  });



//////////////////////////////////////
/////    Creating WebServer       ////
//////////////////////////////////////
// HTTPs Server
//var serverhttps = https.createServer(sslOptions,app);
//serverhttps.listen(443);
// HTTP Server
var serverhttp = http.createServer(app);
serverhttp.listen(8080);

//http.createServer(sslOptions,app).listen(8000);
function ConsoleLog(msg) {
    console.log(msg);
}

var notify = function(data) {

    var opts = {
      method: 'NOTIFY',
      host: '192.168.0.6',
      port: '39500',
      path: '/notify',
      headers: {
        'CONTENT-TYPE': 'application/json',
        'CONTENT-LENGTH': Buffer.byteLength(data),
        'stnp-plugin': 'plugin'
      }
    };
  
    var req = http.request(opts);
    req.on('error', function(err, req, res) {
      logger("Notify error: "+err);
    });
    req.write(data);
    req.end();
}