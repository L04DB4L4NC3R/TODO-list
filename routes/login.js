const app = require('express').Router();
var model = require('../db/model');

app.get('/',(req,res)=>{
    res.render('login');
});

app.post('/',(req,res)=>{

    model.findOne({name:req.body.name}).then((data)=>{

        if(!data){
            model.create(req.body)
            .then((user)=>{
                console.log(user);
                req.session.name = req.body.name;
                res.redirect('/main');
            })
            .catch(console.log);
        }
        else
            res.send('user already exists');

    })

});

app.get('/logout',(req,res)=>{
    req.session.name = '';
    res.redirect('/');
});


module.exports = app;
