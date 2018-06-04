var netstat = require('node-netstat');
/*
netstat({
    filter: {
        pid: 18480,
        protocol: 'tcp'
    },
    limit: 5
}, function (data) {
    // a single line of data read from netstat
    console.log(data.length);
});
*/

var connections = 0;
var result = netstat({
    filter: {
        pid: 19780,
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

console.log(connections);

/*
function resultNetstat(data){
    console.log("test");
}

function getNetstat(pid,callback) {
    var connections = 0;
    console.log("PID: " + pid);
    netstatcallback = function (data) {
        // a single line of data read from netstat
        connections += 1;
        //console.log(connections)
        //console.log(data)
        callback(connections);
    }
    
    netstat({
        filter: {
            pid: pid,
            protocol: 'tcp',
            state: 'ESTABLISHED'
        }
    }, function (data) {
        // a single line of data read from netstat
        connections += 1;
        //console.log(connections)
        //console.log(data)
        console.log(data);
        callback(connections);
        
    });
}

//console.log(test);
getNetstat('19780',resultNetstat);
*/