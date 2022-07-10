var ModbusRTU = require("modbus-serial");
var duogenTCP = new ModbusRTU();
const fs = require('fs');


const duogenServer = require('http').createServer();


const io = require('socket.io')(duogenServer, {
  transports: ['websocket', 'polling']
});

duogen = {}
cmds = []
ip = ''
port = 0



const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// open connection to a tcp line
duogenTCP.connectTCP("192.168.16.248", { port: 502 });
duogenTCP.setID(1);


io.on('connection', function(client) {
    console.log('connected')
    client.on('message', function(message) {
        console.log(message)
    })
    setInterval(() => {      
        client.emit('duogen', duogen);
        console.log(duogen);
  }, 500);
});

duogenServer.listen(4000);


setInterval(function() {
    try {
        duogenTCP.readHoldingRegisters(0, 22, function(err, data) {
            duogen[`gen`] = data.data.splice(0, 22);

            sleep(20)
            duogenTCP.readHoldingRegisters(793, 28, function(err, data) {
                duogen[`bus`] = data.data.splice(0, 28);

                duogen[`updated`] = Date.now(); 
            });
        });
    } catch(e) {
        duogenTCP.connectTCP("192.168.16.248", { port: 502 });
        console.log(`comm error`)
    }
}, 300);

setInterval(() => {
    for (cmd in cmds) {
        console.log(cmd)
    }
}, 500);
