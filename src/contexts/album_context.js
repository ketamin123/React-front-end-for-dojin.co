import React from 'react'

import ApiClient from '../services/api_client.js'

const AlbumContext = React.createContext()

class AlbumProvider extends React.Component {
  state = {
    albums: [],
    album: null,
    loading: false,
    continueLoading: false,
    totalPerPage: 50,
    totalPages: 0,
    currentPage: 1,
    total: 0,
    currentOptions: {}
  }

  performQuery = (options = {}) => {
    const { totalPerPage } = this.state

    const defaultOptions = {
      '_embed': true,
      'per_page': totalPerPage
    }

    const mergedOptions = Object.assign(defaultOptions, options)

    this.setState({
      loading: true,
      currentOptions: mergedOptions,
      currentPage: 1
    })

    return ApiClient.get('/wp-json/wp/v2/music', mergedOptions).then((response) => {
      this.setState({
        loading: false,
        totalPages: Number(response.headers['x-wp-totalpages']) || 0,
        total: Number(response.headers['x-wp-total']) || 0,
      })

      if (response.ok && response.data) {
        this.setAlbums(response.data)
      }
    })
  }

  performSingleQuery = (id, options = {}) => {
    const defaultOptions = {
      '_embed': true
    }

    const mergedOptions = Object.assign(defaultOptions, options)

    this.setState({
      loading: true,
      currentOptions: mergedOptions,
      currentPage: 1
    })

    return ApiClient.get(`/wp-json/wp/v2/music/${id}`, mergedOptions).then((response) => {
      this.setState({
        loading: false,
        totalPages: 0,
        total: 0,
      })

      if (response.ok && response.data) {
        this.setAlbums([response.data])
      }
    })
  }

  continueQuery = () => {
    const { currentOptions, currentPage, totalPages, continueLoading } = this.state

    if (currentPage < totalPages && !continueLoading) {
      const mergedOptions = {
        ...currentOptions,
        page: currentPage + 1,
      }

      this.setState({
        continueLoading: true,
        currentOptions: mergedOptions,
        currentPage: currentPage + 1
      })

      ApiClient.get('/wp-json/wp/v2/music', mergedOptions).then((response) => {
        this.setState({
          continueLoading: false,
          totalPages: Number(response.headers['x-wp-totalpages']) || 0,
          total: Number(response.headers['x-wp-total']) || 0,
        })

        if (response.ok && response.data) {
          this.appendAlbums(response.data)
        }
      })
    }
  }

  setAlbum = (album) => {
    this.setState({
      album
    })
  }

  setAlbums = (albums) => {
    this.setState({
      albums,
    })
  }

  appendAlbums = (newAlbums) => {
    const { albums } = this.state

    this.setState({
      albums: albums.concat(newAlbums)
    })
  }

  render() {
    const value = {
      album: this.state.album,
      albums: this.state.albums,
      loading: this.state.loading,
      continueLoading: this.state.continueLoading,
      setAlbum: this.setAlbum,
      setAlbums: this.setAlbums,
      performQuery: this.performQuery,
      performSingleQuery: this.performSingleQuery,
      continueQuery: this.continueQuery,
    }

    return (
      <AlbumContext.Provider value={value}>
        {this.props.children}
      </AlbumContext.Provider>
    )
  }
}

const AlbumConsumer = AlbumContext.Consumer

export { AlbumProvider, AlbumConsumer }
