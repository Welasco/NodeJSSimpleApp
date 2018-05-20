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

app.use(bodyParser.json());
app.get("/", function(req,res) {
    var hostname = os.hostname();
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Request received from: " + ip + " Forwarder IP: " + ipfw);
    res.send("<html><body><h1>Node.JS SimpleWebSite</h1><br><b>Host Name: "+ hostname +"</b><br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
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
    res.send(req.body);    // echo the result back    
    res.end();
});


app.get("/instruct", function(req,res) {
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var url = req.url;
    var urlquery = url.split('?');
    var query = "";

    if(urlquery.length >= 2){
        query = urlquery[1];
    }
    else{
        query = "";
    }

    console.log("Request received at /api/json from: " + ip);
    res.send("<html><body><h1>Instruct Test - Windows Server</h1><br><b>Full Url: </b>"+ url +"<br><b>URL Query: </b>" + query + "<br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
    res.end();
});

app.get("/instruct/pay-later", function(req,res) {
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var url = req.url;
    var urlquery = url.split('?');
    var query = "";

    if(urlquery.length >= 2){
        query = urlquery[1];
    }
    else{
        query = "";
    }

    console.log("Request received at Instruct/pay-later from: " + ip);
    res.send("<html><body><h1>Instruct/pay-later Test - Windows Server</h1><br><b>Full Url: </b>"+ url +"<br><b>URL Query: </b>" + query + "<br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
    res.end();
});

app.get("/instruct/pay-now", function(req,res) {
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var url = req.url;
    var urlquery = url.split('?');
    var query = "";

    if(urlquery.length >= 2){
        query = urlquery[1];
    }
    else{
        query = "";
    }

    console.log("Request received at Instruct/pay-now from: " + ip);
    res.send("<html><body><h1>Instruct/pay-now - Windows Server</h1><br><b>Full Url: </b>"+ url +"<br><b>URL Query: </b>" + query + "<br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
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
serverhttp.listen(3000);

//http.createServer(sslOptions,app).listen(8000);
function ConsoleLog(msg) {
    console.log(msg);
}