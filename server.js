const express = require('express');
const PORT = process.env.PORT || 8080;
const axios = require('axios').default;
const net = require('net');

const serverUrl = 'https://set930.herokuapp.com/api/';


// tcp socket server

let server = net.createServer(function (socket) {
    console.log('client connected');
    // socket.write('Echo server\r\n');
    socket.pipe(socket);

    socket.on('end', function () {
        console.log('client disconnected');
    });

    socket.on('data', function (data) {
        let str = data.toString();
        console.log('data came in', str);


        // todo unit should send json like : {unitId: 'XYZ', 'cmd': 'requestConfiguration'}

        if (str.toLowerCase() === 'send configuration') {
            console.log('unit want to check for configuration');
            socket.emit("work")
            socket.emit(unit.unitId.getConfiguration());
            return;
        }

        // send data to server
        axios.get(serverUrl + '/sample?data=' + str);
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
