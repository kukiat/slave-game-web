import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super()
    const socket = new WebSocket(process.env.REACT_APP_SERVER_HOST || 'wss://' + window.location.host);
    this.state = {
      socket,
      text: []
    }
  }
  sendMsg = (e)=> {
    e.preventDefault()
    this.state.socket.send(this.refs.message.value)
    this.refs.clear.reset()
  }
  addCard = () => {

  }
  sendCard = () => {

  }
  render() {
    this.state.socket.onmessage = (message) => {
      console.log(message)
      this.setState({
        text: this.state.text.concat(message.data)
      })
    }
    return (
      <div className="">
        {this.state.text.map((msg,i) => <div key={i}>{msg}</div>)}
        <hr/>
        <form ref='clear'>
          <input type="text" ref='message'/>
          <button onClick={ this.sendMsg }>send</button>
        </form>
        <div className='card-columns'>
          <Card/>
          <Card/>
        </div>
        <button onClick={ this.addCard }>จั่วการ์ด</button>
        <button onClick={ this.sendCard }>ดวล</button>
      </div>
    );
  }
}

function Card() {
  return (
    <div className='card'>
      <h1 className='card-content'>{ Math.floor(Math.random() * 10) + 1  }</h1>
    </div>
  )
}

export default App;