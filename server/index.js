const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')
const uuidv1 = require('uuid/v1');
const app = express()

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const Moniker = require('moniker');
const names = Moniker.generator([Moniker.adjective, Moniker.noun, Moniker.verb]);

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  try {
    ws.on('message', function incoming(message) {
      const jsonData = JSON.parse(message)
      if(jsonData.type === "JOIN-ROOM") {
        console.log('room', jsonData.room) 
        if(jsonData.room) {
          console.log('create new room')
          ws.name = jsonData.name
          ws.send(JSON.stringify({
            type: 'JOIN-SUCCESS', 
            room: names.choose(),
            name: ws.name
          }))
        }
      }
      wss.clients.forEach((client) => {
        //send invisible data to enemy
        if (client != ws) {
          if(jsonData.type === "TO-OTHER") {
            client.send(JSON.stringify(jsonData))
          }
        }
        // join game
      })
    });
    ws.on('error', msg => console.error(msg))
    ws.on('close', msg => console.error(msg))
  }catch(e) {
    console.log('err',e)
  }
});

server.listen(3001, function listening() {
  console.log('Listening on %d', server.address().port);
});