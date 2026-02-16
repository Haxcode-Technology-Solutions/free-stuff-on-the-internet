import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import SEOHead from '../components/common/SEOHead'
import ResourceGrid from '../components/resources/ResourceGrid'
import FilterBar from '../components/resources/FilterBar'
import Pagination from '../components/common/Pagination'
import resourceService from '../services/resourceService'
import useDebounce from '../hooks/useDebounce'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [resources, setResources] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || 'popular',
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    resourceService.getCategories().then((res) => {
      setCategories(res.data.data || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        let res
        if (debouncedQuery) {
          res = await resourceService.search(debouncedQuery, { ...filters, page, limit: 18 })
        } else {
          res = await resourceService.getAll({ ...filters, page, limit: 18 })
        }
        setResources(res.data.data || [])
        setTotalPages(res.data.pagination?.total_pages || 1)
        setTotalResults(res.data.pagination?.total || 0)
      } catch {
        setResources([])
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [debouncedQuery, filters, page])

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (filters.sort && filters.sort !== 'popular') params.set('sort', filters.sort)
    setSearchParams(params, { replace: true })
  }, [query, filters.sort, setSearchParams])

  return (
    <>
      <SEOHead title={query ? `Search: ${query}` : 'Browse Resources'} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Input */}
        <div className="relative mb-8 max-w-2xl mx-auto">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            placeholder="Search for tools, software, resources..."
            className="input-field pl-12 py-3 text-lg"
            autoFocus
          />
        </div>

        {/* Results Count */}
        {(debouncedQuery || resources.length > 0) && (
          <p className="text-sm text-gray-500 mb-4">
            {totalResults} result{totalResults !== 1 ? 's' : ''}
            {debouncedQuery ? ` for "${debouncedQuery}"` : ''}
          </p>
        )}

        <FilterBar
          filters={filters}
          onFilterChange={(f) => { setFilters(f); setPage(1) }}
          categories={categories}
        />

        <ResourceGrid resources={resources} loading={loading} />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  )
}
