import React from 'react'
import styled from 'styled-components';

const InviteFriend = styled.div`
  text-align: center;
  background: #FFFFFF;
  padding: 5px;
  font-size: 30px;
  color: rgb(55, 55, 55);
  .invite-title{
    font-weight: 550;
  }
  .invite-url {
    color: #83d0f2; 
  }
  .invite-url a {
    text-decoration: none;
    color: dodgerblue;
    &:hover {
      text-decoration: underline;
    }
  }
`

const Invite = ({ urlInvite }) => {
  return (
    <InviteFriend>
      <span className="invite-title">Invite friend </span>
      <span className="invite-url">
        <a href={urlInvite} target="_blank">{window.location.host}{urlInvite}</a>
      </span>
    </InviteFriend>
  )
}

export default Invite