const express = require('express')
const app = express()
const path = require('path')
const socket = require('socket.io')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const bodyParser = require('body-parser')
const db = require('./db')
const q = require('./q')
const server = require('./chat')
const store = new MongoStore({
  uri : 'mongodb://tinynew:mC3bTzkqVFFcSS4O@chatdb-shard-00-00-azz0h.mongodb.net:27017,chatdb-shard-00-01-azz0h.mongodb.net:27017,chatdb-shard-00-02-azz0h.mongodb.net:27017/tinynewchat?ssl=true&replicaSet=ChatDB-shard-0&authSource=admin',
  collection : 'session'
})
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// เก็บ session

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

  // เช็คว่ามีการเข้าสู่ระบบอยู่หรือไม่

  .get((req, res)=> {
    pageName : 'register'
    if(req.session.username === undefined){
      res.render('index')
      console.log(req.session.username)
    }else{
      res.redirect('/chat')
    }
  })

  // เก็บข้อมูลที่ user กรอกใส่ใน session

  .post((req, res)=>{
    req.session.username = req.body.username
    req.session.email = req.body.email
    req.session.phone = req.body.phone
    req.session.question = req.body.question

  //

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

    // ถ้ามีการเข้าถึง /chat จะเช็คว่า login แล้วหรือยัง

    .get((req, res)=>{
      if(req.session.username===undefined){
        console.log(req.session.username)
        res.redirect('/');
      }else{
        console.log('user login success');
        res.render('chatRoom',{
          pageName : 'Chat Realtime eiei',
          data : req.session
        })
      }
    })

    // ถ้ากดออกจากการสนทนา จะ destroy session

    .post((req,res)=>{
      req.session.destroy()
      res.redirect('/')
    })

  app.route('/admin')

    // เช็คว่ามีการเข้าสู่ระบบของ admin อยู่หรือไม่

    .get((req, res)=>{
      pageName : 'Admin ja'
      console.log(req.session.idAdmin);
      if((req.session.idAdmin === undefined)){
        console.log('not equal');
        res.render('login_admin')
      }else if((req.session.idAdmin==='admin')){
        console.log('admin session')
        res.redirect('/listChat')
      }
    })

    // เช็ค login ว่าใช่ admin หรือไม่ ถ้าไม่ใช่จะทำลาย session กรณีกด logout

    .post((req,res)=>{
      if((req.body.idAdmin === 'admin') && (req.body.passwordAdmin === '123456')){
        req.session.idAdmin = req.body.idAdmin
        req.session.passwordAdmin = req.body.passwordAdmin
        res.redirect('/listChat')
        console.log('login admin success')
      }else{
        req.session.destroy()
        console.log('login admin failed')
        res.redirect('/admin')
      }
    })

  app.route('/listChat')

    // เมื่อมีคนเข้าหน้าเว็บ /listChat เช็คว่าเป็น admin หรือไม่

    .get((req,res)=>{
      pageName : 'listroom by admin'
      console.log(req.session.idAdmin)
      if(req.session.idAdmin!='admin'){
        console.log('not found admin')
        res.redirect('/admin')
      }else if(req.session.idAdmin==='admin'){
        console.log('found admin ja')
        res.render('listroom')
    }
  })

  app.get('/q',(req,res)=>{
    // res.send('q');
    res.render('q')

  })

module.exports = app
