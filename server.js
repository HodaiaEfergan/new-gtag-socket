const express = require('express');
const PORT = process.env.PORT || 3002;
const LOCAL_IP = '0.0.0.0';
const axios = require('axios').default;
const net = require('net');

/*// test
// const serverUrl  = 'http://localhost:3000/api/sample?data=';
const serverUrl  = 'https://gtag930.herokuapp.com/api/sample?data=';
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const { Server } = require('ws');
const wss = new Server({ server });
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        axios.get(serverUrl + message);
    });
});*/

const serverUrl = 'http://localhost:3000/api/sample?data=';
// const serverUrl  = 'https://gtag930.herokuapp.com/api/sample?data=';


// tcp socket server

let server = net.createServer(function (socket) {
    console.log('client connected');
    socket.write('Echo server\r\n');
    socket.pipe(socket);

    socket.on('end', function () {
        console.log('client disconnected');
    });

    socket.on('data', function (data) {
        let str = data.toString();
        console.log('data came in', str);

        // send data to server
         axios.get(serverUrl + str);
    });

    socket.on('error', function (error) {
        console.error(error);

    });

    socket.on('close', function () {
        console.info('Socket close');
    });
});

server.listen(PORT, () => {
    console.log('listening...');
});