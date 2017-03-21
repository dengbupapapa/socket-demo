var express = require('express');
var app = express();

app.use(express.static('./public'));
var server = app.listen(3000);

var io = require('socket.io');
var socket = io.listen(server);

socket.on('connection', function(client) {

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
  })

});

function getTime() {

  var myDate = new Date();

  return myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();

}