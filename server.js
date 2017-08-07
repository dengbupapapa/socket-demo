var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require("express-session");
var RedisStore = require('connect-redis')(session);
var sessionMiddleware = session({
    // store: new RedisStore({
    //     host: '127.0.0.1',
    //     port: 6379,
    //     db: 0
    // }),
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat',
    cookie: {
        maxAge: 100000
    }
});
var server = app.listen(8000, function() {
    console.log('server is localhost:8000');
});

var io = require('socket.io');
var ios = io.listen(server);

var userKeyForSockets = {};

ios.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(cookieParser());
app.use(sessionMiddleware);

app.use(express.static('./public'));

// ios.use()
ios.on('connection', function(client) {

    console.log('someone connected');

    userKeyForSockets[client.request.session.demoId] = client.id

    client.on('join', function(name) { //登陆时发起提醒用户连接广播出去
        client.nickname = name;
        client.broadcast.emit('announcement', {
            name: name,
            time: getTime()
        });
    });

    client.on('text', function(text, fn) { //各客户端发来的消息广播出去
        client.broadcast.emit('message', {
            name: client.nickname,
            text: text,
            time: getTime()
        });
        fn(getTime());
    });

    client.on('disconnect', function(msg) { //关闭移除
        delete userKeyForSockets[client.request.session.demoId];
        console.log(userKeyForSockets);
    });

});

app.get('/', function(req, res, next) {
    req.session.demoId = req.query.user || 'none';
    res.sendFile(__dirname + '/public/demo.html');
});

app.get('/chat/:user', function(req, res, next) { //单点推送
    var user = req.params.user;
    // console.log(!!userKeyForSockets[user]);
    if (!!userKeyForSockets[user]) {
        ios.sockets.sockets[userKeyForSockets[user]].emit('String', {
            user
        });
    }
    console.log(userKeyForSockets);
    res.end('我推给了' + user);
});

function getTime() {

    var myDate = new Date();

    return myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();

}