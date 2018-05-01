const app = require('express').Router();
const model = require('../db/model');
const util = require('util');

const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

var verify = (req,res,next)=>{
    if(!req.session.name)
        res.redirect('/')
    else
        next();
}

app.get('/',verify,async (req,res)=>{

    // //turn the function into a promise
    // client.get = util.promisify(client.get);
    //
    // // get the list from cache
    // const todos = await client.get(req.session.name);
    //
    // //check if cache exists
    // if(todos){
    //     console.log("Serving from cache: ",todos);
    //     return res.render('index',{data:JSON.parse(todos)});
    // }

    //if ddoesnt then update the cache by quering mongoDB and update the values
    var data = await model.findOne({name:req.session.name})
    if(data) res.render('index',{data:data.list});
    else res.render('index',{data:[]});
});






app.post('/',verify,(req,res)=>{

    model.update({name:req.session.name},{$push:{list:req.body.items}})
    .then(()=>{
        res.redirect('/main');
    }).catch(console.log);

});


module.exports = app;
