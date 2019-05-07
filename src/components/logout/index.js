import React from 'react'
import { Redirect } from 'react-router-dom'

import { AuthConsumer } from '../../contexts/auth_context.js'

const Logout = ({
  performLogout
}) => {
  performLogout()

  return (
    <Redirect
      to={{
        pathname: '/',
      }}
    />
  )
}

const WrappedLogout = (props) => (
  <AuthConsumer>
    {({ logout }) => (
      <Logout
        performLogout={logout}
      />
    )}
  </AuthConsumer>
)

export default WrappedLogout
