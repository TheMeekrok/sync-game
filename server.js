// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

//
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Маршруты
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
server.listen(5000, () => {
    console.log('Запускаю сервер на порте 5000');
});

var players = {};

// Обработчик веб-сокетов
io.on('connection', socket => {
    //console.log(socket.id);
    socket.on('new player', () => {
        players[socket.id] = {
            x: 300,
            y: 300
        };
    });

    socket.on('movement', data => {
        var player = players[socket.id] || {};

        if (data.left) {
            player.x -= 5;
        }
        if (data.up) {
            player.y -= 5;
        }
        if (data.right) {
            player.x += 5;
        }
        if (data.down) {
            player.y += 5;
        }
    });
});

setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / 60);