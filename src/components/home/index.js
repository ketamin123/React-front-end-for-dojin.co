import React from 'react'

import { Sidebar, Icon } from 'semantic-ui-react'

import DiscussionSidebar from '../../components/discussion_sidebar'
import AlbumSidebar from '../../components/album_sidebar'
import AlbumGrid from '../../components/album_grid'
import WithUserbar from '../../components/userbar'
import SearchOverlay from '../../components/search_overlay'
import PlayerControls from '../../components/player_controls'
import AudioPlayer from '../../components/audio_player'
import { AlbumConsumer } from '../../contexts/album_context.js'

import './index.css'

class Home extends React.Component {
  state = {
    visible: false,
    searchOverlayVisible: false,
    albumSidebarVisible: false,
  }

  handleToggleClick = () => {
    this.setState({ visible: !this.state.visible })
  }

  handleSidebarHide = (e) => {
    if (!e.target.closest('.floating-discussion-toggle')) {
      this.setState({ visible: false })
    }
  }

  handleAlbumSidebarHide = () => {
    this.setState({
      albumSidebarVisible: false
    })
  }

  openAlbumSidebar = () => {
    this.setState({
      albumSidebarVisible: true
    })
  }

  handleOverlayClose = () => {
    this.setState({
      searchOverlayVisible: false
    })
  }

  onKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      if (this.state.searchOverlayVisible) {
        this.setState({
          searchOverlayVisible: false
        })
      } else if (this.state.albumSidebarVisible) {
        this.setState({
          albumSidebarVisible: false
        })
      }
    } else if (evt.key === 'Enter' && !evt.shiftKey) {
      if (!this.state.searchOverlayVisible) {
        this.setState({
          searchOverlayVisible: true
        })
      }
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false)
  }

  render() {
    const { visible, searchOverlayVisible, albumSidebarVisible } = this.state

    return (
      <AlbumConsumer>
        {({loading}) => (
          <div className={`home ${loading ? 'is-loading' : ''}`}>
            <DiscussionSidebar
              handleSidebarHide={this.handleSidebarHide}
              visible={visible}
            />
            <PlayerControls />
            <Sidebar.Pushable>
              <Sidebar.Pusher>
                <AlbumGrid
                  openAlbumSidebar={this.openAlbumSidebar}
                />
              </Sidebar.Pusher>
            </Sidebar.Pushable>
            <div className='floating-discussion-toggle' onClick={this.handleToggleClick}>
              <Icon name='discussions' />
            </div>

            <AudioPlayer />

            <SearchOverlay
              visible={searchOverlayVisible}
              handleOverlayClose={this.handleOverlayClose}
            />

            <AlbumSidebar
              visible={albumSidebarVisible}
              handleSidebarClose={this.handleAlbumSidebarHide}
            />
          </div>
        )}
      </AlbumConsumer>
    )
  }
}

const WrappedHome = WithUserbar(Home)

export default WrappedHome
