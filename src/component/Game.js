import React from 'react' 
import Card from '../svg'
import styled from 'styled-components';

class Game extends React.Component {
  constructor(props) {
    super(props)
    props.socket.onmessage = message => {
      const jsonData = JSON.parse(message.data)
      console.log(jsonData)
    }
    this.state = {
      enemyPlayers: props.players.filter((p) => p.name !== props.name),
      currentPlayer: props.players.find(player => player.name === props.name),
      selectListCards: []
    }
  }

  selectCard = (number) => {
    console.log(number)

  }

  render() {
    const { enemyPlayers, currentPlayer } = this.state
    return (
      <div>
        <div className="room-name-title">Room Name : {this.props.roomId}</div>
        <div className="main-room">
            <div className="grid-tpm room-player">
                <div className="player">
                  <div className="detail-title">
                      <div className="detail-title-name">{currentPlayer.name}</div>
                      <ButtonMedium>Send</ButtonMedium>
                      <ButtonMedium>Pass</ButtonMedium>
                  </div>
                  <div className="detail-card">
                    { this.state.currentPlayer.cards.map((c, i) => (
                      <Card key={i} selectCard={this.selectCard} number={c} index={i}/>
                    ))}
                  </div>
                </div>
            </div>
            <div className="grid-tpm status-player">
              <div className="status-player-title bd-btm">Player Status</div>
              <div className="status-player-scroll">
                { this.state.enemyPlayers.map((enemyPlayer) => (
                    <div key={enemyPlayer.id} className="status-player-detail">
                      <div className="status-circle"></div>
                      <div className="status-name">{enemyPlayer.name}</div>
                    </div>
                ))}
              </div>
            </div>
            <div className="grid-tpm enemy-player">
                { enemyPlayers.map(player => (
                    <div className="player with-enemy">
                      <div className="detail-title-name">{player.name}</div>
                      <div className="detail-card">
                        { player.cards.map((c, i) => (
                            <Card key={i} number={5} index={i}/>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
            </div>
            <div className="grid-tpm monitor-player">
              <div className="chat-title bd-btm">Chat</div>
              <div className="chat-detail">
                <div className="chat-info">12:30:30 : xxxxxx has disconnected</div>
                <div className="chat-info">12:30:31 : xxxxxx has joined</div>
                <div className="chat-info">12:30:30 : xxxxxx has joined</div>
                <div className="chat-info">12:30:30 : xxxxxx has reconnected</div>
                <div className="chat-info">12:30:30 : xxxxxx has disconnected</div>
                <div className="chat-info">Kukiat : prom yang wa</div>
                <div className="chat-info">Kukiat : WTF why u so serius</div>
              </div>
              <div className="chat-form">
                <input className="chat-input bd-top" placeholder="Send a message" type="text"/>
                <div className="chat-btn">Chat</div>
              </div>
            </div>
        </div>
      </div>
    )
  }
}

const ButtonMedium = styled.div`
  background: rgb(72, 173, 58);
  cursor: pointer;
  color: rgb(236, 236, 232);
  width: 80%;
  height: 25px;
  border-radius: 5px;
  padding: 5px 1px 0px 0px;
  text-align: center;
  font-size: 18px;
`

export default Game