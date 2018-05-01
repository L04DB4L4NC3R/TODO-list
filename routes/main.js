const app = require('express').Router();
const model = require('../db/model');
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

app.get('/',(req,res)=>{
    res.render('index');
});

app.post('/',(req,res)=>{

    model.update({name:req.session.name},{$push:{list:req.body.items}})
    .then(()=>{
        res.send(req.body);
    }).catch(console.log);

});


module.exports = app;
