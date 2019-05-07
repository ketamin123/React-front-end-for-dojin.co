import React from 'react'
import ReactPlayer from 'react-player'

import { PlayerConsumer } from '../../contexts/player_context.js'

import './index.css'

class AudioPlayer extends React.Component {
  handlePlayerEnded = () => {
    const { setPlaying } = this.props

    setPlaying(false)
  }

  handlePause = () => {
    const { setPlaying } = this.props

    setPlaying(false)
  }

  handlePlay = () => {
    const { setPlaying } = this.props

    setPlaying(true)
  }

  render() {
    const { currentUrl, volume, isPlaying, showEmbed } = this.props

    return (
      <div className={`audio-player ${showEmbed ? 'show-embed' : ''}`}>
        <ReactPlayer
          url={currentUrl}
          playing={isPlaying}
          width={750}
          height={270}
          volume={volume}
          onEnded={this.handlePlayerEnded}
          onPause={this.handlePause}
          onPlay={this.handlePlay}
          controls={true}
        />
      </div>
    )
  }
}

const Wrapper = (props) => (
  <PlayerConsumer>
    {({...player_props}) => (
      <AudioPlayer
        {...props}
        {...player_props}
      />
    )}
  </PlayerConsumer>
)

export default Wrapper
