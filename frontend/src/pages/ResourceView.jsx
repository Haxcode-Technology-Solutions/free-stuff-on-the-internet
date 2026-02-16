import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiChevronRight, FiExternalLink, FiCalendar, FiEye, FiTrendingUp, FiShare2 } from 'react-icons/fi'
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share'
import SEOHead from '../components/common/SEOHead'
import CommentSection from '../components/comments/CommentSection'
import BookmarkButton from '../components/bookmarks/BookmarkButton'
import ResourceGrid from '../components/resources/ResourceGrid'
import LoadingSpinner from '../components/common/LoadingSpinner'
import NewsletterForm from '../components/newsletter/NewsletterForm'
import { useAuth } from '../context/AuthContext'
import resourceService from '../services/resourceService'
import { formatDate, formatNumber } from '../utils/helpers'

export default function ResourceView() {
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()
  const [resource, setResource] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [resData, relData] = await Promise.all([
          resourceService.getBySlug(slug),
          resourceService.getRelated(slug),
        ])
        setResource(resData.data.data)
        setRelated(relData.data.data || [])
      } catch {
        setResource(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) return <LoadingSpinner />

  if (!resource) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-300 mb-2">Resource Not Found</h1>
        <p className="text-gray-500 mb-4">The resource you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    )
  }

  const tags = resource.tags ? resource.tags.split(',').map((t) => t.trim()) : []
  const shareUrl = window.location.href

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: resource.title,
    description: resource.description,
    applicationCategory: resource.category,
    offers: {
      '@type': 'Offer',
      price: resource.is_free ? '0' : undefined,
      priceCurrency: 'USD',
    },
  }

  return (
    <>
      <SEOHead
        title={resource.title}
        description={resource.description}
        url={shareUrl}
        type="article"
        jsonLd={jsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-hax-accent transition-colors">Home</Link>
          <FiChevronRight className="w-3 h-3" />
          <Link to={`/category/${resource.category_slug || resource.category?.toLowerCase()}`} className="hover:text-hax-accent transition-colors">
            {resource.category}
          </Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-300">{resource.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge">{resource.category}</span>
                    {resource.is_free !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${resource.is_free ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                        {resource.is_free ? 'Free' : 'Paid'}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">{resource.title}</h1>
                </div>
                {isAuthenticated && <BookmarkButton resourceId={resource.id} />}
              </div>

              <p className="text-gray-400 leading-relaxed mb-6">{resource.description}</p>

              {/* Meta Info */}
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="w-4 h-4" />
                  {formatDate(resource.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiTrendingUp className="w-4 h-4" />
                  Popularity: {formatNumber(resource.popularity_score || 0)}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiEye className="w-4 h-4" />
                  {formatNumber(resource.view_count || 0)} views
                </span>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/search?tags=${encodeURIComponent(tag)}`}
                      className="text-sm px-3 py-1 rounded-lg bg-hax-border/50 text-gray-400 hover:text-hax-accent hover:border-hax-accent/30 border border-transparent transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Visit Button */}
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <FiExternalLink className="w-4 h-4" /> Visit Resource
                </a>
              )}

              {/* Share */}
              <div className="mt-6 pt-6 border-t border-hax-border/50">
                <div className="flex items-center gap-3">
                  <FiShare2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Share:</span>
                  <div className="flex gap-2">
                    <FacebookShareButton url={shareUrl}>
                      <FacebookIcon size={28} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={resource.title}>
                      <TwitterIcon size={28} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl} title={resource.title}>
                      <LinkedinIcon size={28} round />
                    </LinkedinShareButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <CommentSection resourceId={resource.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Newsletter */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-200 mb-3">Stay Updated</h3>
              <p className="text-sm text-gray-500 mb-4">Get resources like this in your inbox.</p>
              <NewsletterForm compact />
            </div>

            {/* Related Resources */}
            {related.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-200 mb-4">Related Resources</h3>
                <div className="space-y-3">
                  {related.map((item) => (
                    <Link
                      key={item.id}
                      to={`/resource/${item.slug}`}
                      className="block p-3 rounded-lg hover:bg-hax-border/30 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-300 hover:text-hax-accent">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.category}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
