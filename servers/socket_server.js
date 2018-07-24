// Load TCP Lib
net = require('net');
const mongoose = require('mongoose');

// Keep track on GPRS Clients
var gprs_device_list = [];

mongoose.Promise = global.Promise;
// Mongoose connection to MongoDB
mongoose.connect('mongodb://lg:TGL2018!!@ds247141.mlab.com:47141/lg_dev', function (error) {
    if (error) {
        console.log(error);
    }
});

var lg = mongoose.model('lg', {
    type: {
        type: String
    },
    geometry: {
        type: String,
        coordinates: Array
    }
});

// Start TCP Server
net.createServer((socket) => {

    // Identify this device
    socket.name = socket.remoteAddress + ":" + socket.remotePort;

    //  Put new device to the list
    gprs_device_list.push(socket);

    //  Log device to the database
    //  Log to Mongo/Rethink DB logic here

    socket.on('data', (data) => {
        handleGPRS(socket.name + ">" + data, socket);
    });

    socket.on('error', function (e) {
        console.log('error', e);
    });

    socket.on('end', () => {
        handleGPRS(socket.name + " leave the system");
    });

    // handleGPRS function processing GPRS messages
    function handleGPRS(message, sender) {
        // save message to database and handle it
        const msg = message.toString();
        console.log(msg);
        console.log(msg.length, typeof (msg));

//        ttt = msg.replace(/LGSN /g, '\n;LGS:123,lat:');
        ttt = msg.replace(/LGSN /g, '\nLGS;lat:');
        ttt = ttt.replace(/ E /g, ',lon:');

        ttt = ttt.replace(/ M1 /g, ',M1:');
        ttt = ttt.replace(/ M2 /g, ',M2:');
        ttt = ttt.replace(/ MR /g, ',MR:');
        ttt = ttt.replace(/ SR /g, ',SR:');
        ttt = ttt.replace(/ SL /g, ',SL:');
        ttt = ttt.replace(/ TS /g, ',TS:');
        ttt = ttt.replace(/ PD /g, ',PD:');
        ttt = ttt.replace(/ R1 /g, ',R1:');
        ttt = ttt.replace(/ S /g, ',S:');

        // remove all null characters
        ttt = ttt.replace(/\0/g, '');
        ttt = ttt.replace(/ \r/, '');

        ttt = ttt.split(';')[1];

        var properties = ttt.split(',');
        var gprs_obj = {};
        properties.forEach(function(property) {
            var tup = property.split(':');
            gprs_obj[tup[0]] = tup[1];
        });

        gprs_obj['receive_timestamp'] = new Date;
        gprs_obj['version'] = '1.0';
        gprs_obj['sender_address'] = socket.remoteAddress;
        gprs_obj['sender_port'] = socket.remotePort;

        if (gprs_obj['lat']) {
            lister = gprs_obj['lat'].split(' ');
            if (lister.length == 4) {
                sec = lister[2] + '.' +lister[3];
                dec = Number(lister[0])+Number(lister[1]/60)+Number(sec/3600);
                gprs_obj['lat'] = dec;
            } else {
                console.log('Err', lister);
            }
        }

        if (gprs_obj['lon']) {
            lister = gprs_obj['lon'].split(' ');
            if (lister.length == 4) {
                sec = lister[2] + '.' +lister[3];
                dec = Number(lister[0])+Number(lister[1]/60)+Number(sec/3600);
                gprs_obj['lon'] = dec;
            } else {
                console.log('Err', lister);
            }
        }

        geojson_object = {}
        geojson_object['type'] = 'Feature';
        geojson_object['properties'] = gprs_obj;

        if (gprs_obj.lat && gprs_obj.lon) {
            geojson_object['geometry'] = {
                type: "Point",
                coordinates: [gprs_obj.lat, gprs_obj.lon]
            }
        }

        var newObj = new lg(geojson_object);
        newObj.save().then((doc) => {
            console.log('saved lg:', doc);
        }, (e) => {
            console.log('Unable to save the object');
        });

        console.log(geojson_object, typeof geojson_object);
    }

}).listen(3500);

//Push message on server terminal
console.log("TCP Server running on port 3500 ...");

