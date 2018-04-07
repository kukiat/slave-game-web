const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')

const uuidv1 = require('uuid/v1');
const Room = require('./room.js')
const app = express()
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
        const validateName = /^([A-Za-z0-9]{3,8})$/.test(ws.name)    
        if(!validateName) ws.send(JSON.stringify({ type: 'NAME_FAIL'}))
        else if(haveRoom) {
          //join room
          m.get(roomId).joinGame(ws)
        }else {
          //create new room
          m.set(roomId, new Room(wss, roomId))
          m.get(roomId).joinGame(ws)
        }
      }else if(jsonData.type === 'CREATE_ROOM') {
        ws.name = jsonData.name
        //create new room
        const validateName = /^([A-Za-z0-9]{3,8})$/.test(ws.name)    
        if(!validateName) ws.send(JSON.stringify({ type: 'NAME_FAIL'}))
        else {
          let roomId =  names.choose()
          m.set(roomId, new Room(wss, roomId))
          m.get(roomId).joinGame(ws)
        }
      }
      if(jsonData.type === 'READY_ROOM') {
        let { roomId, name, ready } = jsonData
        m.get(roomId).changeReady(ready, name)
      }
      if(jsonData.type === 'START_GAME') {
        const { roomId, name } = jsonData
        m.get(roomId).startGame(name)
      }
    })
    ws.on('error', (msg) => console.error(msg))
  }catch(e) {
    console.log('err ',e)
  }
})

exports.destroyRoom = (roomId) => {
  m.delete(roomId)
};

exports.updateAllRoom = () => {
  const allRoomData = []
  m.forEach((e) => {
    allRoomData.push({
      roomId: e.roomId,
      players: getPlayers(e.players),
      readyRoom: e.readyRoom
    })
  })
  wss.broadcast(JSON.stringify({ type: 'ALL_ROOM', data: allRoomData }))
}

const getPlayers = (players) => {
  return players.map(player => ({
    id: player.id,
    name: player.name,
    position: player.position,
    status: player.readyState,
    ready: player.ready
  }))  
}

wss.send = (socket, data) => {
  //send data to 1 client
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(data);
  }
}

wss.broadcast = (data) => {
  //send data to all
  wss.clients.forEach((client) => {
    if(client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

server.listen(3001, () => {
  console.log(`server start port ${server.address().port}`);
})