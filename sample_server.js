
const gprs_server = require('./gprs_device');
//const http = require('http');
const portNum = 3500;

gprs_server.createServer({
    port: portNum
});

gprs_server.on('trackGPS', function(gps) {
    console.log(gps);
//    http.emit( 'data', gps );
    console.log("\n gprs_device TCP Gateway now running on port "+portNum);
});
