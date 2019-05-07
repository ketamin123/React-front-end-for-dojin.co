import Lockr from 'lockr'

const getAuthToken = () => {
  return (Lockr.get('DOJIN_TOKEN') || '')
}

const setAuthToken = (token) => {
  Lockr.set('DOJIN_TOKEN', token)
}

const getFromLocalStorage = (key, defaultValue) => {
  return (Lockr.get(key) || defaultValue)
}

const setToLocalStorage = (key, value) => {
  return Lockr.set(key, value)
}

export {
  getAuthToken,
  setAuthToken,
  getFromLocalStorage,
  setToLocalStorage,
}
