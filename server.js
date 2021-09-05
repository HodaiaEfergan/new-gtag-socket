const express = require('express');
const PORT = process.env.PORT || 8080;
const axios = require('axios').default;
const net = require('net');

const app = express();

const serverUrl = 'https://set930.herokuapp.com/api/';
// const serverUrl = 'http://localhost:3000/api/';

const SOCKET_PORT = 9090;

let clients = {};

// tcp socket server
let socketServer = net.createServer(function (socket) {
     //socket.write("test");

    console.log('client connected');
    // socket.write('Echo server\r\n');
    if (socket == null) return;
     //socket.write("test1");
     console.log("*********************************");
     socket.pipe(socket);

    socket.on('end', function () {
        console.log('client disconnected');
    });


    socket.on('data', async function (data) {
        try {
            if (data == null) return;
            let str = data.toString();
             socket.write(str);
             console.log('data came in', str);

            if (str.toLowerCase().endsWith('send configuration')) {
                 socket.write("test3");
                let uid = str.substring('UID'.length, data.indexOf(' Send'));
                console.log('unit want to check for configuration ' + uid);
                // clients[uid] = socket;

                // get unit config from the other server
                try {
                    let res = await axios.get(serverUrl + 'u-config?uid=' + uid);
                    //console.log(res.data);
                    socket.write("test4");
                    socket.write(JSON.stringify(res.data));
                    console.log(JSON.stringify(res.data));
                } catch (e) {
                     socket.write("test5");
                    console.error('could not get unit config ', e);
                }
                return;
            }

             if(str.toLowerCase().startsWith('got config')){
                  socket.write(str);
             }

            if (str.toLowerCase().startsWith('uid')) {
                console.log('sample came in');
                axios.get(serverUrl + 'sample?data=' + data);
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
