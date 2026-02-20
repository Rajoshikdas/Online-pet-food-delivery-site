import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { user }   = useAuth()
  const [email, setEmail] = useState('')
  const [subbed, setSubbed] = useState(false)

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) { setSubbed(true); setEmail('') }
  }

  const QUICK_LINKS = [
    { label: 'Home',       action: () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
    { label: 'Products',   action: () => scrollTo('products')   },
    ...(user?.role !== 'admin' ? [
      { label: 'My Pet',         action: () => navigate('/profile')       },
      { label: 'My Wishlist',    action: () => navigate('/wishlist')       },
      { label: 'My Orders',      action: () => navigate('/orders')        },
      { label: 'Prescriptions',  action: () => navigate('/prescriptions') },
    ] : []),
    ...(!user ? [
      { label: 'Sign In',   action: () => navigate('/login')    },
      { label: 'Register',  action: () => navigate('/register') },
    ] : []),
  ]

  return (
    <footer className="bg-gray-900 text-gray-400 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16 mb-10">
          {/* Brand - left */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <i className="fa-solid fa-paw text-yellow-400 text-2xl shrink-0" />
              <span className="font-bold text-xl text-white">
                <span className="text-yellow-400">Foco</span>Pet
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Your ultimate online pet store. We're more than just a pet food shop — we're your partners in pet parenting.
            </p>
            <div className="flex gap-3">
              {['twitter', 'facebook', 'instagram'].map(s => (
                <a key={s} href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 flex items-center justify-center text-xs font-bold transition-colors">
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - middle */}
          <div className="flex flex-col items-center sm:items-center">
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2 text-sm flex flex-col items-center sm:items-center">
              {QUICK_LINKS.map(({ label, action }) => (
                <li key={label}>
                  <button onClick={action}
                    className="hover:text-yellow-400 transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - right */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to get the latest deals and updates.</p>
            {subbed ? (
              <div className="bg-green-900/40 border border-green-700 text-green-400 text-sm rounded-xl px-4 py-3">
                ✅ Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                />
                <button type="submit"
                  className="bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-full text-sm hover:bg-yellow-300 transition-colors whitespace-nowrap">
                  Go
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} FocoPet. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}