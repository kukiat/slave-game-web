import React from 'react' 

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    const index = props.players.findIndex((player) => player.name === props.name)
    this.state = {
      enemyPlayers: props.players,
    }
  }

  render() {
    return (
      <div>
        <div className="room-name-title">Room Name : xxxxx</div>
        <div className="main-room">
            <div className="grid-tpm room-player">
                <div className="player">
                  <div className="detail-title">
                      <div className="detail-title-name">kukiat</div>
                      <div className="add-card">Send Card</div>
                  </div>
                  <div className="detail-card">

                  </div>
                </div>
            </div>
            <div className="grid-tpm status-player">
              <div className="status-player-title bd-btm">Player Status</div>
              <div className="status-player-scroll">
                { this.state.enemyPlayers.map((enemyPlayer) => (
                    <div className="status-player-detail">
                      <div className="status-circle"></div>
                      <div className="status-name">{enemyPlayer.name}</div>
                    </div>
                ))}
              </div>
            </div>
            <div className="grid-tpm enemy-player">
                <div className="player with-enemy">
                  <div className="detail-title-name">Ta</div>
                  <div className="detail-title-name">500</div>
                </div>
                <div className="player with-enemy">
                  <div className="detail-title-name">Ta</div>
                  <div className="detail-title-name">500</div>
                </div>
                <div className="player with-enemy">
                  <div className="detail-title-name">Ta</div>
                  <div className="detail-title-name">500</div>
                </div>
                <div className="player with-enemy">
                  <div className="detail-title-name">Ta</div>
                  <div className="detail-title-name">500</div>
                </div>
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