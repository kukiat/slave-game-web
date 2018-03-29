import React from 'react'

const Invite = ({ urlInvite }) => {
  return (
    <div className="invite-player">
      <b>Invite friend</b>
      <div className="invite-url">
        <a href={urlInvite} target="_blank">{window.location.host}{urlInvite}</a>
      </div>
    </div>
  )
}

export default Invite