import React from 'react'
import PropTypes from 'prop-types'

import isEqual from 'fast-deep-equal'

import ApiClient from '../../services/api_client.js'

/*
 * <Get options={}>
 * {({loading, error, data}) => (
 * )}
 * </Get>
 */

class Get extends React.Component {
  state = {
    loading: true,
    data: null,
    error: null
  }

  perform() {
    this.setState({
      loading: true
    })

    ApiClient.get(
      this.props.path,
      this.props.options
    ).then((response) => {
      if (response.ok) {
        this.setState({
          loading: false,
          data: response.data
        })
      } else {
        this.setState({
          loading: false,
          error: response.data || response.problem
        })
      }
    })
  }

  componentDidMount() {
    this.perform()
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.path !== this.props.path ||
      !isEqual(prevProps.options, this.props.options)
    ) {
      this.perform()
    }
  }

  render() {
    return this.props.children(this.state)
  }
}

Get.propTypes = {
  path: PropTypes.string.isRequired,
  options: PropTypes.object,
  children: PropTypes.func.isRequired
}

class Post extends React.Component {
  state = {
    loading: false,
    data: null,
    error: null
  }

  perform(options = {}) {
    this.setState({
      loading: true
    })

    return ApiClient.post(
      this.props.path,
      options
    ).then((response) => {
      if (response.ok) {
        this.setState({
          loading: false,
          data: response.data
        })
      } else {
        this.setState({
          loading: false,
          error: response.data || response.problem
        })
      }

      return Promise.resolve(response)
    })
  }

  render() {
    return this.props.children(this.perform.bind(this), this.state)
  }
}

Post.propTypes = {
  path: PropTypes.string.isRequired,
  options: PropTypes.object,
  children: PropTypes.func.isRequired
}

export {
  Get,
  Post
}
