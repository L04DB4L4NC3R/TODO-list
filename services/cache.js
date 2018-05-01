const mongoose = require('mongoose');
const redis = require("redis");
const util = require("util");

const client = redis.createClient("redis://127.0.0.1:6379");
client.get = util.promisify(client.get);





const exec = mongoose.Query.prototype.exec;

//overwriting the exec function to implement caching logic
mongoose.Query.prototype.exec = async function(){

    console.log('changed exec function called');

    //making a key out of the query and the collection it belongs to
    var key = JSON.stringify(Object.assign({},this.getQuery(),{
        collection:this.mongooseCollection.name
    }));

    ///check if value exists for given key in cache
    var cacheVal = await client.get(key);

    if(cacheVal){
        console.log("Exists in cache");
        return cacheVal;
    }

    console.log("quering mongoDB");
    
    //else return mongoDB query
    var result = await exec.apply(this,arguments);

    return result;
}
