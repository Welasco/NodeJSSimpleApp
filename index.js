var http = require("http");
var https = require('https');
var express = require("express");
var bodyParser = require('body-parser')
var os = require('os')
var fs = require('fs');
var app = express();

var envPort = process.env.PORT;


//app.use(bodyParser.json());

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get("/", function(req,res) {
    var hostname = os.hostname();
    //var ip = req.ip;
    var ip = "127.0.0.1:81";
    var ip = (ip.split(":"))[3];
    var ipfw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var useragent = req.headers['user-agent'];
    var url = req.url;

    //res.write('Hello, world! [helloworld sample]');
    //res.end();

    var htmlvar = {
        hostname: hostname,
        ip: ip,
        ipfw: ipfw,
        useragent: useragent
    };

    res.render("index.html", htmlvar);    

});


//var serverhttp = http.createServer(app).listen(process.env.PORT);
http.createServer(app).listen(process.env.PORT);
//serverhttp.listen(process.env.PORT);


/*
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, world! [helloworld sample]');
}).listen(process.env.PORT);  
*/