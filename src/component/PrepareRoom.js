import React from 'react'

const PrepareRoom = (props) => {
  const { players, onReady, roomId, onStartGame, startGame, name } = props
  console.log('startGame',startGame)
  return (
    <div className="prepare-player-list">
      <div className="all-room-title">Room : {roomId}</div>
      <div className="prepare-player-detail">
        { players.map((p, i) => (
              <div  key={ p.id } className="prepare-player">
                <div style={p.ready? {'color': 'green'}:{'color': 'red'}}>{p.name}</div>
                { name === p.name ? 
                  p.ready === false ?
                    <div className="btn-ready" onClick={() => onReady(!p.ready)}>READY</div>                      
                    : <div className="btn-cancle"  onClick={() => onReady(!p.ready)}>CANCLE</div>
                  : null
                }
              </div>
            )
          )}
        { players.map((p) => (
          p.position === 'head' && name === p.name &&
            <div key={p.id}>
              <div className="btn-ready-start pd-btn" onClick={ onStartGame } >START GAME</div>
              { !startGame &&  <div className="rejected">All player not yet ready</div> }
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default PrepareRoom