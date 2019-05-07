import he from 'he'
import get from 'lodash.get'
import flatMap from 'array.prototype.flatmap'

import { parse } from 'date-fns'

import PlaceholderImage from '../assets/placeholder-image.png'

const formatAlbum = (album) => {
  const { vote_total, likes, top_right_text } = album
  const term_collections = get(album, ["_embedded", "wp:term"])

  const artists = flatMap(term_collections, (term_collection) => {
    return term_collection.filter((term) => {
      return term["taxonomy"] === "m_artist"
    })
  })

  const styles = flatMap(term_collections, (term_collection) => {
    return term_collection.filter((term) => {
      return term["taxonomy"] === "m_style"
    })
  })

  const genres = styles.map((style) => { return style["name"] })

  const comments = get(album, '_embedded.replies[0]', [])

  return {
    id: album.id,
    album_name: he.decode(get(album, 'title.rendered', '')),
    album_art_url: get(album, '_embedded.wp:featuredmedia[0].source_url', PlaceholderImage),
    sample_url: album.sample,
    download_url: album.download,
    comments,
    artists,
    genres,
    vote_total,
    likes,
    top_right_text,
    created_at: parse(album.date),
    updated_at: parse(album.modified)
  }
}

export default formatAlbum
