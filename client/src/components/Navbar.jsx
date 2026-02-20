import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { formatCurrency } from '../utils/currency'

export default function Navbar() {
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [query,        setQuery]        = useState('')
  const [suggestions,  setSuggestions]  = useState([])
  const [searching,    setSearching]    = useState(false)
  const profileRef = useRef(null)
  const { cartCount } = useCart()
  const { wishlist } = useWishlist()
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const searchRef = useRef(null)
  const inputRef  = useRef(null)
  const debounce  = useRef(null)

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([])
        setSearchOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])


  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounce.current)
    if (!val.trim()) { setSuggestions([]); return }
    debounce.current = setTimeout(async () => {
      setSearching(true)
      try {
        const { data } = await api.get(`/products/list?search=${encodeURIComponent(val.trim())}&limit=6`)
        setSuggestions(data.products || [])
      } catch {
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 300)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSuggestions([])
    setSearchOpen(false)
    setQuery('')
    navigate(`/products?search=${encodeURIComponent(query.trim())}`)
  }

  const handleSuggestionClick = (product) => {
    setSuggestions([])
    setSearchOpen(false)
    setQuery('')
    navigate(`/products?search=${encodeURIComponent(product.name)}`)
  }

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const scrollTo = (id) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <i className="fa-solid fa-paw text-yellow-400 text-2xl md:text-3xl shrink-0" />
            <span className="font-bold text-xl md:text-2xl tracking-tight hidden sm:block">
              <span className="text-yellow-400">Foco</span>Pet
            </span>
          </Link>

          {/* Desktop Nav Links - only active tab in yellow */}
          <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-300">
            <Link to="/" className={`hover:text-yellow-400 transition-colors ${isActive('/') ? 'text-yellow-400' : ''}`}>Home</Link>
            <Link to="/products" className={`hover:text-yellow-400 transition-colors ${isActive('/products') ? 'text-yellow-400' : ''}`}>Products</Link>
            <button onClick={() => scrollTo('categories')} className="hover:text-yellow-400 transition-colors">Categories</button>
            {user && user.role !== 'admin' && (
              <>
                <Link to="/profile" className={`hover:text-yellow-400 transition-colors ${isActive('/profile') ? 'text-yellow-400' : ''}`}>My Pet</Link>
                <Link to="/prescriptions" className={`hover:text-yellow-400 transition-colors ${isActive('/prescriptions') ? 'text-yellow-400' : ''}`}>Prescriptions</Link>
              </>
            )}
            {user?.role === 'admin' && <Link to="/dashboard" className={`hover:text-yellow-400 transition-colors ${isActive('/dashboard') ? 'text-yellow-400' : ''}`}>Dashboard</Link>}
          </div>

          {/* Search bar (desktop) */}
          <div ref={searchRef} className="hidden md:flex items-center relative flex-1 max-w-xs">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search products..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </form>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {suggestions.map(p => (
                  <button key={p._id} onClick={() => handleSuggestionClick(p)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-base shrink-0">
                      {p.species === 'dog' ? '🐕' : p.species === 'cat' ? '🐈' : p.species === 'bird' ? '🐦' : p.species === 'rabbit' ? '🐇' : p.species === 'fish' ? '🐠' : '🐾'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800 truncate">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.category} · {formatCurrency(p.price)}</div>
                    </div>
                  </button>
                ))}
                <button onClick={() => { navigate(`/products?search=${encodeURIComponent(query)}`); setSuggestions([]); setQuery('') }}
                  className="w-full px-4 py-2.5 text-xs font-semibold text-yellow-600 hover:bg-yellow-50 transition text-center">
                  See all results for "{query}" →
                </button>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile search toggle */}
            <button onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false) }}
              className="md:hidden text-gray-400 hover:text-white transition p-1.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart - hidden for admin, links to checkout */}
            {user?.role !== 'admin' && (
              <Link to="/checkout" className={`relative transition-colors p-1.5 ${isActive('/checkout') ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[9px] font-black min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth buttons */}
            {user ? (
              <div ref={profileRef} className="hidden md:block relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 border border-gray-700 hover:border-gray-600 transition">
                  <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-black text-xs shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{user.name?.split(' ')[0]}</span>
                  <svg className={`w-3 h-3 text-gray-400 transition ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-left">
                    <div className="p-4 border-b border-gray-100">
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500 truncate">{user.email}</div>
                      <div className="text-xs text-gray-400 mt-1">{user.role === 'admin' ? 'Admin' : 'Pet Owner'}</div>
                    </div>
                    <div className="p-2">
                      {user.role !== 'admin' && (
                        <>
                          <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                            <span className="text-lg">🤍</span>
                            <span>My Wishlist</span>
                            {wishlist?.length > 0 && <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{wishlist.length}</span>}
                          </Link>
                          <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                            <span className="text-lg">📦</span>
                            <span>My Orders</span>
                          </Link>
                          <Link to="/checkout" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                            <span className="text-lg">🛒</span>
                            <span>Cart</span>
                            {cartCount > 0 && <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{cartCount}</span>}
                          </Link>
                        </>
                      )}
                      <button onClick={() => { setProfileOpen(false); handleLogout() }}
                        className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition mt-1">
                        <span className="text-lg">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"    className="text-sm font-semibold text-gray-400 hover:text-white transition px-3 py-1.5 rounded-full border border-gray-700 hover:border-gray-500">Sign In</Link>
                <Link to="/register" className="bg-yellow-400 text-gray-900 font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-yellow-300 transition shadow">Register</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button className="lg:hidden text-gray-300 hover:text-white p-1" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-3 border-t border-gray-700" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search products, categories..."
                className="w-full bg-gray-700 border border-gray-600 rounded-full pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
          {suggestions.length > 0 && (
            <div className="mt-2 bg-white rounded-xl overflow-hidden shadow-xl">
              {suggestions.map(p => (
                <button key={p._id} onClick={() => handleSuggestionClick(p)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left border-b border-gray-50 last:border-0">
                  <div className="text-lg shrink-0">
                    {p.species === 'dog' ? '🐕' : p.species === 'cat' ? '🐈' : p.species === 'bird' ? '🐦' : p.species === 'rabbit' ? '🐇' : p.species === 'fish' ? '🐠' : '🐾'}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800 truncate">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.category} · {formatCurrency(p.price)}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu - only active tab in yellow */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-800 border-t border-gray-700 px-4 pb-4 pt-2 flex flex-col gap-1">
          <Link to="/"             onClick={() => setMenuOpen(false)} className={`py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition ${isActive('/') ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}>🏠 Home</Link>
          <Link to="/products"     onClick={() => setMenuOpen(false)} className={`py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition ${isActive('/products') ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}>🛍️ Products</Link>
          <button onClick={() => { setMenuOpen(false); scrollTo('categories') }} className="py-2.5 px-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition text-left w-full">📦 Categories</button>
          {user && user.role !== 'admin' && (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className={`py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition ${isActive('/profile') ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}>🐾 My Pet</Link>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)} className={`py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition ${isActive('/wishlist') ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}>🤍 My Wishlist</Link>
            </>
          )}
          {user && user.role !== 'admin' && <Link to="/orders" onClick={() => setMenuOpen(false)} className={`py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition ${isActive('/orders') ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}>📦 My Orders</Link>}
          {user && user.role !== 'admin' && <Link to="/prescriptions" onClick={() => setMenuOpen(false)} className={`py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition ${isActive('/prescriptions') ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}>💊 Prescriptions</Link>}
          {user?.role === 'admin' && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition ${isActive('/dashboard') ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}>📊 Dashboard</Link>}
          <div className="border-t border-gray-700 mt-2 pt-2">
            {user ? (
              <>
                <div className="px-3 py-1.5 text-xs text-gray-500">Signed in as <span className="text-gray-300 font-semibold">{user.name}</span></div>
                <button onClick={handleLogout} className="w-full py-2.5 px-3 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-700 transition text-left">🚪 Logout</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link to="/login"    onClick={() => setMenuOpen(false)} className="py-2.5 px-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="py-2.5 px-4 rounded-full text-sm font-semibold bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition text-center">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}