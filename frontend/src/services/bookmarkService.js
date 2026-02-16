import api from './api'

const bookmarkService = {
  getAll() {
    return api.get('/bookmarks')
  },

  toggle(resourceId) {
    return api.post(`/bookmarks/${resourceId}`)
  },

  check(resourceId) {
    return api.get(`/bookmarks/${resourceId}/check`)
  },
}

export default bookmarkService
