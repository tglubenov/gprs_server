console.log("gprs_device TCP GPRS Gateway v0.1-dev");
console.log("Loading...");

var tk102 = require('./gprs_device');
//var mysql = require('mysql');
var http = require('http');

var portNum = 3500;

console.log("Setting up gprs_device interface..")

gprs_device.createServer({
	port: portNum
});

gprs_device.on('trackGPRS', function(gps) {
	console.log(gps)
	var recentPosition = {};
	recentPosition['lat'] = gps.lat;
	recentPosition['lng'] = gps.lng;
	recentPosition['IMEI'] = gps.IMEI;
	//service call
	request("https://ancloud.com/nodejscall?lat="+gps.lat+"&lng="+gps.lng+"&IMEI="+gps.IMEI, function(error, response, body) {
		  console.log(body);
		});

	
	console.log("\n gprs_device TCP Gateway now running on port "+portNum);
});