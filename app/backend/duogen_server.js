(function runServer() {
    // Imports packages
    var ModbusRTU = require("modbus-serial");
    const fs = require('fs');
    const isReachable = require('is-reachable');
    const os = require('os-utils');
    
    // create server
    const duogenServer = require('http').createServer();
    
    // create socket
    const io = require('socket.io')(duogenServer, {
      transports: ['websocket', 'polling']
    });
    
    const duogenTCPPort = new ModbusRTU();
    const duogenTCPSTBD = new ModbusRTU();
    const koyoTCP = new ModbusRTU();

    // Global variables
    const duogens = {};
    const koyo = {};
    
    function parseSetupFile() {
        let rawdata = fs.readFileSync('setup.json');
        let setupFile = JSON.parse(rawdata);

        duogens[`ip port`] = setupFile[`ip port`];
        duogens[`port port`] = setupFile[`port port`];
        duogens[`ip stbd`] = setupFile[`ip port`];
        duogens[`port stbd`] = setupFile[`port stbd`];

        koyo[`ip`] = setupFile['koyo ip'];
        koyo[`port`] = setupFile[`koyo port`]

        let rawContext = fs.readFileSync('pms_context.json');
        let context = JSON.parse(rawContext);

        duogens[`context`] = context;
        koyo[`context`] = context;
    }
    
    function setUpConnection() {
        parseSetupFile();
    
        // open connection to a tcp line
        (async () => {
            try {
                duogenTCPPort.connectTCP(duogens[`ip port`], { port: duogens[`port port`] });
                duogenTCPPort.setID(1);
            
                duogenTCPSTBD.connectTCP(duogens[`ip stbd`], { port: duogens[`stbd port`] });
                duogenTCPSTBD.setID(1);

                koyoTCP.connectTCP(koyo[`ip`], { port: koyo[`port`] });
                koyoTCP.setID(1);

            } catch(e) {
                await sleep(1000);
                console.log('reconnectint to duogens')
                setUpConnection();
            }
        })();
    }
    
    function clearDuogen() {
        duogens[`port gen`] = Array(20).fill(0);
        duogens[`port bus`] = Array(20).fill(0);
        duogens[`stbd gen`] = Array(20).fill(0);
        duogens[`stbd bus`] = Array(20).fill(0);
    }
    
    
    
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    setUpConnection();
    
    
    io.on('connection', function(client) {
        console.log('connected')
        client.on('message', function(cmd) {
           if (Array.isArray(duogens[`cmds`])) {
             duogens[`cmds`] = duogens[`cmds`].concat([cmd])
          } else {  
          	duogens[`cmds`] = [cmd]
          }
        })
        setInterval(() => {       
            client.emit('duogen', duogens);
      }, 500);
    });
    
    duogenServer.listen(4000);
    
    
    setInterval(function() {
        // check for any change in setupfile
        parseSetupFile();

        try {
            duogenTCPPort.readHoldingRegisters(0, 22, function(err, data) {
                if(!err) duogens[`port gen`] = data.data.splice(0, 22);
                sleep(20)
                duogenTCPPort.readHoldingRegisters(793, 20, function(err, data) {
                    if(!err) duogens[`port bus`] = data.data.splice(0, 20);
                });
            });
            duogens[`updated`] = Date.now();
        } catch(e) {
            console.log(`comm error ${e}`);
        }
        try {
            duogenTCPSTBD.readHoldingRegisters(0, 22, function(err, data) {
                if(!err) duogens[`stbd gen`] = data.data.splice(0, 22);
                sleep(20)
                duogenTCPSTBD.readHoldingRegisters(793, 20, function(err, data) {
                    if(!err) duogens[`stbd bus`] = data.data.splice(0, 20);

                    duogenTCPSTBD.writeCoils(8193, duogens[`context`][`koyo`][`coils`])
                });
            });
            duogens[`updated`] = Date.now();
        } catch(e) {
            console.log(`comm error ${e}`);
        }
        
    }, 1000);
    
    setInterval(() => {
        for (cmd in duogens.cmds) {
            try {
                
            } catch(e) {
                console.log(`error`)
            }
        }
    }, 3000);
    
    // watch for gensys availavility
    setInterval(function() {
        (async () => {   
            // Get ip4
            require('dns').lookup(require('os').hostname(), function (err, add, fam) {
                duogens[`lisen on`] = add; 
              })
            // check if port gensys is reachable  
            if(await isReachable(`${duogens['ip port']}:${duogens['port port']}`)) {
                duogens[`port reachable`] = true
            } else {
                duogens[`port reachable`] = false
                clearDuogen();
                await sleep(3);
                setUpConnection();
            }

            // check if stbd is reachable
            if(await isReachable(`${duogens['ip stbd']}:${duogens['port stbd']}`)) {
                duogens[`stbd reachable`] = true
            } else {
                duogens[`stbd reachable`] = false
                clearDuogen();
                await sleep(3);
                setUpConnection();
            }
        })();
    }, 1000)
    }())
