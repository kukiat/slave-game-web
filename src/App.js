import React, { Component } from 'react';
import querystring from 'querystring'

class App extends Component {
  constructor() {
    super()
    const url = querystring.parse(window.location.search.substring(1))
    const socket = new WebSocket(process.env.REACT_APP_SERVER_HOST || 'wss://' + window.location.host)
    const urlName = url && url.room
    socket.onopen = function() {
      if(urlName) {
        // console.log('have room', urlName)
        // this.onJoinGame(urlName)
      }
    }.bind(this)
    socket.onmessage = (message) => {
      const jsonData = JSON.parse(message.data)
      if(jsonData.type === "TO-OTHER") {
        this.setState({
          enemyCard: jsonData.data
        })
      }
      if(jsonData.type === 'CREATED-ROOM') {
        window.history.replaceState('', '', `?room=${jsonData.room}`)
      }
    }
    this.state = {
      socket,
      text: [],
      myCard: [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1],
      enemyCard:[1,1],
      heart: 5
    }
  }

  onJoinGame = (x) => {
    const url = querystring.parse(window.location.search.substring(1))
    const urlName = url && url.room
    if(urlName){
      this.state.socket.send(JSON.stringify({type:'JOIN-ROOM', name: this.refs.name.value, room: urlName}))
    }else{
      console.log('create')
      this.state.socket.send(JSON.stringify({type:'CREATE-ROOM', name: this.refs.name.value}))
    }
  }

  addCard = () => {
    const randomNumber = Math.floor(Math.random() * 10) + 1
    const allNumner = this.state.myCard.reduce((prev,curr) => prev + curr)
    if((randomNumber + allNumner) > 21) {
      alert('lose')
    }else{
      this.setState({
        myCard: this.state.myCard.concat(randomNumber)
      })
      this.state.socket.send(JSON.stringify({
        type:'TO-OTHER',
        data: this.state.myCard.concat(randomNumber)
      }))
    }
  }

  sendCard = () => {

  }

  render() {
    return (
      <div className="">
        <div>
          <input type="text" placeholder="Name" ref='name'/>
          <button onClick={ this.onJoinGame }>Go</button>
        </div>
        <div className='card-columns'>
          {
            this.state.enemyCard.map((c,i) => <EnemyCard key={i}/>)
          }  
        </div>
        <hr/>
        <h1>
          {this.state.heart}
        </h1>
        <div className='card-columns'>
          {
            this.state.myCard.map((c, i) => 
              <Card key={i} number={c}/>
            )
          }
        </div>
        <button onClick={ this.addCard }>จั่วการ์ด</button>
        <button onClick={ this.sendCard }>ดวล</button>
      </div>
    );
  }
}

function Card({ number }) {
  return (
    <div className='card'>
      <h1 className='card-content'>{ number }</h1>
    </div>
  )
}

function EnemyCard() {
  return (
    <div className='card'>
      <h1 className='card-content'>X</h1>
    </div>
  )
}

export default App;