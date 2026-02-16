import { useState, useEffect } from 'react'
import { FiTrash2, FiCheck } from 'react-icons/fi'
import SEOHead from '../../components/common/SEOHead'
import Pagination from '../../components/common/Pagination'
import commentService from '../../services/commentService'
import { timeAgo, truncate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchComments = async () => {
    setLoading(true)
    try {
      const res = await commentService.getAll({ page, limit: 20 })
      setComments(res.data.data || [])
      setTotalPages(res.data.pagination?.total_pages || 1)
    } catch {
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchComments() }, [page])

  const handleModerate = async (id, action) => {
    try {
      await commentService.moderate(id, action)
      toast.success(action === 'delete' ? 'Comment deleted' : 'Comment approved')
      fetchComments()
    } catch {
      toast.error('Action failed')
    }
  }

  return (
    <>
      <SEOHead title="Moderate Comments" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Moderate Comments</h1>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No comments to moderate</div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="card p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-200">{c.user_name}</span>
                    <span className="text-gray-600">on</span>
                    <span className="text-hax-accent">{c.resource_title}</span>
                    <span className="text-gray-600">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{truncate(c.comment, 200)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleModerate(c.id, 'approve')}
                    className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
                    title="Approve"
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleModerate(c.id, 'delete')}
                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  )
}
