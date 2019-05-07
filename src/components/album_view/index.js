import React from 'react'
import { Redirect } from 'react-router-dom'
import { Loader, Dimmer, Label } from 'semantic-ui-react'
import { format } from 'date-fns'

import formatAlbum from '../../lib/format_album.js'

import { Get } from '../../components/with_api'
import { PlayerConsumer } from '../../contexts/player_context.js'

import Album from '../../components/album'
import CommentList from '../../components/comment_list'
import AudioPlayer from '../../components/audio_player'
import PlayerControls from '../../components/player_controls'

import WithUserbar from '../../components/userbar'

import './index.css'

const AlbumView = (props) => {
  const { album, isPlaying, setAlbum } = props
  const artists = album.artists.map((artist) => artist.name).join(' x ')

  return (
    <div className='single-album-container'>
      <div className='single-album-view'>
        <Album
          key={album.id}
          album={album}
          onSampleClick={setAlbum}
          onAlbumFooterClick={() => {}}
          isPlaying={isPlaying}
        />
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
      </div>
    </div>
  )
}

const Wrapper = (props) => {
  const { match } = props
  const id = match.params.id
  const hasId = Boolean(id)

  if (!hasId) {
    return (
      <Redirect to='/home' />
    )
  } else {
    return (
      <Get path={`/wp-json/wp/v2/music/${id}`} options={{'_embed': true}}>
        {({loading, error, data}) => {
          if (loading) {
             return (
                <Dimmer active inverted>
                  <Loader inverted />
                </Dimmer>
             )
          }

          if (data) {
            return (
              <PlayerConsumer>
                {({ setAlbum, currentUrl: currentlyPlayingUrl, isPlaying }) => {
                  const album = formatAlbum(data)

                  return (
                    <>
                      <AlbumView
                        loading={loading}
                        error={error}
                        album={album}
                        setAlbum={setAlbum}
                        isPlaying={isPlaying && (album.sample_url === currentlyPlayingUrl)}
                        {...props}
                      />
                      <AudioPlayer />
                      <PlayerControls />
                    </>
                  )
                }}
              </PlayerConsumer>
            )
          }

          return (
            <Redirect to='/home' />
          )
        }}
      </Get>
    )
  }
}

export default WithUserbar(Wrapper)
