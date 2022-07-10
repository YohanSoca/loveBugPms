const isReachable = require('is-reachable');
let server_ip;

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    server_ip = add;
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

setInterval(function async() {
    try {
        (async () => {
            if(await isReachable(`${server_ip}:4000`)) {
                console.log(`gensys server is up`)
             } else {
                console.log(`gensys server is down, trying to lauch server ....`);
                await sleep(3000);
                 require('child_process').fork('duogen_server.js');
             }
             if(await isReachable(`${server_ip}:6000`)) {
                console.log(`asea server is up`)
             } else {
                console.log(`asea server is down, trying to lauch server ....`);
                await sleep(3000);
                 require('child_process').fork('asea_server.js');
             }
        })()
    } catch(e) {
        console.log(2)
    }
}, 3000)

