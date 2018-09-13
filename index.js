let express = require('express');
let app = express();
let bodyParser =require('body-parser');
let passport = require('passport');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let game = require('./game');
let history = require('./models').history;
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

require('./routes')(app);

const usersInGame = [];

function answer(username, type) {
    return (num, oldNum) => {
        io.emit('newNumber', num);
        history.create({
            username: username,
            pick: type,
            result: oldNum,
        }).then(result => {
            io.emit('history', result.dataValues);
        });
    };
}

io.on('connection', function (socket) {
    socket.on('register', function (username) {
        usersInGame.push(username);
        io.emit('updateUsers', usersInGame);
        io.emit('newNumber', game.getNumber());
        socket.on('normal', () => {
            game.normal(answer(username, 'normal'));
        });
        socket.on('fizz', () => {
            game.fizz(answer(username, 'fizz'));
        });
        socket.on('buzz', () => {
            game.buzz(answer(username, 'buzz'));
        });
        socket.on('fizzbuzz', () => {
            game.fizzbuzz(answer(username, 'fizzbuzz'));
        });
        socket.on('disconnect', () => {
            usersInGame.splice(usersInGame.indexOf(username), 1);
            io.emit('updateUsers', usersInGame);
        });
    });
});

server.listen(8000, function () {
    console.log("Server started")
});
