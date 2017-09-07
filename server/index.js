const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = 3000
const locationMap = new Map()

app.use(express.static(path.resolve(__dirname, '../public')))
app.use(bodyParser.json())

io.on('connection', (socket) => {

  socket.on('location:update', (pos) => {
    locationMap.set(socket.id, pos)
    socket.emit('location:update', Array.from(locationMap))
  })

  socket.on('disconnect', () => {
    socket.emit('client:disconnect', socket.id)
    locationMap.delete(socket.id)
  })

})

server.listen(PORT, (err) => {
  if (err) { throw err }
  console.log(`Server listening on port:${PORT}`)
})