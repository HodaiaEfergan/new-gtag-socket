const express = require('express');
const PORT = process.env.PORT || 80;
const LOCAL_IP = '0.0.0.0';
const axios = require('axios').default;
const net = require('net');
const mongoose = require('mongoose');

const serverUrl = 'https://set930.herokuapp.com/api/';
const db = 'mongodb+srv://idan:koko1234@g-tag-930.l1iqv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

//connection to db and print "mongodb connected"
// test
mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    .then(() => console.log('mongodb connected'))
    .catch(err => console.error(err));



// tcp socket server

let server = net.createServer(function (socket) {
    console.log('client connected');
    // socket.write('Echo server\r\n');
    if(socket==null)return ;
    socket.pipe(socket);

    socket.on('end', function () {
        console.log('client disconnected');
    });

    socket.on('data', function (data) {
        try{
            let str = data.toString();
            console.log('data came in', str);


            // todo unit should send json like : {unitId: 'XYZ', 'cmd': 'requestConfiguration'}

            if (str.indexOf(Send) !== -1) {
                let uid = str.substring('UID'.length, data.indexOf(' Send'));
                console.log(uid);
                console.log(unit?.uid.getConfiguration());
                socket.emit("work");
                socket.emit(unit?.uid.getConfiguration());
                return;
            }

            // send data to server
            axios.get(serverUrl + '/sample?data=' + str);
        }
        catch (e) {
           console.error(e);
        }

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
