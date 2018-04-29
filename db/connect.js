const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/caching');

mongoose.connection
.once('open',()=>console.log('connected to mongodb'))
.on('error',console.log);
