import React, { Component } from 'react';
import querystring from 'querystring'
import Main from './component/Main';
import OtherRoom from './component/OtherRoom'
import PrepareRoom from './component/PrepareRoom'
import Invite from './component/Invite'
import Game from './component/Game'
import { Card17, Card8, Card11,Card38, Card36, Card20, Card26, Card22, Card18, Card39,Card19, Card40, Card12, Card35, Card31, Card7, Card10,Card27, Card28, Card32, Card37 } from './svg'

const ShowCard = (props) => (
  <div className="dd">
    <div></div>
    <div><Card7/><Card8/></div>
    <div><Card10/><Card11/><Card12/></div>
    <div></div>
    <div><Card17/><Card18/><Card19/><Card20/></div>
    <div><Card22/></div>
    <div><Card26/><Card27/><Card28/></div>
    <div><Card31/><Card32/></div>
    <div><Card35/><Card36/></div>
    <div><Card37/><Card38/><Card39/><Card40/></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
)

class App extends Component {
  constructor(props) {
    super(props)
    const url = querystring.parse(window.location.search.substring(1))
    const socket = new WebSocket(process.env.REACT_APP_SERVER_HOST || 'wss://' + window.location.host)
    const urlName = url && url.room
    socket.onopen = () => {
      console.log('onopen')
        // this.setState({statusRoom: 'xxxxxx', startGame: true})
    }
    socket.onmessage = (message) => {
      console.log('onmessage')
      const jsonData = JSON.parse(message.data)
      console.log(jsonData)
      if(jsonData.type === 'CREATED_ROOM') {
        window.history.replaceState('', '', `?room=${jsonData.room}`)
      }
      if(jsonData.type === 'PLAYER') {
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
      if(jsonData.type === 'PLAYER_LESSTHAN_2') this.setState({ statusRoom: jsonData.type})
      if(jsonData.type === 'NOT_READY') this.setState({ statusRoom: jsonData.type})
      if(jsonData.type === 'START_GAME') this.setState({ statusRoom: jsonData.type, startGame: true})
      
    }
    this.state = {
      socket,
      roomId: '',
      players: [],
      alreadyMember: false,
      name: '',
      statusRoom: 'WAITING',
      allRoom: [],
      startGame: false
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
    const { name, players, alreadyMember, allRoom, roomId, statusRoom, startGame} = this.state
    return (
      <div className="huhoh">
        <ShowCard/>
        { players.length === 0 ?
            <Main 
              alreadyMember = {alreadyMember}
              joinGame = {this.joinGame}
            />
            :
            startGame ?   
              <Game
                roomId={roomId}
                players={players}
                name={name}
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