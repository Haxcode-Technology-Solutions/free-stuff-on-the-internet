import { Link } from 'react-router-dom'
import { FiGithub, FiMail, FiHeart } from 'react-icons/fi'
import NewsletterForm from '../newsletter/NewsletterForm'

export default function Footer() {
  return (
    <footer className="border-t border-hax-border bg-hax-darker mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-hax-accent/20 flex items-center justify-center border border-hax-accent/30">
                <span className="text-hax-accent font-bold text-sm font-mono">&lt;/&gt;</span>
              </div>
              <span className="font-bold gradient-text">Haxcode</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Curated Digital Resources Powered by FMHY. Your gateway to the best free tools and resources on the internet.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-3 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/category/tools" className="text-gray-500 hover:text-hax-accent text-sm transition-colors">Tools</Link></li>
              <li><Link to="/category/software" className="text-gray-500 hover:text-hax-accent text-sm transition-colors">Software</Link></li>
              <li><Link to="/category/education" className="text-gray-500 hover:text-hax-accent text-sm transition-colors">Education</Link></li>
              <li><Link to="/category/media" className="text-gray-500 hover:text-hax-accent text-sm transition-colors">Media</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-3 text-sm uppercase tracking-wider">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-500 hover:text-hax-accent text-sm transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-gray-500 hover:text-hax-accent text-sm transition-colors">Register</Link></li>
              <li><Link to="/bookmarks" className="text-gray-500 hover:text-hax-accent text-sm transition-colors">Bookmarks</Link></li>
              <li><Link to="/profile" className="text-gray-500 hover:text-hax-accent text-sm transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-3 text-sm uppercase tracking-wider">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-3">Get curated resources delivered to your inbox.</p>
            <NewsletterForm compact />
          </div>
        </div>

        <div className="border-t border-hax-border mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs text-center sm:text-left">
              This platform utilizes FMHY services and backend data. We do not host content directly.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:contact@haxcode.com" className="text-gray-500 hover:text-hax-accent transition-colors" aria-label="Email">
                <FiMail className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-hax-accent transition-colors" aria-label="GitHub">
                <FiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>
          <p className="text-center text-gray-700 text-xs mt-4 flex items-center justify-center gap-1">
            Made with <FiHeart className="w-3 h-3 text-red-500" /> by Haxcode Technology Solutions
          </p>
        </div>
      </div>
    </footer>
  )
}
