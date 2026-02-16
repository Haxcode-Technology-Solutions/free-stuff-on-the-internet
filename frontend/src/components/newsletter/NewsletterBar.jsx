import { useState } from 'react'
import { FiX, FiMail } from 'react-icons/fi'
import newsletterService from '../../services/newsletterService'
import toast from 'react-hot-toast'

export default function NewsletterBar() {
  const [visible, setVisible] = useState(() => {
    return !sessionStorage.getItem('newsletter_bar_dismissed')
  })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  if (!visible) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await newsletterService.subscribe(email.trim())
      toast.success('Check your email to confirm subscription!')
      setEmail('')
      handleDismiss()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem('newsletter_bar_dismissed', '1')
    setVisible(false)
  }

  return (
    <div className="bg-gradient-to-r from-hax-accent/10 via-emerald-500/10 to-cyan-500/10 border-b border-hax-accent/20">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <FiMail className="w-4 h-4 text-hax-accent flex-shrink-0" />
          <span className="text-gray-300 hidden sm:inline">Get curated resources in your inbox</span>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="px-3 py-1 text-sm bg-hax-dark border border-hax-border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-hax-accent w-40 sm:w-52"
          />
          <button type="submit" disabled={loading} className="px-3 py-1 text-sm bg-hax-accent text-hax-dark font-medium rounded-lg hover:bg-hax-accent/90 transition-colors disabled:opacity-50">
            {loading ? '...' : 'Subscribe'}
          </button>
        </form>

        <button onClick={handleDismiss} className="text-gray-500 hover:text-gray-300 flex-shrink-0">
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
