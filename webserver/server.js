const redis = require("redis");
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const sub = redis.createClient();
const pub = redis.createClient();

server.listen(3000);
console.log('Server started at http://localhost:3000');

io.on('connection', function (socket) {
    sub.on("message", (channel, payload) => {
        socket.emit('messages', payload);
    });
    sub.subscribe('ClientMessages');

    socket.on('messages', (data) => {
        pub.publish('ServerMessages', data);
    });
  
});