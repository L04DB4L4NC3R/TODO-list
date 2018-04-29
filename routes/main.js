const app = require('express').Router();

const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

app.get('/',(req,res)=>{
    res.render('index');
});

app.post('/',(req,res)=>{
    res.send(req.body);
});


module.exports = app;
