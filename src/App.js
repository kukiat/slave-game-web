import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super()
    const socket = new WebSocket(process.env.REACT_APP_SERVER_HOST || 'wss://' + window.location.host)
    socket.onmessage = (message) => {
      console.log(message.data)
      const jsonData = JSON.parse(message.data)
      if(jsonData.type === "TO-OTHER") {
        this.setState({
          enemyCard: jsonData.data
        })
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
  sendMsg = (e)=> {
    e.preventDefault()
    this.state.socket.send(this.refs.message.value)
    this.refs.clear.reset()
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