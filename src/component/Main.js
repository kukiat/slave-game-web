import React from 'react'
import styled,{keyframes} from 'styled-components';

class Main extends React.Component {
  state = { name: '' }
  render() {
    return (
      <MainPage>
        <GameTitle>Slave Online</GameTitle>
        <Form>
          <InputName onChange={ (e) => this.setState({name: e.target.value}) }/>
          <BtnLogin onClick={ () => this.props.joinGame(this.state.name) }>JOIN</BtnLogin>
          { this.props.alreadyMember && <RejectedText>Already this name !!</RejectedText> }
        </Form>
      </MainPage>
    )
  }
}

const MainPage = styled.div`
  margin-top:40px;
  font-size: 40px;
  display: grid;
  text-align: center;
  grid-gap: 30px;
  color: papayawhip;
`

const GameTitle = styled.div`
  font-size: 80px;
  font-weight: 500;
  text-shadow: 2px 2px rgb(164, 226, 20);
  margin-bottom: 40px;
`

const Form = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  width: 30%;
  margin: auto;
`

const InputName = styled.input.attrs({
  type: 'text',
  autoFocus: true,
  placeholder: 'Name...'
})`
  border-radius: 30px 0px 0px 30px;
  height: 30px;
  padding: 5px;
  font-size: 20px;
  text-indent:  1ex;
  border: 1px solid #FFF;
`

const BtnLogin = styled.div`
  border-radius: 0px 30px 30px 0px;
  background: rgb(72, 173, 58);
  font-size: 16px;
  padding-top: 12px;
  cursor: pointer;
  &:hover{
    background: rgb(101, 194, 89);
  }
`

const RejectedText = styled.div`
  font-size: 20px;
  margin-top: 10px;
  color:red;
`
export default Main