import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import SEOHead from '../components/common/SEOHead'
import ResourceGrid from '../components/resources/ResourceGrid'
import FilterBar from '../components/resources/FilterBar'
import Pagination from '../components/common/Pagination'
import resourceService from '../services/resourceService'

export default function Category() {
  const { slug } = useParams()
  const [resources, setResources] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ sort: 'popular' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [resData, catData] = await Promise.all([
          resourceService.getByCategory(slug, { ...filters, page, limit: 18 }),
          resourceService.getCategories(),
        ])
        setResources(resData.data.data || [])
        setTotalPages(resData.data.pagination?.total_pages || 1)
        setCategories(catData.data.data || [])
        const cat = catData.data.data?.find((c) => c.slug === slug)
        setCategoryName(cat?.name || slug)
      } catch {
        setResources([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug, filters, page])

  return (
    <>
      <SEOHead
        title={categoryName}
        description={`Browse ${categoryName} resources - Curated digital tools and resources powered by FMHY`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-hax-accent transition-colors">Home</Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-300">{categoryName}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-100 mb-2">{categoryName}</h1>
        <p className="text-gray-500 mb-6">Browse curated {categoryName.toLowerCase()} resources</p>

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
