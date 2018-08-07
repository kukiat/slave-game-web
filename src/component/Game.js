import React from 'react' 
import Card from '../svg'
import styled, {keyframes} from 'styled-components';

const ButtonMedium = styled.div`
  cursor: pointer;
  color: rgb(236, 236, 232);
  width: 80%;
  height: 25px;
  border-radius: 5px;
  padding: 5px 1px 0px 0px;
  text-align: center;
  font-size: 18px;
`

const ButtonEnable = ButtonMedium.extend`
  background-color: #00C853;
  box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.14);
  transition: background-color 0.4s;
  &:hover {
    background-color: #00E276;
  }
`

const ButtonDisable = ButtonMedium.extend`
  background-color: rgb(72, 173, 58);
  opacity: 0.4;
  cursor: default;
`

const AlertSelectCard = styled.div`
  position: absolute;
  width: 100px;
  height: 50px;
  top: 145px;
  left: 330px;
  background: red;
  z-index: 100;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  padding: 5px;
  box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.14);
`


class Game extends React.Component {
  constructor(props) {
    super(props)
    const currentPlayer = props.players.find(player => player.name === props.name)
    this.state = {
      enemyPlayers: props.players.filter(p => p.name !== props.name),
      currentPlayer,
      listCard: currentPlayer.cards.sort((p, c) => p - c),
      selectListCards: [],
    }
  }

  selectCard = (number, select) => {
    const { selectListCards, listCard } = this.state
    const hasCard = selectListCards.find(cardNumber => cardNumber === number)
    const isSameType = selectListCards.find(cardNumber => Math.trunc((cardNumber - 1) / 4) === Math.trunc((number - 1) / 4))
    if(!hasCard && selectListCards.length < 4)
      this.setState({ selectListCards: selectListCards.concat(number) })
    if(!isSameType)
      this.setState({ selectListCards: [number] })
    if(select) {
      const index = selectListCards.findIndex(cardNumber => cardNumber === number)
      selectListCards.splice(index, 1)
      this.setState({ selectListCards: selectListCards })
    }
  }

  sendCard = () => {
    const { selectListCards, currentPlayer } = this.state
    const { roomId } = this.props
    this.props.socket.send(JSON.stringify({
      type:'SEND_CARD', 
      data: {...currentPlayer, selectListCards, roomId}
    }))
  }
  

  render() {
    const { roomId, game } = this.props
    const { enemyPlayers, currentPlayer, selectListCards, listCard, centerCard } = this.state
    return (
      <div>
        <div className="room-name-title">Room Name : {roomId}</div>
        <div className="main-room">
            <div className="grid-tpm room-player">
                <div className="player">
                  <div className="detail-title">
                      <div className="detail-title-name">{currentPlayer.name}</div>
                      { game.shufflePlayer.name === currentPlayer.name 
                        ? <ButtonEnable onClick={this.sendCard}>Send</ButtonEnable> 
                        : <ButtonDisable>Send</ButtonDisable> 
                      }
                      { game.shufflePlayer.name === currentPlayer.name 
                        ? <ButtonEnable>Pass</ButtonEnable> 
                        : <ButtonDisable>Send</ButtonDisable> 
                      }
                  </div>
                  <div className="detail-card">
                    { listCard.map((number, i) => {
                      const hasCard = selectListCards.find((cardNumber) => cardNumber === number)
                      return hasCard ?
                        <Card select key={i} selectCard={this.selectCard} number={number} index={i}/>
                        : <Card key={i} selectCard={this.selectCard} number={number} index={i}/>
                    })
                    }
                  </div>
                  { !game.sendCard.status && <AlertSelectCard>Please select card</AlertSelectCard>}
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
                  ))
                }
              </div>
            </div>
            <div className="board">
              <div className="detail-card">
                {
                  game.currentDeck.map(listCard => {
                    return (
                      <div style={{marginLeft: '10px'}}>
                        { listCard.map((card, i) => {
                          return (
                            <Card key={i} number={card} index={i}/>
                          )
                        })}
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className="grid-tpm enemy-player">
                { enemyPlayers.map(player => (
                    <div key={player.id} className="player with-enemy">
                      <div className="detail-title-name">{player.name}</div>
                      <div className="detail-card">
                        { player.cards.map((c, i) => (
                            <Card key={i} number={53} index={i}/>
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
              <form className="chat-form">
                <input className="chat-input bd-top" placeholder="Send a message" type="text"/>
                <div className="chat-btn">Chat</div>
              </form>
            </div>
        </div>
      </div>
    )
  }
}

export default Game