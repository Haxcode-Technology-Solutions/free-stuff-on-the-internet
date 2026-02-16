import { Link } from 'react-router-dom'
import { FiFolder, FiArrowRight } from 'react-icons/fi'

const CATEGORY_ICONS = {
  tools: '🛠️',
  software: '💻',
  education: '📚',
  media: '🎬',
  privacy: '🔒',
  gaming: '🎮',
  development: '👨‍💻',
  android: '📱',
  linux: '🐧',
  storage: '☁️',
  ai: '🤖',
  misc: '📦',
}

export default function CategoryGrid({ categories }) {
  if (!categories || categories.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Categories</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="card text-center group p-4"
          >
            <div className="text-3xl mb-2">
              {CATEGORY_ICONS[cat.slug] || <FiFolder className="w-8 h-8 mx-auto text-hax-accent" />}
            </div>
            <h3 className="font-medium text-sm text-gray-200 group-hover:text-hax-accent transition-colors">
              {cat.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{cat.resource_count || 0} resources</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
