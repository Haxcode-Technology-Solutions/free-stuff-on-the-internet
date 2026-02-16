import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi'
import SEOHead from '../components/common/SEOHead'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
      setSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <SEOHead title="Check Your Email" />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-hax-accent/20 flex items-center justify-center mx-auto mb-4">
              <FiMail className="w-8 h-8 text-hax-accent" />
            </div>
            <h1 className="text-2xl font-bold text-gray-100 mb-2">Check Your Email</h1>
            <p className="text-gray-400">
              We've sent a verification link to <span className="text-hax-accent">{email}</span>.
              Please click the link to activate your account.
            </p>
            <Link to="/login" className="btn-secondary mt-6 inline-block">
              Go to Login
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHead title="Register" />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-hax-accent/20 flex items-center justify-center mx-auto mb-4 border border-hax-accent/30">
              <FiUserPlus className="w-6 h-6 text-hax-accent" />
            </div>
            <h1 className="text-2xl font-bold text-gray-100">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join the community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Min. 8 characters"
                  minLength="8"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Repeat your password"
                  minLength="8"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-hax-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  )
}
