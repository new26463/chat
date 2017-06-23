module.exports = function (server) {
  const io = require('socket.io')(server)
  // var username = data.username
  io.on('connection', ws => {
    ws.emit('message', 'Welcome to chat serv.')
    ws.on('message', msg => {
      io.emit('message',msg)
      console.log(msg)
    })
  })
}
