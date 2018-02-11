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

wss.send = function send(socket, data) {
  console.log(socket.readyState)
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(data);
  }
};

wss.broadcast =  (data) => {
  wss.clients.forEach(function each(client) {
    client.send(data)
  })
}

wss.on('connection',  (ws, req) => {
  if (ws.isAlive === false) {
    return ws.terminate()
  }
  ws.isAlive = true;
  ws.on('pong', () => {
    console.log('eiei')
    this.isAlive = true
  })
  try {
    ws.on('message',  (message) => {
      let jsonData = JSON.parse(message)
      if(jsonData.type === "JOIN-ROOM") {
        let haveRoom = jsonData.room && m.get(jsonData.room)
        if(haveRoom){
          let roomId =  jsonData.room
          ws.name = jsonData.name
          //join room
          m.get(roomId).joinGame(ws)
        }else{
          //new room cause no gameId
        }
      }else if(jsonData.type === 'CREATE-ROOM') {
        let roomId =  names.choose()
        ws.name = jsonData.name
        //create new room
        m.set(roomId, new Room(wss, roomId))
        m.get(roomId).joinGame(ws)
      }

      wss.clients.forEach((client) => {
        //send invisible data to enemy
        if (client != ws) {
          if(jsonData.type === "TO-OTHER") {
            client.send(JSON.stringify(jsonData))
          }
        }
      })
    });
    ws.on('error', msg => console.error(msg))
  }catch(e) {
    console.log('err',e)
  }
});

server.listen(3001, function listening() {
  console.log('Listening on %d', server.address().port);
});