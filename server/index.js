const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')

const app = express()

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  try {
    ws.on('message', function incoming(message) {
      wss.clients.forEach((client) => {
        console.log(client.id)
        client.send(message)
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