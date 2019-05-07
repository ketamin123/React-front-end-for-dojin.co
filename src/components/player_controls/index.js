import React from 'react'

import { Icon } from 'semantic-ui-react'

import { PlayerConsumer } from '../../contexts/player_context.js'
import './index.css'

class PlayerControls extends React.Component {
  setVolume = (e) => {
    const { setVolume } = this.props
    const volumeLevel = e.target.value / 100

    setVolume(volumeLevel)
  }

  openAlbumSample = (album) => {
    if (album && album.sample_url) {
      window.open(album.sample_url)
    }
  }

  render() {
    const { isPlaying, setPlaying, volume, currentAlbum, showEmbed, setShowEmbed } = this.props

    const albumArtists = (currentAlbum && currentAlbum.artists) || []
    const artists = albumArtists.map((artist) => artist.name).join(' x ')

    return (
      <div className={`player-controls ${isPlaying ? 'is-playing' : ''}`}>
        <div
          className={`player-action play-button`}
          onClick={() => setPlaying(!isPlaying)}
        >
          {isPlaying && <Icon name='pause'/>}
          {!isPlaying && <Icon name='play'/>}
        </div>
        <div className='player-action open-external' onClick={() => this.openAlbumSample(currentAlbum)}>
          <Icon name='external' />
        </div>
        <div className='player-action album-info' onClick={() => setShowEmbed(!showEmbed)}>
          <div className='album-name'>
            {currentAlbum ? currentAlbum.album_name : 'Select an album to play.'}
          </div>
          <div className='album-artists'>
            {currentAlbum ? artists : ''}
          </div>
        </div>
        <div className='player-action volume-slider'>
          {(volume * 100) > 50 && <Icon name='volume up' />}
          {(volume * 100) < 50 && (volume !== 0) && <Icon name='volume down' />}
          {(volume === 0) && <Icon name='volume off' />}

          <input type='range' onChange={this.setVolume} value={volume * 100}/>
        </div>
      </div>
    )
  }
}

const Wrapper = (props) => (
  <PlayerConsumer>
    {({...player_props}) => (
      <PlayerControls
        {...props}
        {...player_props}
      />
    )}
  </PlayerConsumer>
)

export default Wrapper
