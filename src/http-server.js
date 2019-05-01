const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {
  generateNotifyNewUserAndLeftUserServerMessage,
  generateWelcomeServerMessage,
  generateUserMessage,
  generateUserLocationMessage } = require('./utils/message')
const { addUser, getUser, removeUser, getUsersInRoom } = require('./utils/users')
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDirectoryPath))

io.on('connection', socket => {
  console.log('Socket is start!')

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options})
    if (error) return callback(error)

    const { name, room } = user
    
    socket.join(room)
    socket.emit('message', generateWelcomeServerMessage())
    socket.broadcast.to(room).emit('message', generateNotifyNewUserAndLeftUserServerMessage(name))
    io.to(room).emit('information', {
      users: getUsersInRoom(room),
      room,
    })
    callback()
  })

  
  socket.on('send:message', (message, callback) => {
    const user = getUser(socket.id)
    if (!user) return
    const { name, room } = user
    io.to(room).emit('message', generateUserMessage(name, message, callback))
  })

  socket.on('send:location', (location, callback) => {
    const user = getUser(socket.id)
    if (!user) return 
    const { name, room } = user
    console.log(generateUserLocationMessage(name, location, callback))

    io.to(room).emit('message', generateUserLocationMessage(name, location, callback))
  })

  socket.on('disconnect', callback => {
    const user = removeUser(socket.id)
    if(user) {
      const { name, room } = user 
      io.to(room).emit('message', generateNotifyNewUserAndLeftUserServerMessage(name, true))
      io.to(room).emit('information', {
        users: getUsersInRoom(room),
        room,
      })
    }
  })
})


module.exports = server