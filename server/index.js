const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = 3000

app.use(bodyParser.json())

app.get('/', (req,res) => res.send('Hello world'))

server.listen(PORT, (err) => {
  if (err) { throw err }
  console.log(`Server listening on port:${PORT}`)
})