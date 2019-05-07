import React from 'react'

import { Get } from '../with_api'
import { Loader, Dimmer } from 'semantic-ui-react'
import { Link } from "react-router-dom"

import './index.css'

const WithUserbar = (Child) => (props) => (
  <Get path='/wp-json/wp/v2/users/me' options={{'_embed': true}}>
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
          <>
            <div className='userbar'>
              <div className='home-button'>
                <Link to='/home'>Home</Link>
              </div>
              <div className='logout-button'>
                <Link to='/logout'>Log Out</Link>
              </div>
              <div className='username'>{data.name}</div>
              {
                props.match.path === '/home' &&
                <div className='search'>Press enter to start searching</div>
              }
              <div className='spacer'></div>
            </div>

            <Child {...props} />
          </>
        )
      }
    }}
  </Get>
)

export default WithUserbar
