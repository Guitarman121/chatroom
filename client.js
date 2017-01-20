/**
 * Created by Administrator on 2017/1/18.
 */


/**********************************
 * 登录功能
 * 1.让用户注册  只要输入名字就完成注册
 * 2.创建一个与服务端的socket连接
 * 3.往这个socket连接中写数据
 ************************************/

    //process.stdout.write('请输入你的名字');
    //process.stdin.on('data',(input)=>{
    //
    //});
const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 前后端数据通讯  一定是有数据格式的约定
// 工作中常用的数据格式  "signin"|"hrh"|"你好"
//  我们学习了json格式 {"protocol":"signin"}

rl.question('What is your name ', (name) => {

    name = name.toString().trim();
    var user = {
        protocol: 'signin',
        username: name
    }

    rl.setPrompt(name + '>');

    //建立与服务器的连接
    const client = net.connect({port: 3000, host: '192.168.0.141'}, () => {
        // 'connect' listener
        console.log('connected to server!');
        client.write(JSON.stringify(user));
    });

    // 处理socket通道内的信息
    client.on('data',(chunk)=>{
        console.log(chunk.toString());
    });

    rl.prompt();

    // 处理用户输入
    rl.on('line', (line) => {

        line = line.toString().trim();
        var temp = line.split(':');
        //console.log(temp.length);

        var send;

        if(temp.length == 2){
            send = {
                protocol:'p2p',
                username: name,
                to: temp[0],
                message: temp[1]
            }
        }else{
            send = {
                protocol:'broadcast',
                username: name,
                message:line

            };
        }



        client.write(JSON.stringify(send));
    });

    //rl.close();
});
/*
const net = require('net');
const client = net.connect({port: 3000, host: '192.168.0.103'}, () => {
    // 'connect' listener
    console.log('connected to server!');
    client.write('world!\r\n');
});
client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});
client.on('end', () => {
    console.log('disconnected from server');
});
    */