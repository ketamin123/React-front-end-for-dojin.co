import React from 'react'
import { Icon, Input, Label } from 'semantic-ui-react'

import { AlbumConsumer } from '../../contexts/album_context.js'

import './index.css'

import CommentList from '../../components/comment_list'

import { format } from 'date-fns'

const selectAndCopy = (e) => {
  e.target.select()
  document.execCommand('copy')
}

class DetailedAlbum extends React.Component {
  render() {
    const { album } = this.props
    const url = `${window.location.origin}/albums/${album.id}`
    const artists = album.artists.map((artist) => artist.name).join(' x ')

    return (
      <>
        <div className='meta'>
          <div className='album-meta'>
            <Label basic>
              Album Name:
              <Label.Detail>
                {album.album_name}
              </Label.Detail>
            </Label>
            <Label basic>
              Artists:
              <Label.Detail>
                {artists}
              </Label.Detail>
            </Label>
            <Label basic>
              Created at:
              <Label.Detail>
                {format(album.created_at, 'MMMM Do YYYY HH:mm')}
              </Label.Detail>
            </Label>
            <Label basic>
              Last updated at:
              <Label.Detail>
                {format(album.updated_at, 'MMMM Do YYYY HH:mm')}
              </Label.Detail>
            </Label>
          </div>
          <div className='url'>
            <Label basic horizontal size='large'>URL: </Label>
            <Input name='url' type='text' readOnly value={url} onClick={selectAndCopy} />
          </div>
        </div>
        <div className='comments'>
          {
            !album.comments.length &&
            <div className='empty-state'>No comments found.</div>
          }

          {
            Boolean(album.comments.length) &&
            <CommentList comments={album.comments}/>
          }
        </div>
      </>
    )
  }
}

class AlbumSidebar extends React.Component {
  render() {
    const { visible, album, handleSidebarClose } = this.props

    return (
      <div className={`album-sidebar ${visible ? 'visible' : ''}`}>
        <div className='close-button' onClick={handleSidebarClose}>
          <Icon name='close' />
        </div>

        {
          !album &&
          <div className='empty-state'>
            No album was selected.
          </div>
        }

        {
          album &&
          <DetailedAlbum
            album={album}
          />
        }
      </div>
    )
  }
}

const Wrapper = (props) => (
  <AlbumConsumer>
    {({...album_props}) => (
      <AlbumSidebar
        {...props}
        {...album_props}
      />
    )}
  </AlbumConsumer>
)

export default Wrapper
