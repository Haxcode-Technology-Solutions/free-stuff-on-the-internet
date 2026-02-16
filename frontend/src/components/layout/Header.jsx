import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiMenu, FiX, FiSun, FiMoon, FiUser, FiBookmark, FiLogOut, FiShield } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import SearchDropdown from '../common/SearchDropdown'

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-hax-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-hax-accent/20 flex items-center justify-center border border-hax-accent/30 group-hover:bg-hax-accent/30 transition-colors">
              <span className="text-hax-accent font-bold text-sm font-mono">&lt;/&gt;</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg gradient-text">Haxcode</span>
              <span className="text-gray-400 text-xs block -mt-1">Technology Solutions</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="btn-ghost text-sm">Home</Link>
            <Link to="/category/tools" className="btn-ghost text-sm">Tools</Link>
            <Link to="/category/software" className="btn-ghost text-sm">Software</Link>
            <Link to="/category/education" className="btn-ghost text-sm">Education</Link>
            <Link to="/category/media" className="btn-ghost text-sm">Media</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="btn-ghost p-2"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="btn-ghost p-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 btn-ghost p-2"
                >
                  <div className="w-7 h-7 rounded-full bg-hax-accent/20 flex items-center justify-center border border-hax-accent/30">
                    <FiUser className="w-4 h-4 text-hax-accent" />
                  </div>
                  <span className="hidden sm:inline text-sm">{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 card p-2 shadow-xl">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-hax-border/50 text-sm transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiUser className="w-4 h-4" /> Profile
                    </Link>
                    <Link
                      to="/bookmarks"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-hax-border/50 text-sm transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiBookmark className="w-4 h-4" /> Bookmarks
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-hax-border/50 text-sm text-hax-accent transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FiShield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-hax-border" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-sm w-full transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-ghost p-2 md:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Dropdown */}
        {searchOpen && <SearchDropdown onClose={() => setSearchOpen(false)} />}

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-hax-border py-4 space-y-1 animate-fade-in">
            <Link to="/" className="block px-3 py-2 rounded-lg hover:bg-hax-border/50 text-sm" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/category/tools" className="block px-3 py-2 rounded-lg hover:bg-hax-border/50 text-sm" onClick={() => setMobileOpen(false)}>Tools</Link>
            <Link to="/category/software" className="block px-3 py-2 rounded-lg hover:bg-hax-border/50 text-sm" onClick={() => setMobileOpen(false)}>Software</Link>
            <Link to="/category/education" className="block px-3 py-2 rounded-lg hover:bg-hax-border/50 text-sm" onClick={() => setMobileOpen(false)}>Education</Link>
            <Link to="/category/media" className="block px-3 py-2 rounded-lg hover:bg-hax-border/50 text-sm" onClick={() => setMobileOpen(false)}>Media</Link>
          </nav>
        )}
      </div>
    </header>
  )
}
