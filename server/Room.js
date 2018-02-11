const WebSocket = require('ws')

class Room {
  constructor(wss, roomId) {
    this.wss = wss
    this.roomId = roomId
    this.players = []
    
  }

  joinGame(ws) {
    //create new player
    if(this.players.length === 0) {
      ws.id = this.players.length + 1
      ws.score = 500
      this.players.push(ws)
      this.wss.send(ws, JSON.stringify({ type:'CREATED-ROOM', room: this.roomId, name: ws.name }))
    }else {
      ws.id = this.players.length + 1
      ws.score = 500
      this.players.push(ws)
    }
    this.updatePlayer()
    ws.on('close', msg => {
      this.updatePlayer()
      console.error(msg)
    })
    // this.wss.send(JSON.stringify({ type:'CREATED-ROOM', room: this.roomId, name: ws.name}))
  }
  updatePlayer() {
    const player = this.players.map((p)=>({
      name: p.name,
      score: p.score,
      status: p.readyState,
      id: p.id
    }))
    console.log('room -> ', this.roomId,' player ->' , this.players.length)
    this.players.map((p) => this.wss.send(p, JSON.stringify({ type:'PREPARE', data: player })))
  }
}

module.exports = Room