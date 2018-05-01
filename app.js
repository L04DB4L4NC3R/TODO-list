const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');
require('./db/connect');
require("./services/cache")

var app =  express();
app.set('view engine','ejs');
app.use(express.static('views'));
app.use(session({
    secret:"shhhhhhhshshshs",
    saveUninitialized:false,
    resave:false
}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use("/main",require('./routes/main'));
app.use(require('./routes/login'));


app.listen(3000,()=>console.log("Listening on port 3000"));
