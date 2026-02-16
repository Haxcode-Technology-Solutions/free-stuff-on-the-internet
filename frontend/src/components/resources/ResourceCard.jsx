import { Link } from 'react-router-dom'
import { FiExternalLink, FiBookmark, FiEye, FiTrendingUp } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { truncate, formatNumber } from '../../utils/helpers'
import BookmarkButton from '../bookmarks/BookmarkButton'

export default function ResourceCard({ resource }) {
  const { isAuthenticated } = useAuth()
  const tags = resource.tags ? resource.tags.split(',').map((t) => t.trim()) : []

  return (
    <div className="card group animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge">{resource.category}</span>
            {resource.is_free !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${resource.is_free ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                {resource.is_free ? 'Free' : 'Paid'}
              </span>
            )}
          </div>

          <Link
            to={`/resource/${resource.slug}`}
            className="text-lg font-semibold text-gray-100 hover:text-hax-accent transition-colors line-clamp-1"
          >
            {resource.title}
          </Link>

          <p className="text-gray-500 text-sm mt-1.5 line-clamp-2">
            {truncate(resource.description, 120)}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded bg-hax-border/50 text-gray-400"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="text-xs text-gray-600">+{tags.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {isAuthenticated && (
          <BookmarkButton resourceId={resource.id} size="sm" />
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-hax-border/50">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FiTrendingUp className="w-3 h-3" />
            {formatNumber(resource.popularity_score || 0)}
          </span>
          <span className="flex items-center gap-1">
            <FiEye className="w-3 h-3" />
            {formatNumber(resource.view_count || 0)}
          </span>
        </div>

        <Link
          to={`/resource/${resource.slug}`}
          className="flex items-center gap-1 text-sm text-hax-accent hover:underline"
        >
          View <FiExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
