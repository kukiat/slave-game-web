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
    if(this.players.length === 0){
      ws.id = this.players.length + 1
      ws.score = 500
      ws.cards = this.createRandomCard()
      this.players.push(ws)
      this.wss.send(ws, JSON.stringify({ type:'CREATED-ROOM', room: this.roomId, name: ws.name }))
      this.updatePlayer()
    }else if(!player) {
      ws.id = this.players.length + 1
      ws.score = 500
      ws.cards = this.createRandomCard()
      this.players.push(ws)
      this.updatePlayer()
    }else if(player && player.readyState !== WebSocket.OPEN){
      ws.name = player.name
      ws.id = player.id
      ws.score = player.score
      ws.cards = player.cards
      this.players[indexPlayer] = ws
      this.updatePlayer()
    }else if(player && player.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type:'ALREADY-PLAYER'}))
    }
    
    ws.on('close', msg => {
      this.updatePlayer()
    })
  }

  createRandomCard() {
    return [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1] 
  }

  updatePlayer() {
    const player = this.players.map((p)=>({
      name: p.name,
      score: p.score,
      status: p.readyState,
      id: p.id,
      cards: p.cards
    }))
    const data = Object.assign({ type:'PREPARE', data: player }, {roomId: this.roomId})
    console.log('room -> ', this.roomId,' player ->' , data)

    this.players.map((p) => this.wss.send(p, JSON.stringify(data)))
  }
}

module.exports = Room