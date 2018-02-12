const WebSocket = require('ws')

class Room {
  constructor(wss, roomId) {
    this.wss = wss
    this.roomId = roomId
    this.players = []
    
  }

  joinGame(ws) {
    //create new player
    const indexPlayer  = this.players.findIndex((p) => p.name === ws.name)
    const player = this.players[indexPlayer]
    
    if(!player) {
      ws.id = this.players.length + 1
      ws.score = 500
      this.players.push(ws)
      this.wss.send(ws, JSON.stringify({ type:'CREATED-ROOM', room: this.roomId, name: ws.name }))
      this.updatePlayer()
    }else if(player && player.readyState !== WebSocket.OPEN){
      ws.name = player.name
      ws.id = player.id
      ws.score = player.score
      this.players[indexPlayer] = ws
      this.updatePlayer()
    }else if(player && player.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type:'ALREADY-PLAYER'}))
    }
    
    ws.on('close', msg => {
      this.updatePlayer()
    })
  }
  updatePlayer() {
    const player = this.players.map((p)=>({
      name: p.name,
      score: p.score,
      status: p.readyState,
      id: p.id
    }))
    console.log('room -> ', this.roomId,' player ->' , player)
    this.players.map((p) => this.wss.send(p, JSON.stringify({ type:'PREPARE', data: player })))
  }
}

module.exports = Room