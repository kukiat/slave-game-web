import React, { Component } from 'react';
import querystring from 'querystring'
import Main from './component/Main';
import OtherRoom from './component/OtherRoom'
import PrepareRoom from './component/PrepareRoom'
import Invite from './component/Invite'
import Game from './component/Game'

class App extends Component {
  constructor(props) {
    super(props)
    const url = querystring.parse(window.location.search.substring(1))
    const socket = new WebSocket(process.env.REACT_APP_SERVER_HOST || 'wss://' + window.location.host)
    const urlName = url && url.room

    socket.onmessage = (message) => {
      const jsonData = JSON.parse(message.data)
      console.log(jsonData)
      if(jsonData.type === 'CREATED_ROOM') 
        window.history.replaceState('', '', `?room=${jsonData.room}`)
      if(jsonData.type === 'PLAYER') this.setState({ players: jsonData.data, roomId: jsonData.roomId })
      if(jsonData.type === 'ALL_ROOM') this.setState({allRoom: jsonData.data})
      if(jsonData.type === 'ALREADY-PLAYER') 
        this.setState({ validateName: Object.assign(this.state.validateName, {name: false, alreadyMember: true}) })
      if(jsonData.type === 'NAME_FAIL') 
        this.setState({ validateName: Object.assign(this.state.validateName, {name: true, alreadyMember: false}) })
      if(jsonData.type === 'PLAYER_LESSTHAN_2') this.setState({ statusRoom: jsonData.type})
      if(jsonData.type === 'NOT_READY') this.setState({ statusRoom: jsonData.type})
      if(jsonData.type === 'START_GAME') 
        this.setState({ 
          statusRoom: jsonData.type, 
          startGame: true, 
          players: jsonData.players
        })
    }
    this.state = {
      socket,
      roomId: '',
      players: [],
      validateName: { name: false, alreadyMember: false },
      name: '',
      statusRoom: 'WAITING',
      allRoom: [],
      startGame: false,
    }
  }

  componentDidMount() {
    if(module.hot) {
      module.hot.accept('./component/Game', () => {
        this.forceUpdate()
      })
    }
  }

  joinGame = (name) => {
    const url = querystring.parse(window.location.search.substring(1))
    const urlName = url && url.room
    if(urlName)
      this.state.socket.send(JSON.stringify({type:'JOIN-ROOM', name, room: urlName}))
    else
      this.state.socket.send(JSON.stringify({type:'CREATE_ROOM', name}))
    this.setState({ name: name })
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
    const { name, players, validateName, allRoom, roomId, statusRoom, startGame} = this.state
    return (
      <div className="huhoh">
        { players.length === 0 ?
            <Main 
              validateName = {validateName}
              joinGame = {this.joinGame}
            />
            :
            startGame ?   
              <Game
                roomId={roomId}
                players={players}
                name={name}
                socket={this.state.socket}
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
                  statusRoom={statusRoom}
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

export default App;