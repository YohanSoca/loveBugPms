

    const fs = require('fs');
    const isReachable = require('is-reachable');
    const os = require('os-utils');
    
    // create server
    const aseaServer = require('http').createServer();
    
    // create socket
    const io = require('socket.io')(aseaServer, {
      transports: ['websocket', 'polling']
    });
    
    
    

    // Global variables
    const asea = {};
    asea[`author`] = 'Yohan';
    
    
    
    
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    
    
    
    io.on('connection', function(client) {
        console.log('connected')
        client.on('message', function(cmd) {
           
        })
        setInterval(() => {       
            client.emit('asea', asea);
      }, 500);
    });
    
    aseaServer.listen(4001);
    
    
   