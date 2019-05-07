import React from 'react'
import { Loader, Dimmer } from 'semantic-ui-react'
import { Transition, animated } from 'react-spring'

import formatAlbum from '../../lib/format_album.js'

import Album from '../../components/album'

import { PlayerConsumer } from '../../contexts/player_context.js'
import { AlbumConsumer } from '../../contexts/album_context.js'

import './index.css'

class AlbumGrid extends React.Component {
  constructor(props) {
    super(props)

    this.albumGridRef = React.createRef()
  }

  handleScroll = () => {
    if (this.albumGridRef.current) {
      const el = this.albumGridRef.current
      const isAtBottom = el.getBoundingClientRect().bottom <= window.innerHeight

      if (isAtBottom) {
        const { continueLoading, continueQuery } = this.props

        if (!continueLoading) {
          continueQuery()
        }
      }
    }
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    const { onAlbumFooterClick, albums } = this.props

    return (
      <PlayerConsumer>
        {({ setAlbum, currentUrl: currentlyPlayingUrl, isPlaying }) => (
          <>
            {
              albums.length === 0 &&
              <div className='empty-state'>
                No albums were found. Try searching again?
              </div>
            }

            <div className='album-grid' ref={this.albumGridRef}>
              <Transition
                native
                items={albums}
                config={{friction: 27, tension: 370}}
                keys={album => album.id}
                trail={30}
                from={{ opacity: 0, transform: 'translate3d(0,-40px,0)' }}
                enter={{ opacity: 1, transform: 'translate3d(0,0px,0)' }}
                leave={{ opacity: 0, display: 'none', transform: 'translate3d(0,-40px,0)' }}
              >
                {album => props =>
                  <animated.div style={props}>
                    <Album
                      key={album.id}
                      album={album}
                      onSampleClick={setAlbum}
                      onAlbumFooterClick={onAlbumFooterClick}
                      isPlaying={isPlaying && (album.sample_url === currentlyPlayingUrl)}
                    />
                  </animated.div>
                }
              </Transition>
            </div>
          </>
        )}
      </PlayerConsumer>
    )
  }
}

class AlbumGridContainer extends React.Component {
  componentDidMount() {
    const { performQuery } = this.props

    performQuery()
  }

  handleAlbumFooterClick = (album) => {
    const { setAlbum, openAlbumSidebar } = this.props

    setAlbum(album)
    openAlbumSidebar()
  }

  render() {
    const { loading, albums, continueLoading, continueQuery } = this.props
    const formatted_albums = albums.map(formatAlbum)

    if (loading) {
       return (
          <Dimmer active inverted className='page'>
            <Loader inverted content='Loading' />
          </Dimmer>
       )
    }

    return (
      <>
        <AlbumGrid
          albums={formatted_albums}
          onAlbumFooterClick={this.handleAlbumFooterClick}
          continueQuery={continueQuery}
          continueLoading={continueLoading}
        />
        <div className='bottom-spacer'>
          {
            continueLoading &&
            <Loader active content='Loading' />
          }
        </div>
      </>
    )
  }
}

const Wrapper = (props) => (
  <AlbumConsumer>
    {({...consumerProps}) => {
      return (
        <AlbumGridContainer
          {...props}
          {...consumerProps}
        />
      )
    }}
  </AlbumConsumer>
)

export default Wrapper
