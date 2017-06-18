const express = require('express')
const path = require('path');
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const bodyParser = require('body-parser')
const db = require('./db')
const store = new MongoStore({
  uri : 'mongodb://tinynew:mC3bTzkqVFFcSS4O@chatdb-shard-00-00-azz0h.mongodb.net:27017,chatdb-shard-00-01-azz0h.mongodb.net:27017,chatdb-shard-00-02-azz0h.mongodb.net:27017/tinynewchat?ssl=true&replicaSet=ChatDB-shard-0&authSource=admin',
  collection : 'session'
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

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')


//
// var test = mongoose.model('test',user_Schema);
// var user1 = new test({
//   username : "testjaeiei",
//   email : "eiei@gmail",
//   phone : "13456754",
//   question : "fdklg;nfssg;",
//   message : {
//     to : "eeeeee",
//     form : "fnklskl"
//   }
// })
// console.log(user1)

app.route('/')
  .get((req, res)=> {
    res.render('index')
  })
  .post((req, res)=>{
    req.session.username = req.body.username
    req.session.email = req.body.email
    req.session.phone = req.body.phone
    req.session.question = req.body.question
    var user_contact = new db.user({
      doctype : 'docclient',
      username : req.session.username,
      email : req.session.email,
      phone : req.session.phone,
      question : req.session.question
    })
    user_contact.save(err=>{
      if(err)
        console.log('error na ja' + err)
      else{
        console.log('complete jaaa')
        res.redirect('/chat')
      }
    })
  })
app.get('/chat', (req, res)=>{
    res.render('chatRoom',{
      pageName : 'Chat Realtime',
      data : req.session
    })
  })

app.get('/admin', (req, res)=>{
  res.render('listRoom',{
    pageName : 'Admin ja'
  })
})

module.exports = app
