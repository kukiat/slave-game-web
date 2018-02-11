class Room {
  constructor(wss, roomId) {
    this.wss = wss
    this.roomId = roomId
  }

  joinGame(ws) {
    console.log(this.wss)
    console.log('==================================================')
    console.log(this.roomId)
    console.log('==================================================')
    console.log(ws)
  }
}

module.exports = Room