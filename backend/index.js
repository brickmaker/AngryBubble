const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const ballConfig = require('./config.json')

app.use(express.static(path.resolve(__dirname + '/../frontend')))

let users = []

io.on('connection', socket => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnect')
  })

  socket.on('enter', name => {
    console.log(`User [${name}] entered.`)
    const newUser = {
      id: socket.id,
      name: name,
      pos: {
        x: Math.random(),
        y: Math.random(),
        z: Math.random()
      },
      size: ballConfig.initSize
    }
    let index
    if ((index = users.findIndex((val) => val.id === newUser.id)) !== -1)
      users[index] = newUser
    else
      users.push(newUser)
    console.log(users)

    socket.emit('welcome', users)
    socket.broadcast.emit('new user enter', newUser)
  })

  socket.on('move', user => {
    socket.broadcast.emit('a user move', user)
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})