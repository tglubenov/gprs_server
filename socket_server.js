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

        // console.log(sender);
        // console.log(message);
        // process.stdout.write(message);
    }

}).listen(3500);

//Push message on server terminal
console.log("TCP Server running on port 3500 ...");

function GPRS_parse(data) {
}
