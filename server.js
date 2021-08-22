const express = require('express');
const PORT = process.env.PORT || 8080;
const axios = require('axios').default;
const net = require('net');

const app = express();

const serverUrl = 'https://set930.herokuapp.com/api/';

const SOCKET_PORT = 9090;


// tcp socket server
let socketServer = net.createServer(function (socket) {
    console.log('client connected');
    // socket.write('Echo server\r\n');
    socket.pipe(socket);

    socket.on('end', function () {
        console.log('client disconnected');
    });

    socket.on('data', function (data) {
        let str = data.toString();
        console.log('data came in', str);

        if (str.toLowerCase().startsWith('uid')) {
            console.log('sample came in');
            axios.get(serverUrl + 'sample?data=' + data);
            return;
        }


        if (str.toLowerCase() === 'send configuration') {
            console.log('unit want to check for configuration');
            socket.emit('new config');
            return;
        }

        console.log('invalid data');

    });

    socket.on('error', function (error) {
        console.error(error);

    });

    socket.on('close', function () {
        console.info('Socket close');
    });
});

socketServer.listen(SOCKET_PORT, () => {
    console.log('socket server is listening on port ' + SOCKET_PORT);
});
