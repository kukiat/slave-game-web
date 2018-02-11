const WebSocket = require('ws')

class Room {
  constructor(wss, roomId) {
    this.wss = wss
    this.roomId = roomId
    this.players = []
    
  }

  joinGame(ws) {
    //create new player
    const playerIndex = this.players.findIndex((p) => p.name === ws.name )
    const existPlayer = this.players[playerIndex];
    if(!existPlayer) {
      ws.id = this.players.length + 1
      ws.score = 500
      ws.status = true
      this.players.push(ws)
    }else {
      ws.id = this.players.length + 1
      ws.score = 500
      ws.status = true
      this.players.push(ws)
    }
    this.players.map(p=>{
      console.log(p.name+ p.isAlive)
    })
    this.wss.send(ws, JSON.stringify({ type:'CREATED-ROOM', room: this.roomId, name: ws.name }))
    this.updatePlayer()
    console.log('room ->', this.roomId,' player ->', this.players.length)

    // this.wss.send(JSON.stringify({ type:'CREATED-ROOM', room: this.roomId, name: ws.name}))
  }
  updatePlayer() {
    const player = this.players.map((p)=>({
      name: p.name,
      score: p.score,
      status: p.status,
      id: p.id
    }))
    // console.log(player)
    this.players.forEach((p) => {
      
      this.wss.send(p, JSON.stringify({ type:'PREPARE', data: player }))
    })
  }
}

module.exports = Room