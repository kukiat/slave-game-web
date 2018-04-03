import React from 'react'

const OtherRoom = (props) => {
  return (
    <div className="other-room-container">
      <div className="room-title">
        Other Room
      </div>
      <div className="room-list">
        { props.allRoom.map((room, i) => (
            <RoomItem 
              key={i}
              room={room}
            />
          ))
        }
      </div>
    </div>
  )
}

const RoomItem = (props) => {
  const { room } = props
  return (
    <div className="room-info">
      <div className="room-name">{ room.roomId }</div>
        <div className="detail-info-room grid-info">
        <div className="title-room-hold">
          {room.players.map((p) => (
            <div key={ p.id } className="other-room-name">{p.name}</div>
          ))}
        </div>
      </div>
      { !room.readyRoom && <div className="join-other-room btn-cancle"> Join</div> }
    </div>
  )
}

export default OtherRoom