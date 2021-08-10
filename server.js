const express = require('express');
const PORT = process.env.PORT || 8080;
const axios = require('axios').default;
const net = require('net');

const app = express();

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
        //  console.log('data came in', str);

        if (str.toLowerCase().startsWith('uid')) {
            console.log('sample came in');
            // send data to server
            axios.get(serverUrl + '/sample?data=' + str);
        }

        if (str.toLowerCase() === 'send configuration') {
            console.log('unit want to check for configuration');
            socket.emit("work");
            socket.emit(unit.unitId.getConfiguration());
            return;
        }

        console.log('invalid data came');

    });

    socket.on('error', function (error) {
        console.error(error);

    });

    socket.on('close', function () {
        console.info('Socket close');
    });
});

server.listen(PORT, () => {
    console.log('socket server is listening on port ' + PORT);
});


app.get('/', (req, res) => {
    res.json({message: 'Hi from g-tag server'});
});

app.listen(3000, () => {
    console.log('http server is listening on port ' + 3000);
});
