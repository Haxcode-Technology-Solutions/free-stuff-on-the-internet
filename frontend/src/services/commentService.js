import api from './api'

const commentService = {
  getByResource(resourceId, params = {}) {
    return api.get(`/resources/${resourceId}/comments`, { params })
  },

  create(resourceId, comment, parentId = null) {
    return api.post(`/resources/${resourceId}/comments`, {
      comment,
      parent_id: parentId,
    })
  },

  delete(commentId) {
    return api.delete(`/comments/${commentId}`)
  },

  // Admin
  getAll(params = {}) {
    return api.get('/admin/comments', { params })
  },

  moderate(commentId, action) {
    return api.put(`/admin/comments/${commentId}`, { action })
  },
}

export default commentService
