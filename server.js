/**
 * Created by Administrator on 2017/1/18.
 */
const net = require('net');

var clients = {};

var server = net.createServer(socketConnect);

function socketConnect(socket){

    //这里是函数功能-- 登录模块
    // 包括 登录 广播谁上线,以及广播在线数
    function signin(name){
        // 只有在登录的时候做
        clients[name] = socket;

        // 这是对象遍历的方法
        for(var username in clients){
            //console.log(username);
            var client = clients[username];
            //console.log(client);

            //这个client 就是一个socket通道, socket连接着服务器端和客户端,
            // 任意一方往通道里写数据, 相对应那一方就会产生data事件
            client.write(`${name}上线了 当前在线${Object.keys(clients).length}人`)
        }
        //console.log(`${name}上线了 当前在线${Object.keys(clients).length}人`)
    }
    function broadcast(name,message){

        // 这是对象遍历的方法
        for(var username in clients){
            var client = clients[username];

            client.write(name+':'+message)
        }
        //console.log(`${name}上线了 当前在线${Object.keys(clients).length}人`)
    }
    function p2p(name, target, message){
        //console.log(`${name}:${message}`);
        clients[target].write(`${name}:${message}`);
    }


    var client = socket.remoteAddress;
    client = client.split(':');
    client = client[client.length - 1];
    var port = socket.remotePort;
    console.log(client+':'+port);

    socket
        .on('data', (chunk)=>{

        var signal = JSON.parse(chunk.toString().trim());
        var protocol = signal.protocol;
        var username = signal.username;
        var message = signal.message;
        var target = signal.to;

        switch(protocol){
            case 'signin':
                signin(username);
                break;
            case 'broadcast':
                broadcast(username,message);
                break;
            case 'p2p':
                p2p(username, target, message);
                break;
            default :
                console.log("不知道要干嘛,你重新来");
                break;
        }
    })
        .on('error',(err)=>{
            console.log('有人断开');
            var deleteKey;
            for(var username in clients){
                var client = clients[username];
                if(socket == client){
                    deleteKey = username;
                }
            }

            delete clients[deleteKey];
            console.log(deleteKey+ `下线了,当前在线${Object.keys(clients).length}人`)
            broadcast(deleteKey, `下线了,当前在线${Object.keys(clients).length}人`);

        })
    //console.log('有人连我了');
}

server.listen(3000, (err)=>{

    if(err){
        console.log('端口被占用');
        return false;
    }
    console.log('服务器正常监听3000端口');

})