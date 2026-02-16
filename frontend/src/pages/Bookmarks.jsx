import { useState, useEffect } from 'react'
import { FiBookmark } from 'react-icons/fi'
import SEOHead from '../components/common/SEOHead'
import ResourceGrid from '../components/resources/ResourceGrid'
import bookmarkService from '../services/bookmarkService'

export default function Bookmarks() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await bookmarkService.getAll()
        setResources(res.data.data || [])
      } catch {
        setResources([])
      } finally {
        setLoading(false)
      }
    }
    fetchBookmarks()
  }, [])

  return (
    <>
      <SEOHead title="My Bookmarks" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <FiBookmark className="w-6 h-6 text-hax-accent" />
          <h1 className="text-2xl font-bold text-gray-100">My Bookmarks</h1>
          <span className="text-sm text-gray-500">({resources.length})</span>
        </div>

        <ResourceGrid
          resources={resources}
          loading={loading}
        />

        {!loading && resources.length === 0 && (
          <div className="text-center py-16">
            <FiBookmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-400 mb-2">No bookmarks yet</h2>
            <p className="text-gray-500 text-sm">
              Start bookmarking resources you want to save for later.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
