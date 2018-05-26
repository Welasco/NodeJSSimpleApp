var http = require("http");
var https = require('https');
var express = require("express");
var bodyParser = require('body-parser')
var os =require('os')
var fs = require('fs');
var app = express();
console.log("Modules Loaded");                                                                                              

/*
var sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: '1234'
  };
*/

// Loading Environment Variables
var envPort = process.env.envPort || 3001;

app.use(bodyParser.json());
app.get("/", function(req,res) {
    var hostname = os.hostname();
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Request received from: " + ip + " Forwarder IP: " + ipfw);
    res.send("<html><body><h1>Node.JS SimpleWebSite</h1><br><b>Host Name: "+ hostname +"</b><br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
});

app.post("/api", function(req,res){
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Request received at /api/jsonpost from: " + ip + " Forwarder IP: " + ipfw);
    console.log(req.body);      // your JSON
    res.send(req.body);    // echo the result back    
    res.end();
});

app.get("/api", function(req,res){
    var hostname = os.hostname();
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var date = new Date();
    console.log("Request received at /api from: " + ip + " Forwarder IP: " + ipfw);
    res.json({
        hostname: hostname,
        ip: ip,
        ipfw: ipfw,
        useragent: req.headers['user-agent'],
        date: date
    });
    //res.end();
});

//////////////////////////////////////
/////    Creating WebServer       ////
//////////////////////////////////////
// HTTPs Server
//var serverhttps = https.createServer(sslOptions,app);
//serverhttps.listen(443);
// HTTP Server
var serverhttp = http.createServer(app);
serverhttp.listen(envPort);

//http.createServer(sslOptions,app).listen(8000);
function ConsoleLog(msg) {
    console.log(msg);
}