import { useState } from 'react'
import { FiUser, FiMail, FiCalendar, FiEdit2 } from 'react-icons/fi'
import SEOHead from '../components/common/SEOHead'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/helpers'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, fetchUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/auth/profile', { name })
      await fetchUser()
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead title="Profile" />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-100 mb-8">My Profile</h1>

        <div className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-hax-accent/20 flex items-center justify-center border-2 border-hax-accent/30">
              <FiUser className="w-8 h-8 text-hax-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-100">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <FiUser className="w-4 h-4" />
                <span className="text-sm">{user?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FiMail className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FiCalendar className="w-4 h-4" />
                <span className="text-sm">Joined {formatDate(user?.created_at)}</span>
              </div>
              <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2 text-sm mt-4">
                <FiEdit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
