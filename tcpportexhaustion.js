#!/usr/bin/env nodejs
var net = require('net');

function opensocket(){
        var client = new net.Socket();
        client.connect(2800, '52.183.253.208', function() {
                //console.log('Connected');
                //client.write('Hello, server! Love, Client.');
        });

        client.on('data', function(data) {
                //console.log('Received: ' + data);
                //client.destroy(); // kill client after server's response
        });

        client.on('error', function(ex){
                //console.log(ex);
        });
        client.on('close', function(ex){
                client.connect(2800, '52.183.253.208');
        });
}

var i = 0;
var loopcount = 5;
while (i <= loopcount){
  //console.log(i)
  opensocket();
  i++;
  
}

//client.on('close', function() {
//      console.log('Connection closed');
//});
