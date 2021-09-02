const express = require('express');
const PORT = process.env.PORT || 8080;
const axios = require('axios').default;
const net = require('net');

const app = express();
// test
const serverUrl = 'https://set930.herokuapp.com/api/';

const SOCKET_PORT = 9090;


// tcp socket server
let socketServer = net.createServer(function (socket) {
    console.log('client connected');
    socket.write('its work?????????????');
     
    socket.write('Echo server\r\n');
    if(socket==null)return;
    socket.pipe(socket);

    socket.on('end', function () {
        console.log('client disconnected');
    });


    app.post('/contact', (req, res) => {
        const data = { hello: 'hello' }
        broadcast(data); //emit data to all clients
        res.send({ data: 'data emmited' })
    });

    socket.on('data', function (data) {
        try {
            if (data == null) return;
            let str = data.toString();
            console.log('data came in', str);

            if (str.toLowerCase().startsWith('uid')) {
                console.log('sample came in');
                let uid = str.substring('UID'.length, data.indexOf(' Send'));
               
                
                axios.get(serverUrl + 'sample?data=' + data);
                return;
            }


            if (str.toLowerCase() === 'Send Configuration') {
                console.log('unit want to check for configuration');
                broadcast(data); //emit data to all clients
                res.send({ data: 'data emited' })

                socket.emit('new config');
                return;
            }
            app.post('/contact', (req, res) => {
                const data = { hello: 'hello' }
                broadcast(data); //emit data to all clients
                res.send({ data: 'data emmited' })
            });
            if (str.indexOf('Send') !== -1) {
                let uid = str.substring('UID'.length, data.indexOf(' Send'));
                console.log(uid);
                console.log(unit?.uid.getConfiguration());
                socket.emit("work");
                broadcast(data); //emit data to all clients
                res.send({ data: 'data emmited' })
                socket.emit(unit?.uid.getConfiguration());
                return;
            }

            console.log('invalid data');
        } catch (e) {
            log.error('***********************     error in onData   *********************** error in onData', e);
        }

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



