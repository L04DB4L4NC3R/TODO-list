const mongoose = require('mongoose');
const redis = require("redis");
const util = require("util");

const client = redis.createClient("redis://127.0.0.1:6379");
client.get = util.promisify(client.get);



//to chain a .cache() to queries
mongoose.Query.prototype.cache = function(){

    this.doCache = true;

    //for chaining
    return this;

}



const exec = mongoose.Query.prototype.exec;

//overwriting the exec function to implement caching logic
mongoose.Query.prototype.exec = async function(){

    if(!this.doCache)
        return exec.apply(this,arguments);

    //making a key out of the query and the collection it belongs to
    var key = JSON.stringify(Object.assign({},this.getQuery(),{
        collection:this.mongooseCollection.name
    }));

    ///check if value exists for given key in cache
    var cacheVal = await client.get(key);
    cacheVal = JSON.parse(cacheVal);

    if(cacheVal && cacheVal.list.length > 0 ) {
        console.log("quering cache");

        //to return a model instance for exec function
        return Array.isArray(cacheVal)
            ? cacheVal.map(d => new this.model(d))
            : new this.model(cacheVal);
    }

    console.log("quering mongoDB");

    //else return mongoDB query
    var result = await exec.apply(this,arguments);

    client.set(key,JSON.stringify(result));

    return result;
}
