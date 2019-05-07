import Immutable from 'immutable'
import Lockr from 'lockr'
import { createActions, handleActions } from 'redux-actions'
import { browserHistory } from 'react-router'

import APIClient from '../../../Services/APIClient'

export const LOGIN_REQUEST = '@@Login/LOGIN_REQUEST'
export const LOGIN_SUCCESSFUL = '@@Login/LOGIN_SUCCESSFUL'
export const LOGIN_FAILURE = '@@Login/LOGIN_FAILURE'
export const LOGIN_REDIRECT = '@@Login/LOGIN_REDIRECT'

const INITIAL_DOJIN_TOKEN = Lockr.get('DOJIN_TOKEN') || ''
const ROUTE_AFTER_SUCCESSFUL = '/home'

const initialState = Immutable.Map({
  isLoggingIn: false,
  authenticated: INITIAL_DOJIN_TOKEN !== '',
  token: INITIAL_DOJIN_TOKEN
})

export const {
  app: {
    login: {
      loginRequest,
      loginSuccessful,
      loginFailure,
      loginRedirect,
      logout
    }
  }
} = createActions({
  APP: {
    LOGIN: {
      LOGIN_REQUEST: () => {},
      LOGIN_SUCCESSFUL: (token) => ({token}),
      LOGIN_FAILURE: () => {},
      LOGIN_REDIRECT: () => {},
      LOGOUT: () => {}
    }
  }
})

export default handleActions({
  [loginRequest]: (state, action) => {
    return state.set('isLoggingIn', true)
  },
  [loginSuccessful]: (state, action) => {
    APIClient.setToken(action.payload.token)
    Lockr.set('DOJIN_TOKEN', action.payload.token)
    return state
      .set('isLoggingIn', false)
      .set('authenticated', true)
      .set('token', action.payload.token)
  },
  [loginFailure]: (state, action) => {
    APIClient.setToken('')
    return state
      .set('isLoggingIn', false)
      .set('authenticated', false)
      .set('token', '')
  },
  [loginRedirect]: (state, action) => {
    browserHistory.push(ROUTE_AFTER_SUCCESSFUL)
    return state
  },
  [logout]: (state, action) => {
    APIClient.setToken('')
    Lockr.set('DOJIN_TOKEN', '')
    return state
      .set('isLoggingIn', false)
      .set('authenticated', false)
      .set('token', '')
  }
}, initialState)

export const performLogin = (username, password) => {
  return (dispatch, store) => {
    dispatch(loginRequest())

    APIClient.post('/wp-json/jwt-auth/v1/token', { username, password })
      .then((response) => {
        if (response.ok) {
          let token = response.data.token
          dispatch(loginSuccessful(token))
          dispatch(loginRedirect())
        } else {
          dispatch(loginFailure())
        }
      })
  }
}
