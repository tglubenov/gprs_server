// Load TCP Lib
net = require('net');

// Keep track on GPRS Clients
var gprs_device_list = [];

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

    socket.on('end', () => {
        handleGPRS(socket.name + " leave the system");
    });

    // handleGPRS function processing GPRS messages
    function handleGPRS(message, sender) {
        // save message to database and handle it
        const msg = message.toString();
        console.log(msg);
        console.log(msg.length, typeof (msg));

        ttt = msg.replace(/LGSN /g, '\n;LGS:123,lat:');
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

        console.log(gprs_obj, typeof gprs_obj);
        console.log(gprs_obj.lon, gprs_obj.lat);
    }

}).listen(3500);

//Push message on server terminal
console.log("TCP Server running on port 3500 ...");

