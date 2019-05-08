const childProcess = require('child_process');
const http = require('http');
const fs = require('fs');

// let serialIn = childProcess.exec(`cat < ./server.js`, (err, stdout, stderr) => {
//     if (err) throw err;

//     console.log(stdout);
//     console.log(stderr);
// });

let serialIn;

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        childProcess.exec(`echo -ne '${chunk.toString()[0]}' > /dev/ttyUSB0`);
    }
});

let serv = http
    .createServer((req, res) => {
        req.query = parseQuery(req.url);
        if (req.url === '/') {
            fs.readFile('./index.html', (err, data) => {
                if (err) throw err;
                res.write(data);
                res.end();
            });
        } else if (req.url === '/main.js') {
            fs.readFile('./main.js', (err, data) => {
                if (err) throw err;
                res.write(data);
                res.end();
            });
        } else if (req.url === '/main.css') {
            fs.readFile('./main.css', (err, data) => {
                if (err) throw err;
                res.write(data);
                res.end();
            });
        } else if (req.url === '/auto') {
            let val = 0x10;
            let msg = `${String.fromCharCode(val)}`;
            childProcess.exec(`echo -ne '${msg}' > /dev/ttyUSB0`);
            res.end();
        } else if (req.url === '/manuel') {
            let val = 0x20;
            let msg = `${String.fromCharCode(val)}`;
            childProcess.exec(`echo -ne '${msg}' > /dev/ttyUSB0`);
            res.end();
        } else {
            if (req.url.match('/key')) {
                let val = 1 << 6;
                if (req.query.way === 'd') val |= 1 << 5;
                if (req.query.key === 'w') val |= 1;
                else if (req.query.key === 's') val |= 1 << 1;
                else if (req.query.key === 'a') val |= 1 << 2;
                else if (req.query.key === 'd') val |= 1 << 3;
                if (req.query.key === 'r') val |= 1 << 4;
                let msg = `${String.fromCharCode(val)}`;
                childProcess.exec(`echo -ne '${msg}' > /dev/ttyUSB0`);
                res.end();
            } else if (req.url.match('/joystick')) {
                let val1 = (1 << 7) | req.query.x;
                console.log(val1);
                let val2 = (1 << 7) | req.query.y;
                let msg1 = `${String.fromCharCode(val1)}`;
                let msg2 = `${String.fromCharCode(val2)}`;
                childProcess.execSync(`echo -ne '${msg1}' > /dev/ttyUSB0`);
                childProcess.execSync(`echo -ne '${msg2}' > /dev/ttyUSB0`);
                res.end();
            }
        }
    })
    .listen(8000);

function parseQuery(url) {
    let urlParseKey = url.match(/\w+(?==)/g);
    let urlParseValues = url.match(/=[\w-]+/g);
    if (
        !urlParseKey ||
        !urlParseValues ||
        urlParseKey.length !== urlParseValues.length
    ) {
        return {};
    }
    let query = {};
    for (let i = 0; i < urlParseKey.length; i++) {
        query[urlParseKey[i]] = urlParseValues[i].substring(1);
    }
    return query;
}
