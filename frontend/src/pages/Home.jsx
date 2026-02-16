import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiSearch, FiZap, FiTrendingUp, FiClock } from 'react-icons/fi'
import SEOHead from '../components/common/SEOHead'
import ResourceGrid from '../components/resources/ResourceGrid'
import CategoryGrid from '../components/resources/CategoryGrid'
import NewsletterForm from '../components/newsletter/NewsletterForm'
import resourceService from '../services/resourceService'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [popular, setPopular] = useState([])
  const [trending, setTrending] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, popRes, trendRes, recentRes] = await Promise.all([
          resourceService.getCategories(),
          resourceService.getPopular(6),
          resourceService.getTrending(6),
          resourceService.getRecent(6),
        ])
        setCategories(catRes.data.data || [])
        setPopular(popRes.data.data || [])
        setTrending(trendRes.data.data || [])
        setRecent(recentRes.data.data || [])
      } catch {
        // handle error silently
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Haxcode Technology Solutions',
    description: 'Curated Digital Resources Powered by FMHY',
    potentialAction: {
      '@type': 'SearchAction',
      target: '/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <SEOHead
        title="Home"
        description="Curated Digital Resources Powered by FMHY - Your gateway to the best free tools and resources on the internet."
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-hax-accent/5 via-transparent to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-hax-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-hax-purple/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-hax-accent/20 bg-hax-accent/5 text-sm text-hax-accent mb-6">
            <FiZap className="w-4 h-4" />
            Powered by FMHY Data
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            <span className="gradient-text">Curated Digital Resources</span>
            <br />
            <span className="text-gray-300">for the Modern Web</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Discover the best free tools, software, education resources, and more.
            Carefully curated and organized for developers, creators, and enthusiasts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link to="/search" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
              <FiSearch className="w-5 h-5" /> Explore Resources
            </Link>
            <Link to="/register" className="btn-secondary text-base px-8 py-3">
              Create Account <FiArrowRight className="inline w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 text-center">
            <div>
              <div className="text-2xl font-bold text-hax-accent">1000+</div>
              <div className="text-xs text-gray-500 mt-1">Resources</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hax-accent">50+</div>
              <div className="text-xs text-gray-500 mt-1">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hax-accent">Free</div>
              <div className="text-xs text-gray-500 mt-1">Forever</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Categories */}
        <CategoryGrid categories={categories} />

        {/* Popular */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-hax-accent" />
              <h2 className="text-2xl font-bold text-gray-100">Popular Resources</h2>
            </div>
            <Link to="/search?sort=popular" className="text-sm text-hax-accent hover:underline flex items-center gap-1">
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResourceGrid resources={popular} loading={loading} />
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FiZap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-2xl font-bold text-gray-100">Trending Now</h2>
            </div>
            <Link to="/search?sort=trending" className="text-sm text-hax-accent hover:underline flex items-center gap-1">
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResourceGrid resources={trending} loading={loading} />
        </section>

        {/* Recently Added */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FiClock className="w-5 h-5 text-hax-blue" />
              <h2 className="text-2xl font-bold text-gray-100">Recently Added</h2>
            </div>
            <Link to="/search?sort=newest" className="text-sm text-hax-accent hover:underline flex items-center gap-1">
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResourceGrid resources={recent} loading={loading} />
        </section>

        {/* Newsletter CTA */}
        <section className="card max-w-xl mx-auto text-center p-8">
          <h2 className="text-xl font-bold text-gray-100 mb-2">Stay Updated</h2>
          <p className="text-gray-400 text-sm mb-6">
            Get the best curated resources delivered straight to your inbox.
          </p>
          <NewsletterForm />
        </section>
      </div>
    </>
  )
}
