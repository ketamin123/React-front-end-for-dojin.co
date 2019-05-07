import Immutable from 'immutable'
import { createActions, handleActions } from 'redux-actions'
import { createSearchAction } from 'redux-search'

import * as LoginActions from '../../Login/Reducers'

import EnqueuedSample from '../../../Structs/enqueued_sample'

import APIClient from '../../../Services/APIClient'

const initialState = Immutable.Map({
  queue: Immutable.List(),
  is_bootstrapping: false,
  terms: {},
  recent_albums: [],
  name: ''
})

export const {
  bootstrapRequest,
  bootstrapSuccessful,
  bootstrapFailure,
  setUser,
  setRecentAlbums,
  setSearchTerms,
  addSample,
  removeSample
} = createActions({
  BOOTSTRAP_REQUEST: () => {},
  BOOTSTRAP_SUCCESSFUL: () => {},
  BOOTSTRAP_FAILURE: () => {},
  SET_USER: (user) => ({user}),
  SET_RECENT_ALBUMS: (recent_albums) => ({recent_albums}),
  SET_SEARCH_TERMS: (search_terms) => ({search_terms}),
  ADD_SAMPLE: (album) => ({
    enqueued_sample: new EnqueuedSample({
      id: album.id,
      album_name: album.name,
      album_artist: album.artist,
      album_genre: album.genre,
      album_sample_url: album.sample_url,
      album_art_url: album.art_url,
      album_download_url: album.download_url
    })
  }),
  REMOVE_SAMPLE: (album_id) => ({
    album_id
  })
})

const addSampleToQueue = (queue, enqueued_sample) => {
  if (queue.includes(enqueued_sample)) {
    return queue
  } else {
    return queue.push(enqueued_sample)
  }
}

const removeSampleFromQueue = (queue, album_id) => {
  return queue.filter((enqueued_sample) => enqueued_sample.id !== album_id)
}

export default handleActions({
  [bootstrapRequest]: (state, action) => {
    return state
      .set('is_bootstrapping', true)
  },
  [bootstrapSuccessful]: (state, action) => {
    return state
      .set('is_bootstrapping', false)
  },
  [bootstrapFailure]: (state, action) => {
    return state
      .set('is_bootstrapping', false)
  },
  [setUser]: (state, action) => {
    return state
      .set('name', action.payload.user.name)
  },
  [setRecentAlbums]: (state, action) => {
    return state
      .set('recent_albums', action.payload.recent_albums)
  },
  [setSearchTerms]: (state, action) => {
    let search_terms = {};

    [].concat(action.payload.search_terms.artists, action.payload.search_terms.styles).forEach((term) => {
      search_terms[term.term_id] = {
        id: term.term_id,
        name: term.name,
        slug: term.slug,
        count: term.count
      }
    })

    return state
      .set('terms', search_terms)
  },
  [addSample]: (state, action) => {
    return state
      .update('queue', (queue) => {
        return addSampleToQueue(queue, action.payload.enqueued_sample)
      })
  },
  [removeSample]: (state, action) => {
    return state
      .update('queue', (queue) => {
        return removeSampleFromQueue(queue, action.payload.album_id)
      })
  }
}, initialState)

export const bootstrap = () => {
  return (dispatch, store) => {
    dispatch(bootstrapRequest())

    let userRequest = APIClient.get('/wp-json/wp/v2/users/me', {'_embed': true})
    let musicRequest = APIClient.get('/wp-json/wp/v2/music', {'_embed': true})
    let searchTermsRequest = APIClient.get('/wp-json/djn/v1/search_terms')

    Promise
      .all([userRequest, musicRequest, searchTermsRequest])
      .then(([userResponse, musicResponse, searchTermsResponse]) => { 
        if (userResponse.ok && musicResponse.ok && searchTermsResponse.ok) {
          return Promise.resolve([userResponse, musicResponse, searchTermsResponse])
        } else {
          return Promise.reject()
        }
      })
      .then(([userResponse, musicResponse, searchTermsResponse]) => {
        dispatch(setUser(userResponse.data))
        dispatch(setRecentAlbums(musicResponse.data))
        dispatch(setSearchTerms(searchTermsResponse.data))
        dispatch(bootstrapSuccessful())
      })
      .catch(() => {
        dispatch(bootstrapFailure())
        dispatch(LoginActions.logout())
      })
  }
}

export const searchTerms = createSearchAction('terms')
