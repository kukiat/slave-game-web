const WebSocket = require('ws')
const allRoom = require('./index.js')

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
      this.wss.send(ws, JSON.stringify({ type:'CREATED_ROOM', room: this.roomId, name: ws.name }))
      allRoom.updateAllRoom()
      this.updatePlayer()
    }else if(!player) {
      ws.id = this.players.length + 1
      ws.score = 500
      ws.position = 'normal'
      ws.ready = false
      ws.cards = this.initialCard()
      this.players.push(ws)
      allRoom.updateAllRoom()
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
      if(!this.readyRoom) {
        this.removePlayer()
        allRoom.updateAllRoom()
      }
      if(this.players.length === 0) {
        allRoom.destroyRoom(this.roomId)
        allRoom.updateAllRoom()
      }
    })
  }

  startGame(name) {
    const typeName = this.checkPlayer()
    if(this.readyRoom) {
      this.players.map(p => this.wss.send(p, JSON.stringify({ 
        type: 'START_GAME'
      })))
      this.updatePlayer()
    }else{
      console.log('cannot start')
      const player = this.players.find((p)=> p.name === name)
      player.send(JSON.stringify({ type: typeName}))
    }
  }
  
  checkPlayer() {
    if(this.players.length < 2) {
      this.readyRoom = false
      return 'PLAYER_LESSTHAN_2'
    }else{
      this.readyRoom = this.players.reduce((p, c) => {
        if(c.ready) 
          return p+1
        return p
      }, 0) === this.players.length 
      return 'NOT_READY'
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
    // console.log('room -> ', this.roomId,' player ->' , player)
    this.players.map((p) => this.wss.send(p, JSON.stringify({ 
      type: 'PLAYER', 
      roomId: this.roomId, 
      data: player
     })))
  }

  removePlayer() {
    this.players.map((p, i) => {
      if(p.readyState !== WebSocket.OPEN) {
        this.players.splice(i, 1)
      }
    })
    this.updatePlayer()
  }
}

module.exports = Room