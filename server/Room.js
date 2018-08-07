const WebSocket = require('ws')

class Room {
  constructor(wss, roomId) {
    this.wss = wss
    this.roomId = roomId
    this.players = []
    this.readyRoom = false
    this.currentShufflePlayer = {}
    this.centerCard = {
      type: null,
      listCard: []
    }
  }

  joinGame(ws) {
    const indexPlayer  = this.players.findIndex((p) => p.name === ws.name)
    const player = this.players[indexPlayer]
    if(player && player.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type:'ALREADY-PLAYER' }))
    }else if(this.players.length === 0){
      ws.id = this.players.length
      ws.roomName = this.roomId
      ws.position = 'head'
      ws.ready = false
      this.players.push(ws)
      this.wss.send(ws, JSON.stringify({ type:'CREATED_ROOM', room: this.roomId, name: ws.name }))
      this.wss.updatePlayerInPrepareRoom()
      this.updatePlayer()
    }else if(!player) {
      console.log('create player')
      ws.id = this.players.length
      ws.roomName = this.roomId
      ws.position = 'normal'
      ws.ready = false
      this.players.push(ws)
      this.wss.updatePlayerInPrepareRoom()
      this.updatePlayer()
    }else if(player && player.readyState !== WebSocket.OPEN) {
      console.log('reconnect', player.name)
      ws.name = player.name
      ws.roomName = player.roomName,
      ws.id = player.id
      ws.position = player.position
      ws.ready = player.ready
      // ws.cards = player.cards
      this.players[indexPlayer] = ws
      this.updatePlayer()
    }
    
    ws.on('close', (msg) => {
      if(!this.readyRoom) {
        this.removePlayer()
        this.wss.updatePlayerInPrepareRoom()
      }
      if(this.players.length === 0) {
        this.wss.destroyRoom(this.roomId)
        this.wss.updatePlayerInPrepareRoom()
      }
    })
  }

  startGame(name) {
    const typeName = this.checkPlayer()
    if(this.readyRoom) {
      let cards = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,
        26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52]
      let check = true
      let index = 0
      const allArr = this.players.map(player => ([ ]))
      let indexCurrentShufflePlayer;
      while(check) {
        let number = Math.floor(Math.random() * cards.length)
        let indexCard = index%this.players.length
        let card = cards[number]
        allArr[indexCard].push(card)
        if(card === 1) indexCurrentShufflePlayer = indexCard
        cards.splice(number, 1)
        index++
        
        if(cards.length === 0) check = false
      }
      const players = this.players.map((p, i) => {
        this.players[i].cards = allArr[i]
        return {
          id: p.id,
          name: p.name,
          position: p.position,
          status: p.readyState,
          ready: p.ready,
          cards: allArr[i]
        }
      })
      this.currentShufflePlayer = this.getCurrentShufflePlayer(indexCurrentShufflePlayer)
      this.players.map(p => this.wss.send(p, 
        JSON.stringify({ 
          type: 'START_GAME', 
          players, 
          shufflePlayer: this.currentShufflePlayer
        })
      ))
      this.wss.updatePlayerInPrepareRoom()
    }else{
      const player = this.players.find((p)=> p.name === name)
      player.send(JSON.stringify({ type: typeName}))
    }
  }

  evaluateCenterCard({ selectListCards, name }) {
    const player = this.players.find(player => player.name === name)
    if(selectListCards.length) {
      const typeGame = selectListCards.length % 2
      if(this.centerCard.listCard.length == 0) this.centerCard.type = typeGame
      if(this.centerCard.type === typeGame) {
        this.calculateCard(selectListCards)
      }else {
        player.send(JSON.stringify({ 
          type: 'SEND_CARD_ERROR', 
          data: 'not match type game' 
        }))
      }
    }else {
      player.send(JSON.stringify({ 
        type: 'SEND_CARD_ERROR', 
        data: 'not select card' 
      }))
    }
  }

  shufflePlayer({ name }) {
    const indexCurrenShufflePlayer = this.players.findIndex(player => player.name === name)
    this.currentShufflePlayer = this.setDataPlayer(this.players[(indexCurrenShufflePlayer + 1) % this.players.length])
  }

  calculateCard(selectListCards) {
    const { listCard } = this.centerCard
    if(listCard.length) {
      
    }else {
      listCard.push(selectListCards)
      this.shufflePlayer(this.currentShufflePlayer)
      console.log(this.currentShufflePlayer)
      this.wss.updateCenterCard(this.roomId, {
        type: 'SEND_CARD_SUCCESS',
        data: {
          listCard,
          shufflePlayer: this.currentShufflePlayer
        },
      })
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

  getCurrentShufflePlayer(indexCurrentShufflePlayer) {
    const currentShufflePlayer = this.setDataPlayer(this.players[indexCurrentShufflePlayer])
    return currentShufflePlayer
  }

  setDataPlayer(player) {
    return {
      id: player.id,
      name: player.name,
      position: player.position,
      roomName: player.roomName,
      status: player.readyState,
      ready: player.ready,
      cards: player.cards || []
    }
  }

  changeReady(ready, name) {
    const player = this.players.find(p => p.name === name)
    player.ready = ready
    this.updatePlayer()
  }

  updatePlayer() {  
    const player = this.players.map((p)=>({
      id: p.id,
      name: p.name,
      roomName: p.roomName,
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