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
            var html = "";
            html += "<html><body><h1>Node.JS SimpleWebSite Query</h1>"
            html += "<br><b>Host Name: "+ hostname
            html += "<br>Query: " + query
            html += "</b><br><b>Request received from: </b>" + ip
            html += "<br>User Agent: </b>"+ req.headers['user-agent']
            html += "<br>Forwarder IP: </b>"+ ipfw
            html += "<br>Received Json: " + data
            html += "<br><br><b>Parsered Json</b>";
            html += "<br><b>HostName: </b>" + datajson.hostname;
            html += "<br><b>IP: </b>" + datajson.ip;
            html += "<br><b>IPFW: </b>" + datajson.ipfw;
            html += "<br><b>Date: </b>" + datajson.date;
            html += "</body></html>"
            res.send(html);
            //res.send("<html><body><h1>Node.JS SimpleWebSite Query</h1><br><b>Host Name: "+ hostname +"<br>Query: " + query + "</b><br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
        }
        webapicall(callbackapi);
        //res.send("<html><body><h1>Node.JS SimpleWebSite Query</h1><br><b>Host Name: "+ hostname +"<br>Query: " + query + "</b><br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
    }
    else{
        console.log(req.url);
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
        html += "</script>"
        html += "<br><button type=\"button\" onclick=\"alert(burl)\">Click Me!</button>"
        html += "<br><br><button type=\"button\" onclick=\"window.location.href=burl\">RestAPI</button>"

        /*
        <script>
        var currentURL = window.location.hostname;
        var burl = currentURL
        document.write(currentURL)
        </script>
        */
        
        html += "</body></html>"
        res.send(html)
    }
    
    console.log("Request received from: " + ip + " Forwarder IP: " + ipfw);
    //res.send("<html><body><h1>Node.JS SimpleWebSite</h1><br><b>Host Name: "+ hostname +"</b><br><b>Request received from: </b>" + ip + "<br><b>User Agent: </b>"+ req.headers['user-agent'] +"<br><b>Forwarder IP: </b>"+ ipfw +"</body></html>")
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
/////    Calling API              ////
//////////////////////////////////////

function webapicall(callbackapi) {
    //console.log("webapicall reached!");
    var resData = '';
    
    var opts = {
      method: 'get',
      host: '127.0.0.1',
      port: '3001',
      path: '/api',
      headers: {
      }
    };
  
    callback = function(res){
        /*
        req.on('error', function(err, req, res) {
            console.log("err");
          });
        */
        res.on('data',function(d){
            resData += d;
            //console.log("Logging resData in data 1: "+ resData);
            //console.log("Logging resData in data 2: "+ d);
            callbackapi(resData);

        });
        res.on('end', function(){
            //console.log("End 3: " + resData);
        });
    }

    var req = http.request(opts, callback).end();
}





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