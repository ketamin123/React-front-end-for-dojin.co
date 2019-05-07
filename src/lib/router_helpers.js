import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const AuthRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        rest.isAuthed ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

const DeauthRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        !rest.isAuthed ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/home',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

export {
  AuthRoute,
  DeauthRoute
}
