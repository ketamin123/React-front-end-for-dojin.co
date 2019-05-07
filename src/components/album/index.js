import React from 'react'
import ReactPlayer from 'react-player'
import { Icon } from 'semantic-ui-react'

import './index.css'

const windowOpen = (url) => {
  window.open(url)
}

const Album = (props) => {
  const { album, onSampleClick, onAlbumFooterClick, isPlaying } = props
  const artists = album.artists.map((artist) => artist.name).join(' x ')

  const extraClasses = isPlaying ? 'is-playing' : ''

  const canPlay = ReactPlayer.canPlay(album.sample_url)

  const wrappedOnSampleClick = (album) => {
    if (canPlay) {
      onSampleClick(album)
    } else {
      windowOpen(album.sample_url)
    }
  }

  return (
    <div key={album.id} className={`album-container ${extraClasses}`}>
      {
        album.top_right_text &&
        <div className='album-tag'>
          {album.top_right_text}
        </div>
      }
      <div className='album'>
        <img height='200' width='200' src={album.album_art_url} alt={album.album_name} />
      </div>
      <div className='album-actions'>
        <div className='album-sample-link' onClick={() => wrappedOnSampleClick(album)}>
          {canPlay && isPlaying && <Icon name='pause'/>}
          {canPlay && !isPlaying && <Icon name='play'/>}
          {!canPlay && <div>Sample</div>}
        </div>
        <div className='album-download-link' onClick={() => windowOpen(album.download_url)}>
          <Icon name='cloud download'/>
        </div>
      </div>
      <div className='album-footer' onClick={() => onAlbumFooterClick(album)}>
        <div className='album-stats'>
          <div className='album-artists'>
            {artists}
          </div>
          <span className='album-comment-count'>
            <Icon name='discussions' />{album.comments.length}
          </span>
          <span className='album-likes'>
            <Icon name='fire' />{album.vote_total}
          </span>
        </div>
        <div className='album-genres'>
          {album.genres.map((genre) => <span className='album-genre' key={genre}>{genre}</span>)}
        </div>
        <div className='album-name'>
          {album.album_name}
        </div>
      </div>
    </div>
  )
}

export default Album
