const express = require('express');
const bodyparser = require('body-parser');
require('./db/connect');

var app =  express();
app.set('view engine','ejs');
app.use(express.static('views'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(require('./routes/main'));


app.listen(3000,()=>console.log("Listening on port 3000"));
