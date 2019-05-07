import React from 'react'
import SearchApi from 'js-worker-search'

import ApiClient from '../services/api_client.js'

const SearchTermContext = React.createContext()

class SearchTermProvider extends React.Component {
  state = {
    initialized: false,
    loading: true,
    styles: [],
    artists: [],
    matchedTerms: [],
  }

  constructor(props) {
    super(props)

    this.searchApi = new SearchApi()
  }

  componentDidMount() {
    const { isAuthed } = this.props

    if (isAuthed) {
      this.bootstrapSearchTerms()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isAuthed && !prevProps.isAuthed) {
      this.bootstrapSearchTerms()
    }
  }

  bootstrapSearchTerms = () => {
    this.setState({
      loading: true
    })

    const searchTermsRequest = ApiClient.get('/wp-json/djn/v1/search_terms')

    searchTermsRequest.then((response) => {
      if (response.ok) {
        if (response.data) {
          response.data.styles.forEach((style) => {
            this.searchApi.indexDocument(style.term_id, style.name)
          })

          response.data.artists.forEach((artist) => {
            this.searchApi.indexDocument(artist.term_id, artist.name)
          })

          const styles = response.data.styles.reduce((map, obj) => {
            map[obj.term_id] = obj
            return map
          }, {})

          const artists = response.data.artists.reduce((map, obj) => {
            map[obj.term_id] = obj
            return map
          }, {})

          this.setState({
            loading: false,
            styles,
            artists
          })
        }
      }
    })
  }

  performSearch = (term) => {
    if (!term || term.length < 3) {
      return this.setState({
        matchedTerms: []
      })
    }

    return this.searchApi.search(term).then((results) => {
      const matchedStyles = results.map((term_id) => this.state.styles[term_id]).filter((val) => val)
      const matchedArtists = results.map((term_id) => this.state.artists[term_id]).filter((val) => val)

      this.setState({
        matchedTerms: matchedStyles.concat(matchedArtists)
      })
    })
  }

  render() {
    const value = {
      performSearch: this.performSearch,
      loading: this.state.loading,
      ...this.state
    }

    return (
      <SearchTermContext.Provider value={value}>
        {this.props.children}
      </SearchTermContext.Provider>
    )
  }
}

const SearchTermConsumer = SearchTermContext.Consumer

export { SearchTermProvider, SearchTermConsumer }
