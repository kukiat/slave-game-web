import React from 'react'
import styled from 'styled-components';

import {Card1, Card2, Card3, Card4} from './card1' 
import { Card5, Card6, Card7, Card8 } from './card2'
import { Card9, Card10, Card11, Card12 } from './card3'
import { Card13, Card14, Card15, Card16 } from './card4'
import { Card17, Card18, Card19, Card20 } from './card5'
import { Card21, Card22, Card23, Card24 } from './card6'
import { Card25, Card26, Card27, Card28 } from './card7'
import { Card29, Card30, Card31, Card32 } from './card8'
import { Card33, Card34, Card35,Card36 } from './card9'
import { Card37,Card38, Card39, Card40 } from './card10'
import { Card41,Card42, Card43, Card44 } from './card11'
import { Card45, Card46, Card47, Card48 } from './card12'
import { Card49, Card50, Card51, Card52 } from './card13'

const Card = (props) => {
  const { number, index, selectCard } = props
  return (
    <WrapCard onClick={() => selectCard(number)} index={index}>
      { number === 0 && <Card9/>}
      { number === 1 && <Card10/>}
      { number === 2 && <Card11/>}
      { number === 3 && <Card12/>}
      { number === 4 && <Card13/>}
      { number === 5 && <Card14/>}
      { number === 6 && <Card15/>}
      { number === 7 && <Card16/>}
      { number === 8 && <Card17/>}
      { number === 9 && <Card18/>}
      { number === 10 && <Card19/>}
      { number === 11 && <Card20/>}
      { number === 12 && <Card21/>}
      { number === 13 && <Card22/>}
      { number === 14 && <Card23/>}
      { number === 15 && <Card24/>}
      { number === 16 && <Card25/>}
      { number === 17 && <Card26/>}
      { number === 18 && <Card27/>}
      { number === 19 && <Card28/>}
      { number === 20 && <Card29/>}
      { number === 21 && <Card30/>}
      { number === 22 && <Card31/>}
      { number === 23 && <Card32/>}
      { number === 24 && <Card33/>}
      { number === 25 && <Card34/>}
      { number === 26 && <Card35/>}
      { number === 27 && <Card36/>}
      { number === 28 && <Card37/>}
      { number === 29 && <Card38/>}
      { number === 30 && <Card39/>}
      { number === 31 && <Card40/>}
      { number === 32 && <Card1/>}
      { number === 33 && <Card2/>}
      { number === 34 && <Card3/>}
      { number === 35 && <Card4/>}
      { number === 36 && <Card41/>}
      { number === 37 && <Card42/>}
      { number === 38 && <Card43/>}
      { number === 39 && <Card44/>}
      { number === 40 && <Card45/>}
      { number === 41 && <Card46/>}
      { number === 42 && <Card47/>}
      { number === 43 && <Card48/>}
      { number === 44 && <Card49/>}
      { number === 45 && <Card50/>}
      { number === 46 && <Card51/>}
      { number === 47 && <Card52/>}
      { number === 48 && <Card5/>}
      { number === 49 && <Card6/>}
      { number === 50 && <Card7/>}
      { number === 51 && <Card8/>}
    </WrapCard>
  )
}

Card.defaultProps = {
  selectCard: () => {},
  index: 1,
  number: 1
}

const WrapCard = styled.div`
  position: absolute;
  z-index: ${props => props.index};
  margin-left: ${props => props.index*20}px;
  width: 75px;
  height: 115px;
`

export default Card