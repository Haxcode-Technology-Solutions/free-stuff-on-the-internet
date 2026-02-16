import { useState, useEffect } from 'react'
import { FiBookmark } from 'react-icons/fi'
import bookmarkService from '../../services/bookmarkService'
import toast from 'react-hot-toast'

export default function BookmarkButton({ resourceId, size = 'md' }) {
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const res = await bookmarkService.check(resourceId)
        setBookmarked(res.data.bookmarked)
      } catch {
        // not logged in or error
      }
    }
    checkBookmark()
  }, [resourceId])

  const handleToggle = async () => {
    setLoading(true)
    try {
      const res = await bookmarkService.toggle(resourceId)
      setBookmarked(res.data.bookmarked)
      toast.success(res.data.bookmarked ? 'Bookmarked!' : 'Bookmark removed')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle bookmark')
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = size === 'sm' ? 'p-1.5' : 'p-2'
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${sizeClasses} rounded-lg transition-all duration-200 ${
        bookmarked
          ? 'text-hax-accent bg-hax-accent/10'
          : 'text-gray-500 hover:text-hax-accent hover:bg-hax-accent/5'
      }`}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
    >
      <FiBookmark className={`${iconSize} ${bookmarked ? 'fill-current' : ''}`} />
    </button>
  )
}
