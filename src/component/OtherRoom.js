import React from 'react'

const OtherRoom = (props) => {
  return (
    <div className="all-room">
      <div className="all-room-title">
        Other Room
      </div>
      <div className="room-list">
        { props.allRoom.map((room, i) => (
            <OtherRoomItem 
              key={i}
              room={room}
            />
          ))
        }
      </div>
    </div>
  )
}

const OtherRoomItem = (props) => {
  const { room } = props
  return (
    <div className="room-info">
      <div className="room-name">{ room.roomId }</div>
      <div className="detail-info-room grid-info">
        <div className="title-room-hold">
          {room.players.map((p) => (
            <OtherRoomRoster key={ p.id } name={p.name}/>
          ))}
        </div>
      </div>
      { !room.readyRoom && <div className="join-other-room btn-cancle"> Join</div> }
    </div>
  )
}

const OtherRoomRoster = (props) => {
  return (
    <div className="other-room-name">{props.name}</div>
  )
}

export default OtherRoom