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

nconf.file({ file: './childstatus.json' });
//nconf.use('memory');
nconf.set('pid', null);
nconf.save();

console.log("Modules Loaded");                                                                                              

var connections = 0;

/*
var sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: '1234'
  };
*/

// Loading Environment Variables
var envPort = process.env.PORT || 3000;
var envbackend = process.env.envbackend || "127.0.0.1";
var envbackendport = process.env.envbackendport || 3001;

console.log("HTTP Port: " + envPort);
console.log("HTTP BackEnd Address: " + envbackend);
console.log("HTTP BackEnd Port: " + envbackendport);

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


app.get("/tcpportexhaustion", function(req,res) {
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //var prechildpid = nconf.get('pid');
    
    console.log("Request received at /tcpportexhaustion: " + prechildpid);
    var netstatcount = 0;
    var prechildpid = nconf.get('pid');
    var serverdate = null;

    if (prechildpid != null && prechildpid != "") {
        netstatcount = getNetstat(prechildpid);
        serverdate = new Date();
        connections = 0;
    }

    var htmlvar = {
        childprocessID: prechildpid,
        netstatcount: netstatcount,
        serverdate: serverdate
    };
    console.log("NetstatCount: " + htmlvar.netstatcount);
    console.log("childprocessID: " + htmlvar.childprocessID);

    res.render("form.html", htmlvar);

    //res.sendfile(__dirname + '/public/form.html');
    //res.end();
});

app.post("/api/tcpportexhaustion", function(req,res){
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var procDetails = req.body;
    console.log("Request received at /tcpportexhaustion using POST from: " + ip + " Forwarder IP: " + ipfw + "TestJson: " + req.body.target);
    console.log("procDetails: " + procDetails.connections);
    //var child = spawn('my-command');
    //child.kill();
    
    //var child = spawn("node tcpportexhaustion.js " + procDetails.target + " " + procDetails.port + " " + procDetails.connections, {detached: true});
    //var child = spawn('node', ['tcpportexhaustion.js', procDetails.target, procDetails.port, procDetails.connections], {detached: true});
    if (procDetails.status == 'Run') {
        var currentPid = nconf.get('pid');
        if (currentPid == null) {
            var child = spawn('node', ['tcpportexhaustion.js', procDetails.target, procDetails.port, procDetails.connections], {detached: true});
            nconf.set('pid', child.pid);
            nconf.save();            
        }
    }
    else if (procDetails.status == 'Stop') {
        var prechildpid = nconf.get('pid');
        console.log("Killing process: " + prechildpid);
        process.kill(prechildpid);
        nconf.set('pid', null);
        nconf.save();        
    }
    
    //var child = spawn("calc.exe", {detached: true});
    //process.kill(-child.pid);
    res.send(req.body);    // echo the result back    
    res.end();
});

app.get("/api/tcpportexhaustion", function(req,res){
    var netstatcount = 0;
    var prechildpid = nconf.get('pid');
    var serverdate = new Date();

    if (prechildpid != null && prechildpid != "") {
        netstatcount = getNetstat(prechildpid);
        connections = 0;
    }

    var htmlvar = {
        childprocessID: prechildpid,
        netstatcount: netstatcount,
        serverdate: serverdate
    };
    console.log("Request received at GET /api/tcpportexhaustion: " + htmlvar.netstatcount);
    res.send(htmlvar);    // echo the result back    
    res.end();
});

app.get("/index.html", function(req,res) {
    var hostname = os.hostname();
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var useragent = req.headers['user-agent']
    var url = req.url;    

    console.log("Request received at /index.html: " + ip);
    //res.sendfile('index.html');

    var htmlvar = {
        hostname: hostname,
        ip: ip,
        ipfw: ipfw,
        useragent: useragent
      };

    res.render("index.html", htmlvar);

    //res.end();
});

app.get("/api/json", function(req,res) {
    var ip = req.ip;
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Request received at /api/json from: " + ip);
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

//////////////////////////////////////
/////    Calling API              ////
//////////////////////////////////////

function webapicall(callbackapi) {
    //console.log("webapicall reached!");
    var resData = '';
    
    var opts = {
      method: 'get',
      host: envbackend,
      port: envbackendport,
      path: '/api',
      headers: {
      }
    };
  
    callback = function(res){
        try {
            res.on('data',function(d){
                resData += d;
                //console.log("Logging resData in data 1: "+ resData);
                //console.log("Logging resData in data 2: "+ d);
                callbackapi(resData);
    
            });
        } catch (error) {
            callbackapi(JSON.stringify(res.message));
        }
    }

    var req = http.request(opts, callback);

    /*
    req.on('error', function(e){
        console.log(e.message);
    });
    */

    req.on('error', callback);
    req.end();

    //var req = http.request(opts, callback).on("error",function(e){
    //    console.log("Request Error: " + e.message);
    //});
}



function getNetstat(pid) {
    var result = netstat({
        filter: {
            pid: pid,
            protocol: 'tcp',
            state: 'ESTABLISHED'
        },
        sync: true
    }, function (data) {
        // a single line of data read from netstat
        connections += 1;
        //console.log(connections)
        //console.log(data)
    });
    return connections;
}





//////////////////////////////////////
/////    Creating WebServer       ////
//////////////////////////////////////
// HTTPs Server
//var serverhttps = https.createServer(sslOptions,app);
//serverhttps.listen(443);
// HTTP Server
var serverhttp = http.createServer(app);
serverhttp.listen(envPort);