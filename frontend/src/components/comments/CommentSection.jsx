import { useState, useEffect, useCallback } from 'react'
import { FiMessageSquare, FiTrash2, FiCornerDownRight } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import commentService from '../../services/commentService'
import { timeAgo, getInitials } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function CommentSection({ resourceId }) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = useCallback(async () => {
    try {
      const res = await commentService.getByResource(resourceId)
      setComments(res.data.data || [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [resourceId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      await commentService.create(resourceId, newComment.trim(), replyTo)
      setNewComment('')
      setReplyTo(null)
      fetchComments()
      toast.success('Comment added!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return
    try {
      await commentService.delete(commentId)
      fetchComments()
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  const renderComment = (comment, depth = 0) => (
    <div
      key={comment.id}
      className={`${depth > 0 ? 'ml-8 border-l border-hax-border/50 pl-4' : ''}`}
    >
      <div className="flex items-start gap-3 py-3">
        <div className="w-8 h-8 rounded-full bg-hax-accent/10 flex items-center justify-center text-xs font-medium text-hax-accent flex-shrink-0">
          {getInitials(comment.user_name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-200">{comment.user_name}</span>
            <span className="text-xs text-gray-600">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{comment.comment}</p>

          <div className="flex items-center gap-3 mt-2">
            {isAuthenticated && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-xs text-gray-500 hover:text-hax-accent flex items-center gap-1 transition-colors"
              >
                <FiCornerDownRight className="w-3 h-3" /> Reply
              </button>
            )}
            {user && (user.id === comment.user_id || user.role === 'admin') && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <FiTrash2 className="w-3 h-3" /> Delete
              </button>
            )}
          </div>

          {replyTo === comment.id && (
            <form onSubmit={handleSubmit} className="mt-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Reply to ${comment.user_name}...`}
                className="input-field text-sm"
              />
            </form>
          )}
        </div>
      </div>

      {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
    </div>
  )

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2 mb-4">
        <FiMessageSquare className="w-5 h-5 text-hax-accent" />
        Comments ({comments.length})
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={replyTo ? '' : newComment}
            onChange={(e) => {
              setReplyTo(null)
              setNewComment(e.target.value)
            }}
            placeholder="Share your thoughts..."
            rows="3"
            className="input-field resize-none text-sm"
          />
          <div className="flex justify-end mt-2">
            <button type="submit" disabled={submitting || !newComment.trim()} className="btn-primary text-sm disabled:opacity-50">
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 card mb-6">
          <p className="text-gray-500 text-sm">
            <a href="/login" className="text-hax-accent hover:underline">Login</a> to join the discussion.
          </p>
        </div>
      )}

      <div className="divide-y divide-hax-border/30">
        {loading ? (
          <div className="text-center py-8 text-gray-500 text-sm">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">No comments yet. Be the first!</div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  )
}
