const app = require('express').Router();
const model = require('../db/model');
const util = require('util');

const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

app.get('/', async (req,res)=>{

    //turn the function into a promise
    client.get = util.promisify(client.get);

    // get the list from cache
    const todos = await client.get(req.session.name);

    //check if cache exists
    if(todos){
        console.log("Serving from cache");
        return res.render('index',{data:JSON.parse(todos)});
    }

    //if ddoesnt then update the cache by quering mongoDB and update the values
    model.findOne({name:req.session.name})
    .then((data)=>{
        client.set(data.name,JSON.stringify(data.list) );
        res.render('index',{data:data.list});
    }).catch(console.log);

});






app.post('/',(req,res)=>{

    model.update({name:req.session.name},{$push:{list:req.body.items}})
    .then(()=>{
        res.redirect('/main');
    }).catch(console.log);

});


module.exports = app;
