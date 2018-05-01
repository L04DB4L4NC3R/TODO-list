const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:String,
    list:[]
});


var model = mongoose.model('item',schema);

module.exports = model;
