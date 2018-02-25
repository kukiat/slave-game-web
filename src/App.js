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
        this.setState({ alreadyMember: true})
      }
    }
    this.state = {
      socket,
      text: [],
      roomId: '',
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
      type: 'PREPARE_ROOM',
      ready: status,
      name: this.state.name,
      roomId: this.state.roomId
    }))
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
              {/* <button onClick={this.addCard}>add card</button> */}
              {/* <button onClick={this.sendCard}>send card</button> */}
              <h3>Invite friend </h3><a href={urlInvite} target="_blank"><h3>{window.location.host}{urlInvite}</h3></a>
              <div>
                {
                  players.map((p)=>{
                    return (
                      <div>
                        <div>{p.name}</div>
                        {
                          p.ready? <div>ready</div>: <div>not ready</div>
                        }
                        { name === p.name ? 
                          p.ready === false ?
                            <button onClick={ ()=>this.onReady(true) }>ready</button> 
                            : <button onClick={ ()=>this.onReady(false) }>cancle</button>
                          : null
                        }
                        { p.position === 'head' && name === p.name ? <button>start game</button> : null}
                      </div>
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