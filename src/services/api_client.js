import { create } from 'apisauce'

const API_BASE_URL = "http://dojin.co"
const DEFAULT_HEADERS = {
  'Accept': 'application/json'
}

class APIClient {
  constructor(api) {
    this.api = api
  }

  setHeaders(headers) {
    this.api = create({
      baseURL: API_BASE_URL,
      headers: headers
    })
  }

  setToken(token) {
    if (token) {
      this.setHeaders({
        'Authorization': `Bearer ${token}`,
        ...DEFAULT_HEADERS
      })
    } else {
      this.setHeaders(DEFAULT_HEADERS)
    }
  }

  get() { return this.api.get.apply(this, arguments) }
  delete() { return this.api.delete.apply(this, arguments) }
  head() { return this.api.head.apply(this, arguments) }
  post() { return this.api.post.apply(this, arguments) }
  put() { return this.api.put.apply(this, arguments) }
  patch() { return this.api.patch.apply(this, arguments) }
}


const API = create({
  baseURL: API_BASE_URL
})

const SINGLETON_API_CLIENT = new APIClient(API)

window.api_client = SINGLETON_API_CLIENT

export default SINGLETON_API_CLIENT
