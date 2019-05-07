import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import he from 'he'
import _ from 'lodash'

import * as LoginActions from '../Login/Reducers'
import * as HomeActions from './Reducers'

import Album from '../../Components/Album'
import SampleQueue from '../../Components/SampleQueue'

import './styles.css';

class Home extends Component {
  static defaultProps = {
    bootstrap: PropTypes.func,
    logout: PropTypes.func,
    addSample: PropTypes.func,
    removeSample: PropTypes.func,
    searchTerms: PropTypes.func,

    queue: PropTypes.array,
    is_searching: PropTypes.bool,
    is_bootstrapping: PropTypes.bool,
    search_text: PropTypes.string,
    recent_albums: PropTypes.array,
    found_search_terms: PropTypes.array,
    all_search_terms: PropTypes.array,

    name: PropTypes.string
  }

  componentDidMount() {
    this.props.bootstrap()
  }

  onKeyDown(event) {
    if (event.target === this.$main) {
      this.focusSearchInput()
    }
  }

  focusSearchInput() {
    this.$searchInput.focus()
  }

  formatAlbum(album) {
    const term_collections = _.get(album, ["_embedded", "wp:term"])

    const artists = _.flatMap(term_collections, (term_collection) => {
      return _.filter(term_collection, (term) => {
        return term["taxonomy"] === "m_artist"
      })
    })

    const styles = _.flatMap(term_collections, (term_collection) => {
      return _.filter(term_collection, (term) => {
        return term["taxonomy"] === "m_style"
      })
    })

    const genre = styles.map((style) => { return style["name"] }).join(", ")
    const artist = _.first(artists)

    return {
      album_name: he.decode(_.get(album, 'title.rendered', '')),
      album_art_url: _.get(album, '_embedded.wp:featuredmedia[0].source_url', ''),
      album_artist: artist ? he.decode(artist["name"]) : "",
      album_genre: genre
    }
  }

  handleSearch(event) {
    this.props.searchTerms(event.target.value)
  }

  get albumList() {
    return this.props.recent_albums.map((album, idx) => {
      const formatted_album = this.formatAlbum(album)

      let addSample = () => {
        this.props.addSample({
          id: album.id,
          name: formatted_album.album_name,
          artist: formatted_album.album_artist,
          genre: formatted_album.album_genre,
          sample_url: album.sample,
          art_url: formatted_album.album_art_url,
          download_url: album.download
        })
      }

      return (
        <Album
          key={idx}
          album_name={formatted_album.album_name}
          album_art_url={formatted_album.album_art_url}
          album_artist={formatted_album.album_artist}
          album_genre={formatted_album.album_genre}
          onAdd={addSample}
        />
      )
    })
  }

  get searchTerms() {
    if (this.props.is_searching || this.props.search_text === "") {
      return null
    } else {
      return (
        <ul>
          {
            this.props.found_search_terms.map((term_id) => {
              let term = this.props.all_search_terms[term_id]

              return (
                <li key={term_id}>{term.name} ({term.count})</li>
              )
            })
          }
        </ul>
      )
    }
  }

  get searchBox() {
    if (this.props.is_bootstrapping) {
      return null
    } else {
      return (
        <div>
          <input type="text" value={this.props.search_text} onChange={this.handleSearch.bind(this)} ref={(input) => { this.$searchInput = input }}></input>
          <div>
            {this.searchTerms}
          </div>
        </div>
      )
    }
  }

  get albums() {
    if (this.props.is_bootstrapping) {
      return (
        <div className='list'>
          <ul>
            <Album key={0} loading={true} />
            <Album key={1} loading={true} />
            <Album key={2} loading={true} />
            <Album key={3} loading={true} />
            <Album key={4} loading={true} />
            <Album key={5} loading={true} />
            <Album key={6} loading={true} />
            <Album key={7} loading={true} />
            <Album key={8} loading={true} />
            <Album key={9} loading={true} />
          </ul>
        </div>
      )
    } else {
      return (
        <div className='list'>
          <div>Welcome {this.props.name} | <a href="/logout">Log Out</a></div>
          <ul>
            {this.albumList}
          </ul>
        </div>
      )
    }
  }

  get queue() {
    return <SampleQueue queue={this.props.queue} removeSample={this.props.removeSample} />
  }

  render() {
    return (
      <div className='djnScene-Home' onKeyDown={this.onKeyDown.bind(this)} tabIndex="0" ref={(input) => { this.$main = input }}>
        {this.searchBox}
        {this.albums}
        {this.queue}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  let search = state.search.terms

  return {
    queue: state.Home.get('queue'),
    is_bootstrapping: state.Home.get('is_bootstrapping'),
    is_searching: search.isSearching,
    found_search_terms: search.result,
    all_search_terms: state.Home.get('terms'),
    search_text: search.text,
    recent_albums: state.Home.get('recent_albums'),
    name: state.Home.get('name')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    bootstrap: () => {
      dispatch(HomeActions.bootstrap())
    },
    logout: () => {
      dispatch(LoginActions.logout())
    },
    addSample: (album_sample_url, album_art_url) => {
      dispatch(HomeActions.addSample(album_sample_url, album_art_url))
    },
    removeSample: (album_id) => {
      dispatch(HomeActions.removeSample(album_id))
    },
    searchTerms: (text) => {
      dispatch(HomeActions.searchTerms(text))
    }
  }
)

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)

export default HomeContainer
