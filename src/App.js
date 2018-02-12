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
      if(jsonData.type === 'ALREADY-PLAYER') {
        this.setState({ alreadyMember: true})
      }
    }
    this.state = {
      socket,
      text: [],
      myCard: [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1],
      enemyCard:[1,1],
      heart: 5,
      players:[],
      alreadyMember: false
    }
  }

  onJoinGame = () => {
    const url = querystring.parse(window.location.search.substring(1))
    const urlName = url && url.room
    if(urlName){
      this.state.socket.send(JSON.stringify({type:'JOIN-ROOM', name: this.refs.name.value, room: urlName}))
    }else{
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
    const urlInvite = `?room=${json.room}`
    const { players, alreadyMember } = this.state
    return (
      <div className="container bg">
        {
          players.length === 0 ?
            <div className='container'>
              <h1>21 Game</h1>
              <div class="field">
                <div class="control">
                  <input 
                    className={alreadyMember ? 'input is-danger' : 'input'} 
                    type="text" 
                    placeholder="Name" 
                    ref='name' 
                    style={{width:'50%'}}
                  />
                  { alreadyMember ? <p className="help is-danger"> Already this member</p>: null }
                </div>
                <a class="button is-outlined" onClick={ this.onJoinGame }>Play</a>
              </div>
            </div>
            :
            <div>
              <h3>Invite friend </h3><a href={urlInvite} target="_blank"><h3>{window.location.host}{urlInvite}</h3></a>
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
      <h1 className='card-content'></h1>
    </div>
  )
}

export default App;