import { useState } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'updated', label: 'Recently Updated' },
]

const PRICE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
]

export default function FilterBar({ filters, onFilterChange, categories = [] }) {
  const [showFilters, setShowFilters] = useState(false)

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filters.sort || 'popular'}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="input-field w-auto text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-ghost text-sm flex items-center gap-1.5 ${showFilters ? 'text-hax-accent' : ''}`}
        >
          <FiFilter className="w-4 h-4" />
          Filters
        </button>

        {(filters.category || filters.price) && (
          <button
            onClick={() => onFilterChange({ sort: filters.sort })}
            className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <FiX className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-3 p-4 card animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="input-field text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Price</label>
              <div className="flex gap-2">
                {PRICE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChange('price', opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      (filters.price || '') === opt.value
                        ? 'border-hax-accent text-hax-accent bg-hax-accent/10'
                        : 'border-hax-border text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Tags</label>
              <input
                type="text"
                placeholder="e.g. privacy, open-source"
                value={filters.tags || ''}
                onChange={(e) => handleChange('tags', e.target.value)}
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
