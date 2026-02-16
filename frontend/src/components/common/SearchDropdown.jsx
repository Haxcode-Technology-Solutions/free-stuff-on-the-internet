import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import useDebounce from '../../hooks/useDebounce'
import resourceService from '../../services/resourceService'

export default function SearchDropdown({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const res = await resourceService.search(debouncedQuery, { limit: 6 })
        setResults(res.data.data || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  const handleSelect = (slug) => {
    navigate(`/resource/${slug}`)
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  return (
    <div className="border-t border-hax-border py-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search resources..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-10 pr-10"
        />
        <button type="button" onClick={onClose} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
          <FiX className="w-5 h-5" />
        </button>
      </form>

      {(results.length > 0 || loading) && (
        <div className="mt-3 space-y-1">
          {loading ? (
            <div className="text-center py-4 text-gray-500 text-sm">Searching...</div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.slug)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-hax-border/50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-200">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.category}</div>
              </button>
            ))
          )}
          {!loading && results.length > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full text-center py-2 text-sm text-hax-accent hover:underline"
            >
              View all results for "{query}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}
