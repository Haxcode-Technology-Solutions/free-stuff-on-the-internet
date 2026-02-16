import { Link } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'

export default function NotFound() {
  return (
    <>
      <SEOHead title="404 - Not Found" />
      <div className="max-w-md mx-auto px-4 py-32 text-center">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-200 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </>
  )
}
