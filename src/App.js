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
      if(jsonData.type === 'CREATED-ROOM') {
        window.history.replaceState('', '', `?room=${jsonData.room}`)
      }
      if(jsonData.type === 'PREPARE') {
        this.setState({
          players: jsonData.data,
          roomId: jsonData.roomId
        })
      }
      if(jsonData.type === 'ALREADY-PLAYER') {
        console.log('xxxxx')
        this.setState({ alreadyMember: true})
      }
      if(jsonData.type === 'CANNOT_START_GAME') {
        this.setState({ startGame: false})
      }
    }
    this.state = {
      socket,
      text: [],
      roomId: '',
      heart: 5,
      players:[],
      alreadyMember: false,
      name: '',
      startGame: true
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
    const { name, roomId } = this.state
    this.state.socket.send(JSON.stringify({
      type: 'ADD_CARD',
      name, roomId
    }))
  }

  sendCard = () => {

  }

  onReady = (status) => {
    this.state.socket.send(JSON.stringify({
      type: 'READY_ROOM',
      ready: status,
      name: this.state.name,
      roomId: this.state.roomId
    }))
  }
  startGame = () => {
    this.state.socket.send(JSON.stringify({
      type: 'START_GAME',
      roomId: this.state.roomId,
      name: this.state.name
    }))
  }
  render() {
    const json = querystring.parse(window.location.search.substring(1));
    const urlInvite = `?room=${json.room}`
    const { name, players, alreadyMember } = this.state
    return (
      <div className="">
        {
          players.length === 0 ?
            <div className='main-login'>
              <div className="game-title">
                21 Game
              </div>
              <div className="login-form">
                <input placeholder="Name.." type="input" className="input-form-name" ref='name'/>
                <div className="join-game-btn"  onClick={ this.joinGame }>JOIN</div>
                { alreadyMember ? <div className="rejected">Already Player</div>: null }
              </div>
            </div>
            :
            <div className="main-prepare">
              <div className="invite-player">
                <b>Invite friend</b>
                <div className="invite-url">
                  <a href={urlInvite} target="_blank">{window.location.host}{urlInvite}</a>
                </div>
              </div>
              <div className="prepare-player-list">
                {
                  players.map((p, i)=>{
                    return (
                      <div className="prepare-player" key={ p.id }>
                        <div style={p.ready? {'color': 'green'}:{'color': 'red'}}>{p.name}</div>
                        { name === p.name ? 
                          p.ready === false ?
                            <div className="btn-ready" onClick={ ()=>this.onReady(!p.ready) }>READY</div>                      
                            : <div className="btn-cancle"  onClick={ ()=>this.onReady(!p.ready) }>CANCLE</div>
                          : null
                        }
                      </div>
                    )
                  })
                }
                { players.map((p) => {
                    return (
                      p.position === 'head' && name === p.name ?
                        <div>
                          <div className="btn-ready-start" onClick={ this.startGame } >START GAME</div>
                          { !this.state.startGame &&  <div className="rejected">All player not yet ready</div> }
                        </div>
                      : null
                    )
                  })
                }
              </div>
              {/* {
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
              } */}
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