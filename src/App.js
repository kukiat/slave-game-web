import React, { Component } from 'react';
import querystring from 'querystring'

class App extends Component {
  constructor() {
    super()
    const url = querystring.parse(window.location.search.substring(1))
    const socket = new WebSocket(process.env.REACT_APP_SERVER_HOST || 'wss://' + window.location.host)
    const urlName = url && url.room
    socket.onopen = () => {
      if(urlName) {
        //this.state.socket.send(JSON.stringify({type:'JOIN-ROOM', name: this.refs.name.value, room: urlName}))
        // console.log('opennnn')
      }
    }
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
      alreadyMember: false,
      name: ''
    }
  }

  joinGame = () => {
    const url = querystring.parse(window.location.search.substring(1))
    const urlName = url && url.room
    if(urlName){
      this.state.socket.send(JSON.stringify({type:'JOIN-ROOM', name: this.refs.name.value, room: urlName}))
    }else{
      this.state.socket.send(JSON.stringify({type:'CREATE-ROOM', name: this.refs.name.value}))
    }
    this.setState({
      name: this.refs.name.value
    })
  }

  addCard = () => {
    
  }

  sendCard = () => {

  }

  render() {
    const json = querystring.parse(window.location.search.substring(1));
    const urlInvite = `?room=${json.room}`
    const { name, players, alreadyMember } = this.state
    return (
      <div className="container bg">
        {
          players.length === 0 ?
            <div className='container'>
              <h1>21 Game</h1>
              <div className="field">
                <div className="control">
                  <input 
                    className={alreadyMember ? 'input is-danger' : 'input'} 
                    type="text" 
                    placeholder="Name" 
                    ref='name' 
                    style={{width:'50%'}}
                  />
                  { alreadyMember ? <p className="help is-danger"> Already this member</p>: null }
                </div>
                <a className="button is-outlined" onClick={ this.joinGame }>Play</a>
              </div>
            </div>
            :
            <div>
              <button onClick={this.addCard}>add card</button>
              <button onClick={this.sendCard}>send card</button>
              <h3>Invite friend </h3><a href={urlInvite} target="_blank"><h3>{window.location.host}{urlInvite}</h3></a>
              {
                players.map((p) =>
                  <div key ={p.id} className='card-columns'>
                    <div className='player-status' style = {p.status === 1? {background: 'green'}: {background: 'red'}}></div>
                    <h1 className='player-name'>{p.name}</h1>
                    { 
                      p.name === name ?
                      p.cards.map((n, i)=> <Card key={i} number={n}/>)
                      : p.cards.map((n, i)=> <EnemyCard key={i} />)
                    }
                    
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
      <h1 className='card-content'>.</h1>
    </div>
  )
}

export default App;