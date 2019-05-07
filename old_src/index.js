import React from 'react';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom';

import store from './Store/configureStore'
import App from './App';

import Login from './Scenes/Login'
import * as LoginActions from './Scenes/Login/Reducers'
import Home from './Scenes/Home'

import 'tachyons';
import 'normalize.css';
import './index.css';

import { Router, Route, browserHistory } from 'react-router'

/**
 * If the user is no longer authenticated, aka:
 * no longer has an dojin token. We'll need to make
 * them log in again.
 */

const requireAuth = (nextState, replace) => {
  let state = store.getState()

  const authenticated = state.Login.get('authenticated')
  const token = state.Login.get('token')

  if (!authenticated || !token) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const logout = (nextState, replace) => {
  store.dispatch(LoginActions.logout())

  replace({
    pathname: '/login'
  })
}

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <Route path='/login' component={Login} />
        <Route path='/home' component={Home} onEnter={requireAuth}/>

        <Route path='/logout' onEnter={logout}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'))
