import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiDatabase, FiMessageSquare, FiUsers, FiBox, FiRefreshCw } from 'react-icons/fi'
import SEOHead from '../../components/common/SEOHead'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data.data)).catch(() => {})
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    try {
      await api.post('/admin/sync-fmhy')
      toast.success('FMHY sync started!')
    } catch {
      toast.error('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  const cards = [
    { label: 'Resources', value: stats?.resources || 0, icon: FiBox, href: '/admin/resources', color: 'text-hax-accent' },
    { label: 'Comments', value: stats?.comments || 0, icon: FiMessageSquare, href: '/admin/comments', color: 'text-yellow-400' },
    { label: 'Subscribers', value: stats?.subscribers || 0, icon: FiUsers, href: '/admin/subscribers', color: 'text-blue-400' },
    { label: 'Users', value: stats?.users || 0, icon: FiUsers, href: '#', color: 'text-purple-400' },
  ]

  return (
    <>
      <SEOHead title="Admin Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your platform</p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync FMHY Data'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <Link key={card.label} to={card.href} className="card p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-hax-border/50 ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-100">{card.value}</div>
                <div className="text-sm text-gray-500">{card.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/resources" className="btn-secondary text-sm">Manage Resources</Link>
            <Link to="/admin/comments" className="btn-secondary text-sm">Moderate Comments</Link>
            <Link to="/admin/subscribers" className="btn-secondary text-sm">View Subscribers</Link>
          </div>
        </div>
      </div>
    </>
  )
}
