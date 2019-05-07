import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Colors from '../src/Utils/Colors';

const ContainerStyles = {
  width: '100%',
  padding: '20px'
}

const ColorElements = () => {
  return (
    Object.keys(Colors).map((key, idx) => {
      let style = {
        'height': '50px',
        'backgroundColor': Colors[key]
      }

      if (idx > 4) {
        style = Object.assign(style, {
          color: '#fff'
        })
      }

      return (<div style={style}>{Colors[key]}</div>)
    })
  )
}

storiesOf('Colors', module)
  .add('Color', () => (
    <div style={ContainerStyles}>
      {ColorElements()}
    </div>
  ))
