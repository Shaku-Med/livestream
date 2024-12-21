import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const app = express()
  const server = http.createServer(app)
  const io = new Server(server)

  io.on('connection', (socket) => {
    socket.on('broadcaster', () => {
      socket.broadcast.emit('broadcaster')
    })

    socket.on('watcher', () => {
      socket.to('broadcaster').emit('watcher', socket.id)
    })

    socket.on('offer', (id, message) => {
      socket.to(id).emit('offer', socket.id, message)
    })

    socket.on('answer', (id, message) => {
      socket.to(id).emit('answer', socket.id, message)
    })

    socket.on('candidate', (id, message) => {
      socket.to(id).emit('candidate', socket.id, message)
    })

    socket.on('disconnect', () => {
      socket.to('broadcaster').emit('disconnectPeer', socket.id)
    })
  })

  app.all('*', (req, res) => nextHandler(req, res))

  server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
  })
})

