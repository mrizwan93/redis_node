var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config=require('./config.js');
var redis = require("redis");
var client = redis.createClient();

var app = express();

app.use(express.static(__dirname + '/static'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

client.on('connect', function() {
        console.log('Redis is connected');
    });

    client.lpush(['list', 'name', 'rizwan', 'nishant', 'vishal', 'nikhil', 'Amol'],function(err,doc){
        if(err){
            console.log(err);
        }else{
            console.log("set"+doc)
        }
    });

    client.rpush(['list', '1', '2', '3', '4', '5'],function(err,doc){
        if(err){
            console.log(err);
        }else{
            console.log("set"+ doc)
        }
    });

    client.lrange('list', 0, -1, function(err, doc){
        if(err){
            console.log(err);
        }else{
            console.log("list : \n"+ doc)
        }
    });

    client.hmset('hashset', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');

    client.hgetall('hashset', function(err, object) {
        console.log("Hash Set :\n"+ object);
    });

    client.sadd(['set', 'name', 'rizwan', 'nishant', 'vishal', 'nikhil'],function(err, doc){
        if(err){
            console.log(err);
        }else{
            console.log("set : \n"+ doc)
        }
    });

    client.smembers('set',function(err, doc){
        if(err){
            console.log(err);
        }else{
            console.log(doc)
        }
    });

    client.exists('list', function(err, reply) {
        if (reply === 1) {
            console.log('exists');
        } else {
            console.log('doesn\'t exist');
        }
    });

    client.set('key1', 10, function() {
        client.incr('key1', function(err, reply) {
            console.log(reply); // 11
        });
    });


app.get('*', function(req, res) {
    res.sendFile(__dirname + '/static/app/views/index.html');
});


var server = app.listen(config.port, function (err) {
    if(err) {
        console.log(err);
    } else {
    var host = server.address().address;
    console.log('server listening at http://%s:%s', host, config.port);
    }
});

process.on('uncaughtException', function(err) {
    console.log(err);
});
