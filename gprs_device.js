/*
Name:         gprs_device
Description:  gprs_device Data Parser and server for Node.js
Source:       
License:      Unlicense / Public Domain

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.
 */


//INIT
var net = require('net'),
EventEmitter = require('events').EventEmitter

var gprs_device = new EventEmitter()

//defaults
gprs_device.settings = {
	ip:		'0.0.0.0',	// default listen on all IPs
	port:		3500,		// 0 = random, 'listening' event reports port
	connections:	3,		// 10 simultaneous connections
	timeout:	1		// 10 seconds idle timeout
}

//Create server
gprs_device.createServer = function( vars ) {

	// override settings
	if( typeof vars == 'object' && Object.keys(vars).length >= 1 ) {
		for( var key in vars ) {
			gprs_device.settings[ key ] = vars[ key ]
		}
	}

	// start server
	gprs_device.server = net.createServer( function( socket ) {
		console.log(Date.now(), 'creating server in gprs_device.js...');
		// socket idle timeout
		if( gprs_device.settings.timeout > 0 ) {
			socket.setTimeout( gprs_device.settings.timeout * 1000, function() {
				gprs_device.emit( 'timeout', socket )
				socket.end()
				socket.destroy()
			})
		}
	}).listen( gprs_device.settings.port, gprs_device.settings.ip, function() {
		console.log(Date.now(), 'This port is listening...');
		gprs_device.emit( 'listening', gprs_device.server.address() );
	});

	// maximum number of slots
	gprs_device.server.maxConnections = gprs_device.settings.connections;

	gprs_device.server.on('connection', (socket) => {
		//socket.setEncoding('ascii');
		var data = '';
		socket.on('data', (chunk) => {
			data += chunk;
			console.log(chunk.toString('utf8'));
			console.log(data.toString('utf8'));
		});
		console.log(typeof (data), data.length);
	});

	// inbound connection
	// gprs_device.server.on( 'connection', function( socket ) {
	// 	socket.setEncoding( 'utf8' )
	// 	var data = ''
	// 		socket.on( 'data', function( chunk ) {
	// 			data += chunk;
	// 			This dummy data comment it when you are getting data dynamically
	// 			data = '(027028641389BR00160123A1428.4284N07850.1819E020.90557101.200000000000L00000000)';
				// var gps = {}
				// gps = gprs_device.parse( data )
				// if( data != '' ) {
				//
				// 	var gps = gprs_device.parse( data )
				// 	console.log(gps)
				// 	if( gps ) {
				// 		gprs_device.emit( 'trackGPS', gps )
				// 	} else {
				// 		gprs_device.emit( 'fail', {
				// 			reason:	'Cannot parse GPS data from device',
				// 			socket:	socket,
				// 			input:	data
				// 		})
				// 	}
				// }
			// })
	// })
}
gprs_device.parse = function (raw){
	var IMEI = raw.substring (3,raw.indexOf('B'));
	console.log('IMEI'+IMEI)
	var Nbound = raw.substring(raw.indexOf('A')+1,raw.indexOf('N'));

	var Ebound = raw.substring(raw.indexOf('N')+2,raw.indexOf('E'));

	var latitude =  parseFloat(parseInt(Nbound.substring(0,2))+parseFloat(Nbound.substring(2,Nbound.length))/60).toFixed(5)
	var longitude =   parseFloat(parseInt(Ebound.substring(0,2))+parseFloat(Ebound.substring(2,Ebound.length))/60).toFixed(5)
	var gps ={
		'lat': latitude,
		'lng': longitude,
		'IMEI' : IMEI
	}
	return gps
}


//Clean geo positions, with 6 decimals
gprs_device.fixGeo = function( one, two ) {
	var minutes = one.substr(-7, 7)
	var degrees = parseInt( one.replace( minutes, '' ), 10 )
	var one = degrees + (minutes / 60)

	var one = parseFloat( (two == 'S' || two == 'W' ? '-' : '') + one )
	return Math.round( one * 1000000 ) / 1000000
}

gprs_device.fixFakeGeo = function( one, two ) {
	var minutes = one.substr(-9, 9)
	var degrees = parseInt( one.replace( minutes, '' ), 10 )
	var one = degrees + (minutes / 60)

	var one = parseFloat( (two == 'S' || two == 'W' ? '-' : '') + one )
	return Math.round( one * 1000000 ) / 1000000
}

//ready
module.exports = gprs_device