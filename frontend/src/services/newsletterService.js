import api from './api'

const newsletterService = {
  subscribe(email, frequency = 'weekly') {
    return api.post('/newsletter/subscribe', { email, frequency })
  },

  unsubscribe(token) {
    return api.get(`/newsletter/unsubscribe/${token}`)
  },

  verify(token) {
    return api.get(`/newsletter/verify/${token}`)
  },
}

export default newsletterService
