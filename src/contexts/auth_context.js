import React from 'react'

import { getAuthToken, setAuthToken, getFromLocalStorage, setToLocalStorage } from '../lib/local_storage.js'
import ApiClient from '../services/api_client.js'

const AuthContext = React.createContext()

const isActiveAuthToken = (authToken) => {
  if (authToken && authToken.length) {
    let currentTime = Date.now() / 1000
    let payload = JSON.parse(window.atob(authToken.split('.')[1]))

    return currentTime < payload.exp
  } else {
    return false
  }
}

class AuthProvider extends React.Component {
  state = {
    isAuthed: false
  }

  constructor(props) {
    super(props)

    const token = getAuthToken()
    const hasActiveAuthToken = isActiveAuthToken(token)

    ApiClient.setToken(token)

    const isAuthed = hasActiveAuthToken

    this.state.isAuthed = isAuthed

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)

    if (!isAuthed) {
      this.logout()
    }
  }

  getKey = () => {
    return getFromLocalStorage('DOJIN_KEY', '')
  }

  setKey = (key) => {
    return setToLocalStorage('DOJIN_KEY', key)
  }

  login(token) {
    const hasActiveAuthToken = isActiveAuthToken(token)
    const isAuthed = hasActiveAuthToken

    if (isAuthed) {
      setAuthToken(token)

      ApiClient.setToken(token)

      this.setState({
        isAuthed: isAuthed
      })
    }
  }

  logout() {
    setAuthToken('')
    ApiClient.setToken('')
    this.setKey('')

    this.setState({
      isAuthed: false
    })
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          isAuthed: this.state.isAuthed,
          login: this.login,
          logout: this.logout
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer }
