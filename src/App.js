import React, { Component } from 'react';
import querystring from 'querystring'
import Main from './component/Main';
import OtherRoom from './component/OtherRoom'
import PrepareRoom from './component/PrepareRoom'
import Invite from './component/Invite'

class App extends Component {
  constructor(props) {
    super(props)
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
      if(jsonData.type === 'CREATED_ROOM') {
        window.history.replaceState('', '', `?room=${jsonData.room}`)
      }
      if(jsonData.type === 'PLAYER_PREPARE') {
        this.setState({
          players: jsonData.data,
          roomId: jsonData.roomId
        })
      }
      if(jsonData.type === 'ALL_ROOM') {
        this.setState({allRoom: jsonData.data})
      }
      if(jsonData.type === 'ALREADY-PLAYER') {
        this.setState({ alreadyMember: true})
      }
      if(jsonData.type === 'CANNOT_START_GAME') {
        this.setState({ startGame: false})
      }
    }
    this.state = {
      socket,
      roomId: '',
      players: [],
      alreadyMember: false,
      name: '',
      startGame: true,
      allRoom:[]
    }
  }

  joinGame = (name) => {
    const url = querystring.parse(window.location.search.substring(1))
    const urlName = url && url.room
    if(urlName){
      this.state.socket.send(JSON.stringify({type:'JOIN-ROOM', name, room: urlName}))
    }else{
      this.state.socket.send(JSON.stringify({type:'CREATE_ROOM', name}))
    }
    this.setState({ name: name })
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

  onStartGame = () => {
    this.state.socket.send(JSON.stringify({
      type: 'START_GAME',
      roomId: this.state.roomId,
      name: this.state.name
    }))
  }
  
  render() {
    const json = querystring.parse(window.location.search.substring(1));
    const urlInvite = `?room=${json.room}`
    const { name, players, alreadyMember, allRoom, roomId, startGame} = this.state
    return (
      <div className="huhoh">
        { players.length === 0 ?
            <Main 
              alreadyMember = {alreadyMember}
              joinGame = {this.joinGame}
            />
            :
            <div className="main-prepare">
              <Invite urlInvite={urlInvite}/>
              <div className="container-room">
                <PrepareRoom 
                  roomId={roomId} 
                  players={players}
                  onReady={this.onReady}
                  onStartGame={this.onStartGame}
                  startGame={startGame}
                  name={name}
                />
                <OtherRoom 
                  allRoom={allRoom}
                />
              </div>
            </div>  
        }
      </div>
    );
  }
}

function Card(props) {
  return (
    <div className='card'>
      <h1 className='card-content'> Test {props.xxxx}</h1>
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