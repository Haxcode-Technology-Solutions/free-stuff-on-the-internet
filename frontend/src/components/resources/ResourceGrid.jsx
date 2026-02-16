import ResourceCard from './ResourceCard'
import LoadingSpinner from '../common/LoadingSpinner'

export default function ResourceGrid({ resources, loading, title, subtitle }) {
  if (loading) return <LoadingSpinner />

  return (
    <section>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No resources found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </section>
  )
}
