const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')
const uuidv1 = require('uuid/v1');
const app = express()

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const room = new Map()

wss.send = function send(socket, data) {
  if (socket.readyState === WebSocket.OPEN) {
    console.log('[SENT]', `[id: ${socket.id}]`, data);
    socket.send(data);
  }
};
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    wss.send(client, data);
  });
};
wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  try {
    ws.on('message', function incoming(message) {
      wss.clients.forEach((client) => {
        const jsonData = JSON.parse(message)
        //send invisible data to enemy
        if (client != ws) {
          if(jsonData.type === "TO-OTHER") {
            client.send(JSON.stringify(jsonData))
          }
        }
      })
    });
    ws.on('error', msg => console.error(msg))
    ws.on('close', msg => console.error(msg))
  }catch(e) {
    console.log(e)
  }
});

server.listen(3001, function listening() {
  console.log('Listening on %d', server.address().port);
});