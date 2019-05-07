import React from 'react'

import { getFromLocalStorage, setToLocalStorage } from '../lib/local_storage.js'

const PlayerContext = React.createContext()

class PlayerProvider extends React.Component {
  state = {
    currentAlbum: null,
    currentUrl: null,
    isPlaying: false,
    volume: parseFloat(getFromLocalStorage('DOJIN_VOLUME', '1')) || 1,
    muted: false,
    showEmbed: false,
  }

  setAlbum = (album) => {
    const url = album.sample_url

    if (url === this.state.currentUrl) {
      this.setState({
        isPlaying: !this.state.isPlaying
      })
    } else {
      this.setState({
        currentAlbum: album,
        currentUrl: url,
        isPlaying: true
      })
    }
  }

  setPlaying = (playing) => {
    if (!this.state.currentUrl) return

    this.setState({
      isPlaying: playing
    })
  }

  setVolume = (volume) => {
    setToLocalStorage('DOJIN_VOLUME', volume)

    this.setState({
      volume
    })
  }

  setShowEmbed = (showEmbed) => {
    this.setState({
      showEmbed
    })
  }

  render() {
    const value = {
      setAlbum: this.setAlbum,
      setPlaying: this.setPlaying,
      setVolume: this.setVolume,
      setShowEmbed: this.setShowEmbed,
      ...this.state
    }

    return (
      <PlayerContext.Provider value={value}>
        {this.props.children}
      </PlayerContext.Provider>
    )
  }
}

const PlayerConsumer = PlayerContext.Consumer

export { PlayerProvider, PlayerConsumer }
