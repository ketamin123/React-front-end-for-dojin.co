import React from 'react'
import { Label } from 'semantic-ui-react'

import './search_tags.css'

class SearchTags extends React.Component {
  renderLabel = (searchTerm, idx) => {
    const { addSearchTerm, highlightedTermIndex } = this.props

    return (
      <Label
        key={searchTerm.term_id}
        className={`search-term ${highlightedTermIndex === idx ? 'highlighted' : ''}`}
        onClick={() => addSearchTerm(searchTerm)}
      >
        {searchTerm.name}
      </Label>
    )
  }

  render() {
    const { matchedTerms, selectedTerms } = this.props

    return (
      <div className='search-tags'>
        <div className='suggested-search-tags'>
          {matchedTerms.filter(term => !selectedTerms.includes(term)).map(this.renderLabel)}
        </div>
      </div>
    )
  }
}

export default SearchTags
