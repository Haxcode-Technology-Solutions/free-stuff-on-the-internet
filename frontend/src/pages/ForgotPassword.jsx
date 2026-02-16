import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import SEOHead from '../components/common/SEOHead'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead title="Forgot Password" />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <FiMail className="w-12 h-12 text-hax-accent mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-100 mb-2">Check Your Email</h1>
              <p className="text-gray-400 mb-6">
                If an account exists for <span className="text-hax-accent">{email}</span>, you'll receive a password reset link.
              </p>
              <Link to="/login" className="btn-secondary inline-flex items-center gap-2">
                <FiArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-100">Forgot Password?</h1>
                <p className="text-gray-500 text-sm mt-1">We'll send you a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                <Link to="/login" className="text-hax-accent hover:underline flex items-center justify-center gap-1">
                  <FiArrowLeft className="w-3 h-3" /> Back to Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
