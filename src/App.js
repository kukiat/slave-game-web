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
        //this.state.socket.send(JSON.stringify({type:'JOIN-ROOM', name: this.refs.name.value, room: urlName}))
        console.log('opennnn')
      }
    }.bind(this)
    socket.onmessage = (message) => {
      const jsonData = JSON.parse(message.data)
      console.log(jsonData)
      if(jsonData.type === "TO-OTHER") {
        this.setState({
          enemyCard: jsonData.data
        })
      }
      if(jsonData.type === 'CREATED-ROOM') {
        window.history.replaceState('', '', `?room=${jsonData.room}`)
      }
      if(jsonData.type === 'PREPARE') {
        this.setState({
          players: jsonData.data
        })
      }
    }
    this.state = {
      socket,
      text: [],
      myCard: [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1],
      enemyCard:[1,1],
      heart: 5,
      players:[]
    }
  }

  onJoinGame = () => {
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
    const json = querystring.parse(window.location.search.substring(1));
    const urlInvite = `${window.location.host}/?room=${json.room}`
    const { players } = this.state
    return (
      <div className="">
        {
          players.length === 0 ?
            <div className=''>
              <h1>21 Game</h1>
              <input type="text" className='input-join-game' placeholder="Name" ref='name'/>
              <button className='btn-joingame' onClick={ this.onJoinGame }><span>Join Game</span></button>
            </div>
            :
            <div>
              <a href={urlInvite} target="_blank"><h3>{urlInvite}</h3></a>
              {
                players.map((p) =>
                  <div className='card-columns'>
                    <div className='player-status' style = {p.status === 1? {background: 'green'}: {background: 'red'}}></div>
                    <h1 className='player-name'>{p.name}</h1>
                    <EnemyCard />
                    <EnemyCard />  
                  </div>
                )
              }
              {/* <button onClick={ this.addCard }>จั่วการ์ด</button>
              <button onClick={ this.sendCard }>ดวล</button> */}
            </div>  
        }
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