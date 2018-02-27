const WebSocket = require('ws')

class Room {
  constructor(wss, roomId) {
    this.wss = wss
    this.roomId = roomId
    this.players = []
    this.readyRoom = false
  }

  joinGame(ws) {
    //create new player
    const indexPlayer  = this.players.findIndex((p) => p.name === ws.name)
    const player = this.players[indexPlayer]
    if(this.players.length === 0){
      ws.id = this.players.length + 1
      ws.score = 500
      ws.cards = this.initialCard()
      ws.position = 'head'
      ws.ready = false
      this.players.push(ws)
      this.wss.send(ws, JSON.stringify({ type:'CREATED-ROOM', room: this.roomId, name: ws.name }))
      this.updatePlayer()
    }else if(!player) {
      ws.id = this.players.length + 1
      ws.score = 500
      ws.position = 'normal'
      ws.ready = false
      ws.cards = this.initialCard()
      this.players.push(ws)
      this.updatePlayer()
    }else if(player && player.readyState !== WebSocket.OPEN){
      ws.name = player.name
      ws.id = player.id
      ws.position = player.position
      ws.score = player.score
      ws.ready = player.ready
      ws.cards = player.cards
      this.players[indexPlayer] = ws
      this.updatePlayer()
    }else if(player && player.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type:'ALREADY-PLAYER'}))
    }
    
    ws.on('close', msg => {
      if(this.readyRoom === false) {
        this.chechExitRoom()
      }
    })
  }

  startGame(name) {
    if(this.readyRoom){
      console.log('xxxx')
    }else{
      const player = this.players.find((p)=> p.name === name)
      player.send(JSON.stringify({ type: 'CANNOT_START_GAME'}))
    }
  }

  addNewCard(name) {
    const newCard = Math.floor(Math.random() * 10) + 1
    const player = this.players.find((p) => p.name === name) 
    player.cards.push(newCard)
    this.updatePlayer()
  }

  initialCard() {
    return [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1] 
  }

  changeReady(ready, name) {
    const player = this.players.find((p)=>p.name === name)
    player.ready = ready
    this.updatePlayer()
  }

  updatePlayer() {
    const player = this.players.map((p)=>({
      name: p.name,
      position: p.position,
      status: p.readyState,
      id: p.id,
      ready: p.ready,
      cards: p.cards
    }))  
    console.log('room -> ', this.roomId,' player ->' , player)
    this.players.map((p) => this.wss.send(p, JSON.stringify({ 
      type:'PREPARE', 
      roomId: this.roomId, 
      data: player })
    ))
    
  }

  chechExitRoom() {
    this.players.map((p, i) => {
      if(p.readyState !== WebSocket.OPEN) {
        this.players.splice(i, 1)
      }
    })
    this.updatePlayer()
  }
}

module.exports = Room