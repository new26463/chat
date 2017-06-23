const express = require('express')
const app = express()
const path = require('path')
const socket = require('socket.io')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const bodyParser = require('body-parser')
const db = require('./db')
const server = require('./chat')
const store = new MongoStore({
  uri : 'mongodb://tinynew:mC3bTzkqVFFcSS4O@chatdb-shard-00-00-azz0h.mongodb.net:27017,chatdb-shard-00-01-azz0h.mongodb.net:27017,chatdb-shard-00-02-azz0h.mongodb.net:27017/tinynewchat?ssl=true&replicaSet=ChatDB-shard-0&authSource=admin',
  collection : 'session'
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(session({
  store:  store,
  secret: 'chatnajaeieiza',
  cookie: {
    magAge:1000*60*60
  },
  resave: true,
  saveUninitialized: false
}))

app.route('/')
  .get((req, res)=> {
    pageName : 'register'
    if(req.session.username == undefined){
      res.render('index')
      console.log(req.session.username)
    }else{
      res.redirect('/chat')
    }
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

  app.route('/chat')
    .get((req, res)=>{
      if(req.session.username==undefined){
        console.log(req.session.username)
        res.redirect('/');
      }else{
        console.log('user login success');
        // test destroy session
        // console.log(req.session.username)
        // console.log('eieieiei')
        res.render('chatRoom',{
          pageName : 'Chat Realtime eiei',
          data : req.session
        })
      }
    })
    .post((req,res)=>{
      req.session.destroy()
      res.redirect('/')
    })
//
//    login logout ยังไม่สมบูรณ์ บัคออกไม่ได้ งงงวยกับ session
//

  app.route('/admin')
    .get((req, res)=>{
        console.log(req.body.idAdmin);
      if(req.session.idAdmin===undefined){
        res.render('login_admin',{
          pageName : 'Admin ja'
        })
      }else {
        console.log('eiei za 5566');
        res.redirect('/listChat');
      }
      // else{
      //   req.session.destroy()
      // }
    })
    .post((req,res)=>{
      if((req.body.idAdmin === 'admin') && (req.body.passwordAdmin === '123456')){
        req.session.idAdmin = req.body.idAdmin
        req.session.passwordAdmin = req.body.passwordAdmin
        res.redirect('/listChat')
        console.log('login admin success')
      }else{
        console.log('login admin failed')
        res.redirect('/admin');
      }
    })

  app.route('/listChat')
    .get((req,res)=>{
      console.log(req.session.idAdmin)
      if(req.session.idAdmin===undefined){
        console.log('not found admin ja')
        res.redirect('/admin')
      }else{
        console.log('found admin ja')zz
        // res.render('listRoom')
      }
    })
    .post((req,res)=>{
      req.session.destroy()
      console.log('logout naja')
    })

module.exports = app
