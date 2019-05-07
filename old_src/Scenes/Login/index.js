import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import TextInput from '../../Components/TextInput'
import Button from '../../Components/Button'

import * as LoginActions from './Reducers'

import './styles.css';

class Login extends Component {
  static propTypes = {
    isLoggingIn: PropTypes.bool,
    authenticated: PropTypes.bool,
    token: PropTypes.string,
    login: PropTypes.func,
  }

  static defaultProps = {
    isLoggingIn: false,
    authenticated: false,
    token: '',
    login: () => {}
  }

  state = {
    username: '',
    password: ''
  }

  performLogin = (e) => {
    e.preventDefault()
    e.stopPropagation()

    let [username, password] = [this.state.username, this.state.password]

    if (this.props.login && (username !== '') && (password !== '')) {
      this.props.login(username, password)
    }
  }

  usernameChange = (event) => {
    let username = event.target.value
    this.setState({
      username
    })
  }

  passwordChange = (event) => {
    let password = event.target.value
    this.setState({
      password
    })
  }

  render() {
    return (
			<div className='djnScene-Login'>
        <div className="description">
          <p>dojin.co is a community project that gathers links of publicly available doujin music and streaming samples.</p>
        </div>
        <form onSubmit={this.performLogin}>
          <div className="username">
            <TextInput placeholder='Username' type='username' value={this.state.username} onChange={this.usernameChange} />
          </div>
          <div className="password">
            <TextInput placeholder='Password' type='password' value={this.state.password} onChange={this.passwordChange} />
          </div>
          <Button label='Submit' type="submit"/>
        </form>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    isLoggingIn: state.Login.get('isLoggingIn'),
    authenticated: state.Login.get('authenticated'),
    token: state.Login.get('token')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    login: (username, password) => {
      dispatch(LoginActions.performLogin(username, password))
    }
  }
)

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default LoginContainer
