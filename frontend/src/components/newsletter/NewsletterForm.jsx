import { useState } from 'react'
import newsletterService from '../../services/newsletterService'
import toast from 'react-hot-toast'

export default function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState('weekly')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await newsletterService.subscribe(email.trim(), frequency)
      toast.success('Check your email to confirm subscription!')
      setEmail('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed')
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="input-field text-sm flex-1"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary text-sm whitespace-nowrap disabled:opacity-50">
          {loading ? '...' : 'Join'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="input-field"
        required
      />
      <div className="flex gap-2">
        {['daily', 'weekly', 'trending'].map((freq) => (
          <button
            key={freq}
            type="button"
            onClick={() => setFrequency(freq)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              frequency === freq
                ? 'border-hax-accent text-hax-accent bg-hax-accent/10'
                : 'border-hax-border text-gray-400 hover:border-gray-500'
            }`}
          >
            {freq.charAt(0).toUpperCase() + freq.slice(1)}
          </button>
        ))}
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
      </button>
    </form>
  )
}
