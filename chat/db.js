const mongoose = require('mongoose')
mongoose.connect('mongodb://tinynew:mC3bTzkqVFFcSS4O@chatdb-shard-00-00-azz0h.mongodb.net:27017,chatdb-shard-00-01-azz0h.mongodb.net:27017,chatdb-shard-00-02-azz0h.mongodb.net:27017/tinynewchat?ssl=true&replicaSet=ChatDB-shard-0&authSource=admin')

var user_Schema = mongoose.Schema({
    doctype : String,
    username : String,
    email : String,
    phone : String,
    question : String,
    message : {
      to : String,
      form : String,
      msg : String
    }
},{collection: 'chat'})


module.exports =  { user : mongoose.model('user',user_Schema) }
