const express = require('express');
const PORT = process.env.PORT || 8080;
const axios = require('axios').default;
const net = require('net');
//to use mongodb
const mongoose = require('mongoose');


//from the atlas mongodb
const db = 'mongodb+srv://idan:koko1234@g-tag-930.l1iqv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

//connection to db and print "mongodb connected"
mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    .then(() => console.log('mongodb connected'))
    .catch(err => console.error(err));

const schema = new mongoose.Schema({
    color: {type: String, default: '#000000'},
    name: {type: String, default: 'no-name'},
    unitId: {type: String, default: 'def_id'},
    canSendAlerts: {type: Boolean, default: true}, // indicated if the unit can receive alerts, in order to prevent multiple alerts
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    configuration: {type: mongoose.Schema.Types.ObjectId, ref: 'Configuration'},

}, {timestamps: true});


const Unit = mongoose.model('Unit', schema);
module.exports = Unit;
const confschema = new mongoose.Schema({
    name: {type: String, required: true},
    sms: {type: Boolean, default: false},
    call: {type: Boolean, default: false},
    email: {type: Boolean, default: false},
    enabled: {type: Boolean, default: true},

    cpuTemp: {
        type: {
            enabled: {type: Boolean, default: true},
            min: {type: Number, default: 0},
            max: {type: Number, default: 0},
        }
    },
    smsTemp: {
        type: {
            enabled: {type: Boolean, default: true},
            min: {type: Number, default: 20},
            max: {type: Number, default: 30},
        }
    },

    lowBat: {
        type: {
            enabled: {type: Boolean, default: true},
            value: {type: Number, default: 20},
        }
    },

    alertMethods: {
        type: {
            sms: {
                type: {
                    enabled: {type: Boolean, default: false},
                    number: {type: String, default: ''},
                }
            },
            email: {
                type: {
                    enabled: {type: Boolean, default: false},
                    email: {type: String, default: ''},
                }
            },
            sendAlertsFromServer: {type: Boolean, default: true},
            sendAlertsFromUnit: {type: Boolean, default: false},

        }
    }
}, {timestamps: true});


const Configuration = mongoose.model('Configuration', confschema);
module.exports = Configuration;

const app = express();
// test
const serverUrl = 'https://set930.herokuapp.com/api/';

const SOCKET_PORT = 9090;


// tcp socket server
let socketServer = net.createServer(function (socket) {
    console.log('client connected');
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

    socket.on  ('data', function (data)  {
         try  {
            if (data == null) return;
            let str = data.toString();
            console.log('data came in', str);

            if (str.toLowerCase() === 'Send Configuration') {
                console.log('sample came in');
                axios.get(serverUrl + 'sample?data=' + data);
                let uid = str.substring('UID'.length, data.indexOf(' Send'));
                console.log("************************");
                console.log(str);
                console.log(uid);
                let unit = Unit.find({unitId: uid});
                console.log(unit.configuration);
                return;
            }



            if (str.indexOf('Send') !== -1) {
                let uid = str.substring('UID'.length, data.indexOf(' Send'));
                console.log(uid);
                socket.emit("work");
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



