// http://dojin.co/wp-json/wp/v2/comments?post=62553

import React from 'react'
import { Loader, Dimmer, Sidebar } from 'semantic-ui-react'

import { Get } from '../with_api'

import './index.css'

import CommentList from '../../components/comment_list'

const DiscussionSidebar = (props) => (
  <Sidebar
    className='discussion-sidebar'
    animation='overlay'
    icon='labeled'
    onHide={props.handleSidebarHide}
    visible={props.visible}
    width='wide'
  >
    <Get path='/wp-json/wp/v2/comments?post=62553' options={{'_embed': true}}>
      {({loading, error, data}) => {
        if (loading) {
           return (
              <Dimmer active inverted>
                <Loader inverted content='Loading' />
              </Dimmer>
           )
        }

        if (data) {
          return (
            <>
              <CommentList
                visible={props.visible}
                comments={data}
              />
              <div className='spacer'>
              </div>
            </>
          )
        }

        return (
          <>
          </>
        )
      }}
    </Get>
  </Sidebar>
)

export default DiscussionSidebar
