import { combineReducers } from 'redux'

import { reducer as searchReducer } from 'redux-search'

import Login from './Login/Reducers'
import Home from './Home/Reducers'

export default combineReducers({
  search: searchReducer,
  Login,
  Home,
})
