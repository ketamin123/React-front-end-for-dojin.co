import React from 'react'

import { Button, Icon, Modal, Input, Label } from 'semantic-ui-react'

import { SearchTermConsumer } from '../../contexts/search_term_context.js'
import { AlbumConsumer } from '../../contexts/album_context.js'

import SearchTags from './search_tags.js'
import './index.css'

const debounce = (func, wait) => {
  let timeout

  return function(...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }
}

class SearchOverlay extends React.Component {
  state = {
    searchValue: '',
    highlightedTermIndex: 0,
    selectedTerms: [],
  }

  constructor(props) {
    super(props)

    this.searchInput = React.createRef()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.searchInput.current) {
      this.searchInput.current.focus()
    }
  }

  addSearchTerm = (term) => {
    const { selectedTerms } = this.state

    this.setState({
      searchValue: ''
    })

    const alreadyAdded = selectedTerms.some(selectedTerm => selectedTerm.term_id === term.term_id)

    if (!alreadyAdded) {
      this.setState({
        selectedTerms: selectedTerms.concat([term])
      })
    }
  }

  removeSearchTerm = (term) => {
    const { selectedTerms } = this.state

    const alreadyAdded = selectedTerms.some(selectedTerm => selectedTerm.term_id === term.term_id)

    if (alreadyAdded) {
      this.setState({
        selectedTerms: selectedTerms.filter(selectedTerm => selectedTerm.term_id !== term.term_id)
      })
    }
  }

  handleSearchKeydown = (e) => {
    const { matchedTerms } = this.props
    const { searchValue, selectedTerms, highlightedTermIndex } = this.state

    if (e.key === 'Backspace' && searchValue === '' && selectedTerms.length) {
      this.setState({
        selectedTerms: selectedTerms.slice(0, selectedTerms.length - 1)
      })
    } else if (e.key === 'Enter' && e.shiftKey) {
      this.wrappedPerformQuery()
    } else if (e.key === 'Enter') {
      const nonSelectedTerms = matchedTerms.filter(term => !selectedTerms.includes(term))
      const highlightedTerm = nonSelectedTerms[highlightedTermIndex]

      if (highlightedTerm) {
        this.setState({
          selectedTerms: selectedTerms.concat([highlightedTerm]),
          searchValue: ''
        })

        if (highlightedTermIndex === nonSelectedTerms.length - 1) {
          this.setState({
            highlightedTermIndex: highlightedTermIndex - 1
          })
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      this.highlightNextTerm()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      this.highlightPreviousTerm()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      this.highlightNextTerm()
    }
  }

  renderSelectedLabel = (searchTerm) => {
    return (
      <Label key={searchTerm.term_id} className='selected search-term' onClick={() => this.removeSearchTerm(searchTerm)}>
        {searchTerm.name}
        <Icon name='delete' />
      </Label>
    )
  }

  highlightPreviousTerm = () => {
    const { highlightedTermIndex } = this.state

    if (highlightedTermIndex) {
      this.setState({
        highlightedTermIndex: highlightedTermIndex - 1
      })
    }
  }

  highlightNextTerm = () => {
    const { matchedTerms } = this.props
    const { highlightedTermIndex, selectedTerms } = this.state

    const filteredTerms = matchedTerms.filter(term => !selectedTerms.includes(term))

    if (!((highlightedTermIndex + 1) > (filteredTerms.length - 1))) {
      this.setState({
        highlightedTermIndex: highlightedTermIndex + 1
      })
    }
  }

  wrappedPerformQuery = () => {
    const { performQuery, handleOverlayClose } = this.props
    const { selectedTerms, searchValue } = this.state

    const options = {
      'm_style': selectedTerms.filter(term => term.taxonomy === 'm_style').map(term => term.term_id),
      'm_artist': selectedTerms.filter(term => term.taxonomy === 'm_artist').map(term => term.term_id),
      'search': searchValue
    }

    handleOverlayClose()
    performQuery(options)
  }

  render() {
    const { visible, performSearch, matchedTerms } = this.props
    const { searchValue, selectedTerms, highlightedTermIndex } = this.state

    const debouncedPerformSearch = debounce(performSearch, 200)
    const setSearchValue = (e) => {
      let currentSearchValue = e.target.value
      debouncedPerformSearch(currentSearchValue)

      this.setState({
        searchValue: currentSearchValue,
        highlightedTermIndex: 0
      })
    }

    return (
      <Modal
        open={visible}
        basic
        dimmer='inverted'
        size='large'
        className='search-modal'
      >
        <Modal.Content>
          {selectedTerms.map(this.renderSelectedLabel)}
          <Input
            transparent
            placeholder='Search..'
            ref={this.searchInput}
            onChange={setSearchValue}
            onKeyDown={this.handleSearchKeydown}
            value={searchValue}
            icon='search'
            className='search-input'
          />
        </Modal.Content>
        <Modal.Actions>
          <div className='shortcuts'>
            <Label>
              Previous Item: Left Arrow
            </Label>
            <Label>
              Next Item: Tab / Right Arrow
            </Label>
            <Label>
              Add Item: Enter
            </Label>
            <Label>
              Perform Search: Shift + Enter
            </Label>
          </div>
          <Button color='red' onClick={this.wrappedPerformQuery} inverted>
            <Icon name='search' /> Search
          </Button>
        </Modal.Actions>
        <SearchTags
          matchedTerms={matchedTerms}
          selectedTerms={selectedTerms}
          addSearchTerm={this.addSearchTerm}
          removeSearchTerm={this.removeSearchTerm}
          highlightedTermIndex={highlightedTermIndex}
        />
      </Modal>
    )
  }
}

const Wrapper = (props) => (
  <AlbumConsumer>
    {({performQuery}) => (
      <SearchTermConsumer>
        {({matchedTerms, performSearch}) => (
          <SearchOverlay
            {...props}
            performQuery={performQuery}
            matchedTerms={matchedTerms}
            performSearch={performSearch}
          />
        )}
      </SearchTermConsumer>
    )}
  </AlbumConsumer>
)

export default Wrapper
