const express = require('express')
const path = require('path');
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongodb-session')(session)
// var store = new express.session.MemoryStore()
const store = new MongoStore({
  uri : 'mongodb://tinynew:mC3bTzkqVFFcSS4O@chatdb-shard-00-00-azz0h.mongodb.net:27017,chatdb-shard-00-01-azz0h.mongodb.net:27017,chatdb-shard-00-02-azz0h.mongodb.net:27017/tinynewchat?ssl=true&replicaSet=ChatDB-shard-0&authSource=admin',
  collection : 'session'
})

app.use(express.static('public'))

app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'jade')

app.get('/', (req, res)=> {
  res.render('index')
})

app.get('/chat', (req, res)=>{
  res.render('chatRoom')
})

app.get('/admin', (req, res)=>{
  res.render('listRoom')
})

app.use(session({
  store:  store,
  secret: 'chatnajaeieiza',
  cookie: {
    magAge:1000*60*60
  },
  resave: true,
  saveUninitialized: false
}))

module.exports = app
