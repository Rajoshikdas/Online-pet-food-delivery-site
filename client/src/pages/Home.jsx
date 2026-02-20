import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const HOME_ANIM_SEEN = 'focopet_home_anim_seen'

function CountUp({ from, to, duration, format = n => n, suffix = '', animate = true }) {
  const [value, setValue] = useState(animate ? from : to)
  const startRef = useRef(null)
  const rafRef = useRef()

  useEffect(() => {
    if (!animate) {
      setValue(to)
      return
    }
    startRef.current = performance.now()
    const run = (now) => {
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(from + (to - from) * eased)
      setValue(current)
      if (progress < 1) rafRef.current = requestAnimationFrame(run)
    }
    rafRef.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(rafRef.current)
  }, [from, to, duration, animate])

  return <span>{format(value)}{suffix}</span>
}
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { BEST_SELLING, LATEST_ITEMS, CATEGORY_CARDS, DEFAULT_REVIEWS } from '../data'

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [firstLoad, setFirstLoad] = useState(() => !sessionStorage.getItem(HOME_ANIM_SEEN))

  useEffect(() => {
    if (firstLoad) {
      const t = setTimeout(() => {
        sessionStorage.setItem(HOME_ANIM_SEEN, '1')
      }, 1100)
      return () => clearTimeout(t)
    }
  }, [firstLoad])

  const handleGetStarted = () => {
    if (user?.role === 'admin') navigate('/dashboard')
    else if (user) navigate('/onboarding')
    else navigate('/register')
  }

  const goToProducts = () => {
    navigate('/products')
  }

  return (
    <section className="w-full flex flex-col md:flex-row mt-20 md:h-[calc(100vh-80px)] md:max-h-[800px] md:min-h-[600px] overflow-hidden">
      {/* Left – Blue */}
      <div className="w-full bg-sky-500 flex items-center justify-center relative overflow-hidden min-h-[400px] md:flex-1 md:min-h-0">
        <div className="absolute w-64 h-64 bg-sky-400 rounded-full opacity-40 -top-10 -left-10" />
        <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6 p-6 md:p-8">
          <div className="w-52 h-52 md:w-80 md:h-80 rounded-3xl bg-sky-400 border-4 border-white/30 shadow-2xl flex items-center justify-center overflow-hidden">
            <img src="/hero-dog.png" alt="Golden Retriever puppy" className="w-full h-full object-cover object-center" />
          </div>
          <div className="flex gap-3 md:gap-4">
            {['🐶', '🐱', '🐦'].map((emoji, i) => (
              <div key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur border border-white/30 shadow-lg flex flex-col items-center justify-center gap-1">
                <span className="text-2xl md:text-3xl">{emoji}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right – Yellow */}
      <div className="w-full bg-yellow-300 flex items-center justify-center min-h-[480px] md:flex-1 md:min-h-0">
        <div className="max-w-md px-6 md:px-8 py-10 md:py-12">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full mb-4 md:mb-6 shadow">
            <span className="w-2 h-2 bg-yellow-600 rounded-full" />
            #1 Pet Food Online Store
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4 md:mb-6">
            Quality pet food{' '}
            <span className="inline-block" style={{ color: '#fde047', WebkitTextStroke: '2px #111' }}>ensures</span>
            {' '}pet well-being
          </h1>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 md:mb-8">
            Welcome to FocoPet, your ultimate online pet store. We are more than just a pet food shop — we are your partners in pet parenting.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
            <button onClick={handleGetStarted}
              className="bg-gray-900 text-white font-semibold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-gray-700 transition-colors shadow-lg active:scale-95">
              {user?.role === 'admin' ? 'Dashboard' : user ? 'Add Pet' : 'Get Started'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button onClick={goToProducts}
              className="text-gray-800 font-semibold px-4 py-3.5 rounded-full border-2 border-gray-800 hover:bg-yellow-400 transition-colors active:scale-95">
              View Products
            </button>
          </div>
          <div className="flex gap-6 md:gap-8 mt-6 md:mt-10">
            <div>
              <div className="text-xl md:text-2xl font-black text-gray-900">
                <CountUp from={1} to={10000} duration={1000} format={n => n >= 1000 ? `${Math.round(n / 1000)}K` : n} suffix="+" animate={firstLoad} />
              </div>
              <div className="text-xs text-gray-600 font-medium">Happy Pets</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-gray-900">
                <CountUp from={100} to={500} duration={1000} suffix="+" animate={firstLoad} />
              </div>
              <div className="text-xs text-gray-600 font-medium">Products</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-gray-900">Free</div>
              <div className="text-xs text-gray-600 font-medium">Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Categories ────────────────────────────────────────────────────────────────
function CategorySection() {
  const navigate = useNavigate()

  return (
    <section id="categories" className="py-20 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-sky-500 font-semibold text-sm uppercase tracking-widest mb-2">Browse by Type</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Pet Product Category</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-md">
              Your ultimate online pet store. We are more than just a pet food shop.
            </p>
          </div>
          
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_CARDS.map((cat, i) => (
            <button key={i} onClick={() => navigate(`/products?species=${cat.id}`)}
              className={`${cat.bg} border-2 ${cat.border} rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-200 active:scale-95 group`}>
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-xs font-bold text-gray-700 text-center">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Best Selling ──────────────────────────────────────────────────────────────
function BestSellingSection() {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState(BEST_SELLING)

  useEffect(() => {
    api.get('/products/list?limit=6')
      .then(res => {
        const list = res.data?.products || []
        if (list.length > 0) setProducts(list)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="products" className="py-20 bg-gray-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-sky-500 font-semibold text-sm uppercase tracking-widest mb-2">Top Picks</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Best Selling Products</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Promo Banner */}
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-800 p-8 flex flex-col justify-between min-h-[280px] shadow-xl">
            <div>
              <span className="inline-block bg-white text-purple-700 font-black text-xs px-3 py-1 rounded-full mb-3">TRY OUR</span>
              <h3 className="text-white text-3xl font-black leading-tight mb-1">BEST<br />SELLING</h3>
              <p className="text-purple-200 text-sm">Salmon &amp; Chickens Food</p>
            </div>
            <div>
              <span className="bg-yellow-400 text-gray-900 font-black text-2xl px-4 py-2 rounded-2xl inline-block">40%</span>
              <p className="text-white/70 text-xs mt-1">Get it now!</p>
              <button onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-3 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                Shop Now →
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.slice(0, 6).map(product => {
              const pid = product._id || product.id
              return (
                <ProductCard
                  key={pid}
                  id={pid}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  discount={product.discount ?? 0}
                  product={product}
                  onAddToCart={() => addToCart({ ...product, id: pid })}
                  isAdmin={user?.role === 'admin'}
                />
              )
            })}
          </div>
        </div>

        {/* Free Delivery Banner - hidden for admin */}
        {user?.role !== 'admin' && (
          <div className="mt-6 rounded-3xl bg-gradient-to-r from-green-400 to-emerald-500 p-6 flex items-center justify-between shadow-lg">
            <div>
              <h4 className="text-white font-black text-xl">FREE DELIVERY</h4>
              <p className="text-green-100 text-sm">On your first order!</p>
            </div>
            <button onClick={() => navigate('/products')}
              className="bg-white text-green-700 font-bold text-sm px-5 py-2.5 rounded-full hover:bg-green-50 transition-colors shadow active:scale-95">
              Order Now
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Latest Items ──────────────────────────────────────────────────────────────
function LatestItemsSection() {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState(LATEST_ITEMS)

  useEffect(() => {
    api.get('/products/list?limit=4')
      .then(res => {
        const list = res.data?.products || []
        if (list.length > 0) setProducts(list)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="latest" className="py-20 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-sky-500 font-semibold text-sm uppercase tracking-widest mb-2">Fresh Picks</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Our Latest Items</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-md">Carefully selected, just for your furry friends.</p>
          </div>
          <button onClick={() => navigate('/products')}
            className="self-start text-orange-500 font-semibold text-sm border-2 border-orange-400 px-5 py-2 rounded-full hover:bg-orange-50 transition-colors active:scale-95">
            See All Products →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => {
            const pid = product._id || product.id
            return (
              <ProductCard
                key={pid}
                id={pid}
                image={product.image}
                name={product.name}
                price={product.price}
                discount={product.discount ?? 0}
                product={product}
                onAddToCart={() => addToCart({ ...product, id: pid })}
                isAdmin={user?.role === 'admin'}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ──────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS)
  const [feedback, setFeedback] = useState({ text: '', rating: 5 })
  const [submitting, setSubmitting] = useState(false)

  const [avgFeedbackRating, setAvgFeedbackRating] = useState(null)

  useEffect(() => {
    api.get('/feedback/public')
      .then(r => {
        const list = Array.isArray(r.data) ? r.data : (r.data?.feedback || [])
        if (list.length) {
          setReviews(list.map(f => ({ name: f.name, role: f.role || 'Pet Owner', text: f.text, rating: f.rating || 5 })))
          const sum = list.reduce((s, f) => s + (f.rating ?? 5), 0)
          setAvgFeedbackRating(Math.round((sum / list.length) * 10) / 10)
        }
      })
      .catch(() => {})
  }, [])

  const [feedbackSuccess, setFeedbackSuccess] = useState(false)
  const handleSubmitFeedback = async (e) => {
    e.preventDefault()
    if (!feedback.text.trim()) return
    if (!user) {
      alert('Please sign in to submit feedback.')
      return
    }
    setSubmitting(true)
    setFeedbackSuccess(false)
    try {
      await api.post('/feedback/submit', { ...feedback, name: user.name, role: 'Pet Owner' })
      setFeedback({ text: '', rating: 5 })
      setFeedbackSuccess(true)
      setTimeout(() => setFeedbackSuccess(false), 4000)
      const { data } = await api.get('/feedback/public')
      const list = Array.isArray(data) ? data : (data?.feedback || [])
      if (list.length) {
        setReviews(list.map(f => ({ name: f.name, role: f.role || 'Pet Owner', text: f.text, rating: f.rating || 5 })))
        const sum = list.reduce((s, f) => s + (f.rating ?? 5), 0)
        setAvgFeedbackRating(Math.round((sum / list.length) * 10) / 10)
      }
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data?.message || err?.message
      if (status === 401) {
        alert('Please sign in to submit feedback.')
      } else {
        alert(msg ? `Failed to submit feedback: ${msg}` : 'Failed to submit feedback. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="testimonials" className="py-20 bg-gray-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative">
              <div className="w-56 h-72 rounded-3xl bg-yellow-400/30 border-2 border-yellow-400/50 flex items-center justify-center shadow-xl">
                <div className="text-7xl">🐾</div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-36 bg-yellow-400 rounded-2xl p-3 shadow-xl">
                <div className="text-2xl font-black text-gray-900">{avgFeedbackRating != null ? `${avgFeedbackRating}★` : '—'}</div>
                <div className="text-xs font-semibold text-gray-700">Avg Rating</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 space-y-5">
            <div>
              <p className="text-sky-600 font-semibold text-sm uppercase tracking-widest mb-2">Feedback From Users</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">What Pet Owners Say</h2>
            </div>
            {reviews.slice(0, 5).map((r, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {(r.name || 'U')[0]}
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold text-sm">{r.name || 'Anonymous'}</div>
                    <div className="text-gray-500 text-xs">{r.role}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= (r.rating || 5) ? 'text-yellow-500' : 'text-gray-200'}`}>★</span>)}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
            {!user ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">Share your feedback</h3>
                <p className="text-gray-600 text-sm mb-3">Sign in to leave your feedback about FocoPet.</p>
                <button type="button" onClick={() => navigate('/login')} className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700">
                  Sign In to Submit
                </button>
              </div>
            ) : user.role !== 'admin' && (
              <form onSubmit={handleSubmitFeedback} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3">Share your feedback</h3>
                {feedbackSuccess && <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">✓ Thanks for your feedback!</div>}
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setFeedback(f => ({ ...f, rating: s }))}
                      className={`text-xl ${s <= feedback.rating ? 'text-yellow-500' : 'text-gray-200'}`}>★</button>
                  ))}
                </div>
                <textarea value={feedback.text} onChange={e => setFeedback(f => ({ ...f, text: e.target.value }))}
                  placeholder="Your experience with FocoPet…" rows={2} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                <button type="submit" disabled={submitting}
                  className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-60">
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA Section ───────────────────────────────────────────────────────────────
function CTASection() {
  const navigate = useNavigate()
  const { user } = useAuth()


  return (
    <section className="py-20 bg-yellow-300">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4">Ready to spoil your pet?</h2>
        <p className="text-gray-700 mb-8 text-lg">Join thousands of happy pet owners who trust FocoPet for the best nutrition.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => user?.role === 'admin' ? navigate('/dashboard') : user ? navigate('/onboarding') : navigate('/register')}
            className="bg-gray-900 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-gray-700 transition-colors shadow-lg active:scale-95">
            {user?.role === 'admin' ? 'Dashboard' : user ? 'Add Pet' : 'Get Started Free'}
          </button>
          <button onClick={() => navigate('/products')}
            className="bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-full border-2 border-gray-900 hover:bg-yellow-200 transition-colors active:scale-95">
            Browse Products
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <CategorySection />
        <BestSellingSection />
        <LatestItemsSection />
        <TestimonialsSection />
        {user?.role !== 'admin' && <CTASection />}
      </main>
      <Footer />
    </div>
  )
}