import React, { Component } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import 'normalize.css';
import 'tachyons';

import './App.css';

class App extends Component {
  static defaultProps = {
    authenticated: false
  }

  componentDidMount() {
    if (this.props.authenticated) {
      browserHistory.push('/home')
    } else {
      browserHistory.push('/login')
    }
  }

  render() {
    return (
      <div className='appWrapper'>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.Login.get('authenticated')
  }
}

const AppContainer = connect(
  mapStateToProps
)(App)

export default AppContainer
