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
    console.log('received coordinates:', pos)
    if (!locationMap.has(socket.id)) {
      locationMap.set(socket.id, pos)
    }
  })

  socket.on('disconnect', () => locationMap.delete(socket.id))

})

server.listen(PORT, (err) => {
  if (err) { throw err }
  console.log(`Server listening on port:${PORT}`)
})