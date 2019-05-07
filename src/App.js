import React from 'react'
import './App.css'
import { hot } from 'react-hot-loader'

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"

import { AuthProvider, AuthConsumer } from './contexts/auth_context.js'
import { PlayerProvider } from './contexts/player_context.js'
import { AuthRoute, DeauthRoute } from './lib/router_helpers.js'
import { SearchTermProvider } from './contexts/search_term_context.js'
import { AlbumProvider } from './contexts/album_context.js'

import Login from './components/login'
import Logout from './components/logout'
import Home from './components/home'
import AlbumView from './components/album_view'

import { newDjnSignature, verifyDjnSignature } from './lib/crypto.js'

import tweetnacl from 'tweetnacl'
import naclutil from 'tweetnacl-util'

window.tweetnacl = tweetnacl
window.tweetnacl.util = naclutil
window.newDjnSignature = newDjnSignature
window.verifyDjnSignature = verifyDjnSignature

const App = () => (
  <AuthProvider>
    <PlayerProvider>
        <Router>
          <AuthConsumer>
            {({ isAuthed }) => (
              <SearchTermProvider isAuthed={isAuthed}>
                <AlbumProvider>
                  <Switch>
                    <DeauthRoute path="/" exact component={Login} isAuthed={isAuthed} />
                    <AuthRoute path="/home" exact component={Home} isAuthed={isAuthed} />
                    <AuthRoute path="/albums/:id" exact component={AlbumView} isAuthed={isAuthed} />
                    <AuthRoute path="/logout" component={Logout} isAuthed={isAuthed} />

                    <Route>
                      <Redirect from='*' to='/' />
                    </Route>
                  </Switch>
                </AlbumProvider>
              </SearchTermProvider>
            )}
          </AuthConsumer>
        </Router>
    </PlayerProvider>
  </AuthProvider>
)

export default hot(module)(App)

