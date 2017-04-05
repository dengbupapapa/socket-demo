window.onload = function() {

    var socket = io.connect();

    socket.on('connect', function() {

        console.log('You are connected to Server');

        var nameval = prompt('你的名字：');
        var userName = document.getElementById('userName');

        userName.innerHTML = '欢迎您' + nameval;
        socket.emit('join', nameval);

    });

    socket.on('disconnect', function() {
        console.log('You are disconnect to Server');
    });
    socket.on('announcement', function(msg) { //用户连接提示
        addMessage(msg.name, msg.text, 'announcement', msg.time);
    });

    socket.on('message', function(msg) { //用户消息
        addMessage(msg.name, msg.text, 'thirdPerson', msg.time);
    });
    // String

    socket.on('String', function(msg) { //单点推送实验
        console.log(msg);
    })

    var input = document.getElementById('input');

    input.onkeydown = function(event) { //chlient 输出

        if (event.keyCode == 13 && this.value) {

            var li = addMessage('我', this.value, 'me', getTime());

            socket.emit('text', this.value, function(data) {

                var didStyle = li.className;

                li.className = 'OK ' + didStyle;
                li.title = data;

            });

            this.value = '';

        }

    }

    function addMessage(name, text, className, time) { //聊天窗添加信息

        var li = document.createElement('li');
        var b = document.createElement('b');
        var span = document.createElement('span');
        var p = document.createElement('p');

        b.innerHTML = name + (!text ? '已连接' : '');
        span.innerHTML = time;
        p.innerHTML = text;

        if (text) {

            li.appendChild(b);
            li.appendChild(span);
            li.appendChild(p);

        } else {

            li.appendChild(b);
            li.appendChild(span);

        }

        li.className = className;

        document.getElementById('message').appendChild(li);

        return li;

    }

    function getTime() {

        var myDate = new Date();

        return myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();

    }

}