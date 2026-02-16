import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import SEOHead from '../components/common/SEOHead'
import api from '../services/api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Invalid verification link.')
        return
      }
      try {
        const res = await api.get(`/auth/verify-email?token=${token}`)
        setStatus('success')
        setMessage(res.data.message || 'Email verified successfully!')
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.')
      }
    }
    verify()
  }, [token])

  return (
    <>
      <SEOHead title="Verify Email" />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="card p-8 text-center">
          {status === 'loading' && (
            <div className="py-8">
              <div className="w-12 h-12 border-2 border-hax-border border-t-hax-accent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 mt-4">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <>
              <FiCheckCircle className="w-16 h-16 text-hax-accent mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-100 mb-2">Email Verified!</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <Link to="/login" className="btn-primary">Sign In</Link>
            </>
          )}

          {status === 'error' && (
            <>
              <FiXCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-100 mb-2">Verification Failed</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <Link to="/register" className="btn-secondary">Try Again</Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
