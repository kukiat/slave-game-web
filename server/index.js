const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')

const uuidv1 = require('uuid/v1');
const app = express()
const Room = require('./room.js')
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const Moniker = require('moniker');
const names = Moniker.generator([Moniker.adjective, Moniker.noun, Moniker.verb]);

const m = new Map()

wss.on('connection', (ws, req) => {
  if (ws.isAlive === false) return ws.terminate()
  ws.isAlive = true
  ws.on('pong', () => this.isAlive = true)
  try {
    ws.on('message', (message) => {
      let jsonData = JSON.parse(message)
      if(jsonData.type === "JOIN-ROOM") {
        let haveRoom = jsonData.room && m.get(jsonData.room)
        let roomId =  jsonData.room
        ws.name = jsonData.name
        if(haveRoom) {
          m.get(roomId).joinGame(ws)
        }else {
          m.set(roomId, new Room(wss, roomId))
          m.get(roomId).joinGame(ws)
        }
      }else if(jsonData.type === 'CREATE-ROOM') {
        let roomId =  names.choose()
        ws.name = jsonData.name
        //create new room
        m.set(roomId, new Room(wss, roomId))
        m.get(roomId).joinGame(ws)
      }
      if(jsonData.type === 'READY_ROOM') {
        let { roomId, name, ready } = jsonData
        m.get(roomId).changeReady(ready, name)
      }
      if(jsonData.type === 'ADD_CARD') {
        const { name, roomId } = jsonData
        m.get(roomId).addNewCard(name)
      }
      if(jsonData.type === 'START_GAME') {
        const { roomId, name } = jsonData
        m.get(roomId).startGame(name)
      }
    })
    ws.on('error', msg => console.error(msg))
  }catch(e) {
    console.log('err ',e)
  }
})

wss.send = (socket, data) => {
  //send data when client ready
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(data);
  }
}

server.listen(3001, () => {
  console.log('Listening on %d', server.address().port);
});