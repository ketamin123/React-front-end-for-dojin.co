import React from 'react'
import { Form, Button } from 'semantic-ui-react'

import { AuthConsumer } from '../../contexts/auth_context.js'
import { Post } from '../with_api'

import './index.css'

class Login extends React.Component {
  state = {
    afterSubmit: false,
    username: '',
    password: '',
  }

  setUsername = (e) => {
    this.setState({
      username: e.target.value
    })
  }

  setPassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  wrapLogin = (mutation) => () => {
    const { username, password, key } = this.state

    this.setState({
      afterSubmit: true
    })

    if (username.length && password.length) {
      mutation({
        username,
        password
      }).then((response) => {
        if (response.data && response.data.token) {
          this.props.setToken(response.data.token)
        }
      })
    }
  }

  render() {
    return (
      <div className='ui center aligned middle aligned grid login-form-container'>
        <Post path='/wp-json/jwt-auth/v1/token'>
          {(performLogin, {loading, error, data}) => {
            return (
              <div className='column' style={{maxWidth: 580}}>
                <Form loading={loading}>
                  <Form.Field>
                    <Form.Input
                      type='text'
                      icon='users'
                      iconPosition='left'
                      placeholder='Username'
                      value={this.state.username}
                      onChange={this.setUsername}
                      error={this.state.afterSubmit && this.state.username === ''}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Input
                      type='password'
                      icon='key'
                      iconPosition='left'
                      placeholder='Password'
                      value={this.state.password}
                      onChange={this.setPassword}
                      error={this.state.afterSubmit && this.state.password === ''}
                    />
                  </Form.Field>
                  <Button
                    loading={loading}
                    onClick={this.wrapLogin(performLogin)}
                  >
                    Log In
                  </Button>
                </Form>
              </div>
            )
          }}
        </Post>
      </div>
    )
  }
}

const WrappedLogin = (props) => (
  <AuthConsumer>
    {({ login: setToken }) => (
      <Login
        setToken={setToken}
        {...props}
      />
    )}
  </AuthConsumer>
)

export default WrappedLogin
