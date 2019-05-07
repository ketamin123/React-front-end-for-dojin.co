import React from 'react'
import sanitizeHtml from 'sanitize-html'
import { parse as dateParse, distanceInWords } from 'date-fns'
import { List } from 'semantic-ui-react'

const Comment = (props) => {
  const cleanCommentHTML = sanitizeHtml(props.comment.content.rendered, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p'],
  });

  const current = new Date()
  const formattedDate = distanceInWords(props.comment.date, current)

  return (
    <List.Item>
      <div className='comment'>
        <span className='avatar'>
          <img src={props.comment.author_avatar_urls['96']} alt={props.comment.author_name}/>
        </span>
        <div className='content'>
          <span className='author'>{props.comment.author_name}</span>
          <div className='metadata'>
            <div className='date'>{formattedDate} ago</div>
          </div>
          <div
            className='text'
            dangerouslySetInnerHTML={{__html: cleanCommentHTML}}
          />
        </div>
</div>
    </List.Item>
  )
}

class CommentList extends React.Component {
  constructor(props) {
    super(props)

    this.commentList = React.createRef()
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props
    const el = this.commentList.current

    if (visible && !prevProps.visible) {
      el.scrollTop = el.scrollHeight;
    }
  }

  render() {
    return (
      <div className='comments-container' ref={this.commentList}>
        <List relaxed='very' divided className='comments'>
          {
            this.props.comments.map((comment) => {
              return {
                ...comment,
                date: dateParse(comment.date)
              }
            })
            .sort((a, b) => a.date - b.date)
            .map((comment) => {
              return (
                <Comment comment={comment} key={comment.id}/>
              )
            })
          }
        </List>
      </div>
    )
  }
}


export default CommentList
