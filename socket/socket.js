const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = 3030;

const cors = require('cors')

const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors());

io.on("connection", (socket) => {
    // send a message to the client
    socket.emit("gyro", [0, 0]);

    // receive a message from the client
    socket.on("receive-gyro", (...args) => {
        console.log(args);
    });
});

app.get('/api/gyro', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});