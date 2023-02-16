// CONSTANTS
const port = 3030;

// MODULES
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const http = require('http');
const server = http.createServer(app);
const localtunnel = require('localtunnel');

const { Server } = require('socket.io');
const io = new Server(server);
let TUNNEL_URL = "";

// Gyro
const gyroMap = new Map();
let BUFFER_LENGTH = 30;
let gyro = new Array();
let time = 0;

setInterval(() => {
    time += 10
}, 10)

app.use(cors());
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/app/:id', (req, res) => {
    // let id = req.params.id;
	const id = "demo";
    // res.sendFile(__dirname + '/client.html', {remoteId: id});
    res.render('client', {remoteId: id}, (err, html) => {
        res.send(html);
    })
    // console.log(gyroMap);
});

app.get('/api/gyro', (req, res) => {
    // const id = req.query.remoteId;
	const id = "demo";
    if (!gyroMap.has(id))
        gyroMap.set(id, []);
    res.send({gyro: gyroMap.get(id)});
    // res.send({gyro: gyro});
})

app.get('/api/url', (req, res) => {
	res.send({url: TUNNEL_URL});
})

app.get('/', (req, res) => {
	// res.redirect('/app/demo');
	res.sendFile(__dirname + '/index.html');
    // res.send("Error 404");
})

io.on('connection', socket => {
    console.log('a user connected.');
    socket.on('coords', (coords, remoteId) => {
		remoteId = "demo";
        if (!gyroMap.has(remoteId))
            gyroMap.set(remoteId, []);

        coords.t = time;
        gyroMap.get(remoteId).push(coords)
        if (gyroMap.get(remoteId).length > BUFFER_LENGTH)
            gyroMap.get(remoteId).shift();
    });

    socket.on('disconnect', () => {
        console.log("a user disconnected.");
        gyroMap.clear();
    })
});

server.listen(port, () => {
    console.log(`Listening on *:${port}.`);
});

// Create local tunnel
(async () => {
	const tunnel = await localtunnel({ port: port });

	// the assigned public url for your tunnel
	// i.e. https://abcdefgjhij.localtunnel.me
	TUNNEL_URL = `${tunnel.url}/app/demo`;
	console.log(`Front-end opened at ${tunnel.url}`);
	console.log(`Tunnel opened at ${TUNNEL_URL}`);

	tunnel.on('close', () => {
		// tunnels are closed
	});
})();
