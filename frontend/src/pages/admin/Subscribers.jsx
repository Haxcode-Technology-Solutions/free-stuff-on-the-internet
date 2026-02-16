import { useState, useEffect } from 'react'
import { FiDownload, FiTrash2 } from 'react-icons/fi'
import SEOHead from '../../components/common/SEOHead'
import Pagination from '../../components/common/Pagination'
import api from '../../services/api'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/subscribers', { params: { page, limit: 20 } })
      setSubscribers(res.data.data || [])
      setTotalPages(res.data.pagination?.total_pages || 1)
    } catch {
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSubscribers() }, [page])

  const handleExport = async () => {
    try {
      const res = await api.get('/admin/subscribers/export', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'subscribers.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('CSV exported!')
    } catch {
      toast.error('Export failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this subscriber?')) return
    try {
      await api.delete(`/admin/subscribers/${id}`)
      toast.success('Subscriber removed')
      fetchSubscribers()
    } catch {
      toast.error('Failed to remove')
    }
  }

  return (
    <>
      <SEOHead title="Newsletter Subscribers" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Newsletter Subscribers</h1>
          <button onClick={handleExport} className="btn-secondary text-sm flex items-center gap-2">
            <FiDownload className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hax-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Frequency</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : subscribers.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No subscribers</td></tr>
                ) : (
                  subscribers.map((s) => (
                    <tr key={s.id} className="border-b border-hax-border/50 hover:bg-hax-border/20">
                      <td className="px-4 py-3 text-sm text-gray-200">{s.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-400 capitalize">{s.frequency}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.is_verified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {s.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(s.created_at)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  )
}
