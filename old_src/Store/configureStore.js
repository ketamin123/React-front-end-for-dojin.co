import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../Scenes/reducers'
import { reduxSearch } from 'redux-search'

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  reduxSearch({
    resourceIndexes: {
      terms: ['name', 'slug']
    },
    resourceSelector: (resourceName, state) => {
      return state.Home.get(resourceName)
    }
  }),
);

const store = createStore(rootReducer, {}, enhancer)

export default store
