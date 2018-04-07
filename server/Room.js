const WebSocket = require('ws')

class Room {
  constructor(wss, roomId) {
    this.wss = wss
    this.roomId = roomId
    this.players = []
    this.readyRoom = false
  }

  joinGame(ws) {
    const indexPlayer  = this.players.findIndex((p) => p.name === ws.name)
    const player = this.players[indexPlayer]
    if(player && player.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type:'ALREADY-PLAYER' }))
    }else if(this.players.length === 0){
      ws.id = this.players.length + 1
      ws.roomName = this.roomId
      ws.position = 'head'
      ws.ready = false
      this.players.push(ws)
      this.wss.send(ws, JSON.stringify({ type:'CREATED_ROOM', room: this.roomId, name: ws.name }))
      this.wss.broadcastDataToPrepareRoom()
      this.updatePlayer()
    }else if(!player) {
      console.log('create player')
      ws.id = this.players.length + 1
      ws.roomName = this.roomId
      ws.position = 'normal'
      ws.ready = false
      this.players.push(ws)
      this.wss.broadcastDataToPrepareRoom()
      this.updatePlayer()
    }else if(player && player.readyState !== WebSocket.OPEN) {
      console.log('reconnect', player.name)
      ws.name = player.name
      ws.id = player.id
      ws.position = player.position
      ws.ready = player.ready
      // ws.cards = player.cards
      this.players[indexPlayer] = ws
      this.updatePlayer()
    }
    
    ws.on('close', msg => {
      if(!this.readyRoom) {
        this.removePlayer()
        this.wss.broadcastDataToPrepareRoom()
      }
      if(this.players.length === 0) {
        this.wss.destroyRoom(this.roomId)
        this.wss.broadcastDataToPrepareRoom()
      }
    })
  }

  startGame(name) {
    const typeName = this.checkPlayer()
    if(this.readyRoom) {
      let cards = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,
        26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52]
      let check = true
      let allArr = []
      let index = 0
      for(let i=0;i<this.players.length;i++) allArr.push([])
      while(check) {
        let number = Math.floor(Math.random() * cards.length)
        allArr[index%this.players.length].push(cards[number])
        cards.splice(number, 1)
        index++
        if(cards.length === 0) check = false
      }
      const players = this.players.map((p, i)=>({
        id: p.id,
        name: p.name,
        position: p.position,
        status: p.readyState,
        ready: p.ready,
        cards: allArr[i]
      }))
      this.players.map(p => this.wss.send(p, JSON.stringify({ type: 'START_GAME', players})))
      this.wss.broadcastDataToPrepareRoom()
    }else{
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

  changeReady(ready, name) {
    const player = this.players.find((p)=>p.name === name)
    player.ready = ready
    this.updatePlayer()
  }

  updatePlayer() {  
    const player = this.players.map((p)=>({
      id: p.id,
      name: p.name,
      position: p.position,
      status: p.readyState,
      ready: p.ready
    })) 
    // console.log('room -> ', this.roomId,' player ->' , player)
    // console.log('---------------------------------------------')
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