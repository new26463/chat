const app = require('./app')
const mongoose = require('mongoose')
    , Admin = mongoose.mongo.Admin
const db = require('./db');
  /// create a connection to the DB
  var connection = mongoose.createConnection(
    'mongodb://tinynew:mC3bTzkqVFFcSS4O@chatdb-shard-00-00-azz0h.mongodb.net:27017,chatdb-shard-00-01-azz0h.mongodb.net:27017,chatdb-shard-00-02-azz0h.mongodb.net:27017/tinynewchat?ssl=true&replicaSet=ChatDB-shard-0&authSource=admin');
  connection.on('open', function() {
      // connection established
      new Admin(connection.db).listDatabases(function(err, result) {
          console.log('listDatabases succeeded');
          // database list stored in result.databases
          var allDatabases = result.databases;
          // forEach()
          // console.log(allDatabases)

          // user_Schema.find(function (err, user_Schema) {
          // if (err) return console.error(err)
          //   console.log(user_Schema)


          for(var k in result) {
            // test.append()
           // Concatenate the new array onto the original

            console.log(k, result[k]);
          }
      })
  })
// })
