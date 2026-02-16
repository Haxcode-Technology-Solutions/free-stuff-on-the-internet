import api from './api'

const resourceService = {
  getAll(params = {}) {
    return api.get('/resources', { params })
  },

  getBySlug(slug) {
    return api.get(`/resources/${slug}`)
  },

  search(query, params = {}) {
    return api.get('/resources/search', { params: { q: query, ...params } })
  },

  getCategories() {
    return api.get('/categories')
  },

  getByCategory(slug, params = {}) {
    return api.get(`/categories/${slug}/resources`, { params })
  },

  getPopular(limit = 10) {
    return api.get('/resources', { params: { sort: 'popular', limit } })
  },

  getTrending(limit = 10) {
    return api.get('/resources', { params: { sort: 'trending', limit } })
  },

  getRecent(limit = 10) {
    return api.get('/resources', { params: { sort: 'newest', limit } })
  },

  getRelated(slug, limit = 5) {
    return api.get(`/resources/${slug}/related`, { params: { limit } })
  },

  // Admin methods
  create(data) {
    return api.post('/admin/resources', data)
  },

  update(id, data) {
    return api.put(`/admin/resources/${id}`, data)
  },

  delete(id) {
    return api.delete(`/admin/resources/${id}`)
  },
}

export default resourceService
