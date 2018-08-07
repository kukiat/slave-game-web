const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const uuidv1 = require('uuid/v1');
const Room = require('./room.js')
const randomstring = require('randomstring')

const app = express()
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map()

wss.on('connection', (ws) => {
  if (ws.isAlive === false) return ws.terminate()
  ws.isAlive = true
  ws.on('pong', () => this.isAlive = true)
  try {
    ws.on('message', (message) => {
      let jsonData = JSON.parse(message)
      if(jsonData.type === "JOIN-ROOM") {
        let haveRoom = jsonData.room && rooms.get(jsonData.room)
        let roomId =  jsonData.room
        ws.name = jsonData.name
        const validateName = /^([A-Za-z0-9]{3,8})$/.test(ws.name)    
        if(!validateName) ws.send(JSON.stringify({ type: 'NAME_FAIL'}))
        else if(haveRoom) {
          //join room
          rooms.get(roomId).joinGame(ws)
        }else {
          //create new room
          rooms.set(roomId, new Room(wss, roomId))
          rooms.get(roomId).joinGame(ws)
        }
      }else if(jsonData.type === 'CREATE_ROOM') {
        ws.name = jsonData.name
        //create new room
        const validateName = /^([A-Za-z0-9]{3,8})$/.test(ws.name)    
        if(!validateName) ws.send(JSON.stringify({ type: 'NAME_FAIL'}))
        else {
          let roomId = randomstring.generate(6)
          rooms.set(roomId, new Room(wss, roomId))
          rooms.get(roomId).joinGame(ws)
        }
      }
      if(jsonData.type === 'READY_ROOM') {
        let { roomId, name, ready } = jsonData
        rooms.get(roomId).changeReady(ready, name)
      }
      if(jsonData.type === 'START_GAME') {
        const { roomId, name } = jsonData
        rooms.get(roomId).startGame(name)
      }
      if(jsonData.type === 'SEND_CARD') {
        const { roomId  } = jsonData.data
        rooms.get(roomId).evaluateCenterCard(jsonData.data)
      }
    })
    ws.on('error', (msg) => console.error(msg))
  }catch(e) {
    console.log('err ',e)
  }
})

const getPlayerAllRoom = () => {
  const allRoomData = []
  rooms.forEach(room => {
    allRoomData.push({
      roomId: room.roomId,
      players: getPlayers(room.players),
      readyRoom: room.readyRoom
    })
  })
  return allRoomData
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

wss.send = (client, data) => {
  //send data to 1 client
  if(client.readyState === WebSocket.OPEN) {
    client.send(data);
  }
}

wss.broadcast = (data) => {
  //send data to all client
  wss.clients.forEach(client => {
    if(client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.destroyRoom = (roomId) => {
  //delete room
  rooms.delete(roomId)
}

wss.updatePlayerInPrepareRoom = () => {
  //send data to client in Prepare-Room
  wss.clients.forEach(client => {
    if(client.readyState === WebSocket.OPEN) {
      const statusPlayerInGame = rooms.get(client.roomName).readyRoom
      if(!statusPlayerInGame) {
        const data = getPlayerAllRoom()
        client.send(JSON.stringify({ type: 'ALL_ROOM', data }))
      }
    }
  })
}

//update data to client in Game
wss.updateCenterCard = (roomName, data) => {
  console.log(data)
  wss.clients.forEach(client => {
    if(client.readyState === WebSocket.OPEN) {
      if(client.roomName === roomName) {
        client.send(JSON.stringify(data))
      }
    }
  })
}

server.listen(3001, () => {
  console.log(`server start port ${server.address().port}`);
})