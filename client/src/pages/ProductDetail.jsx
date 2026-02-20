import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { formatCurrency, getDiscountedPrice } from '../utils/currency'

const SPECIES_EMOJI = { dog: '🐕', cat: '🐈', bird: '🐦', rabbit: '🐇', fish: '🐠', all: '🐾' }

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const productFromState = location.state?.product
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [reviewStars, setReviewStars] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    if (productFromState) {
      setProduct(productFromState)
      setLoading(false)
      return
    }
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id, productFromState])

  const fetchReviews = () => {
    const pid = product?._id || product?.id
    if (!pid || (typeof pid === 'string' && pid.startsWith('f'))) return
    api.get(`/products/${pid}/reviews`)
      .then(res => {
        const list = res.data?.reviews || []
        setReviews(list)
        setAvgRating(list.length > 0 ? (res.data?.avgRating ?? null) : null)
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (product) fetchReviews()
  }, [product?._id ?? product?.id])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    const pid = product?._id || product?.id
    if (!user || !pid || (typeof pid === 'string' && pid.startsWith('f'))) {
      if (!user) alert('Please sign in to submit a review.')
      return
    }
    setSubmittingReview(true)
    setReviewSuccess(false)
    try {
      await api.post(`/products/${pid}/reviews`, { rating: reviewStars, comment: reviewText })
      setReviewText('')
      setReviewStars(5)
      setReviewSuccess(true)
      setTimeout(() => setReviewSuccess(false), 4000)
      fetchReviews()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const inWishlist = product ? isInWishlist(product._id || product.id) : false

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...product, id: product._id || product.id })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const toggleWishlist = () => {
    if (!product) return
    if (inWishlist) {
      removeFromWishlist(product._id || product.id)
    } else {
      addToWishlist(product)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 mt-16 flex items-center justify-center">
          <div className="animate-pulse w-full max-w-4xl mx-auto px-4">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 mt-16 flex flex-col items-center justify-center gap-4 px-4">
          <div className="text-6xl">📦</div>
          <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
          <Link to="/products" className="text-sky-600 hover:underline font-medium">← Back to products</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const finalPrice = product.discount > 0
    ? getDiscountedPrice(product.price, product.discount)
    : (product.price ?? 0)
  const hasReviews = reviews.length > 0
  const displayRating = hasReviews ? (avgRating ?? 0) : null
  const emoji = SPECIES_EMOJI[product.species] || '🐾'
  const ingredients = Array.isArray(product.ingredients) ? product.ingredients : (product.ingredients ? String(product.ingredients).split(',').map(s => s.trim()) : [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium">
            <span>←</span> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="aspect-square rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-9xl">{emoji}</span>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="text-sm text-gray-500 font-medium mb-1">{product.category}</div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                {hasReviews ? (
                  <>
                    <span className="text-lg text-yellow-500">★</span>
                    <span className="text-gray-700 font-semibold">{Number(displayRating).toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">· {reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">No reviews yet</span>
                )}
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-black text-gray-900">{formatCurrency(finalPrice)}</span>
                {product.discount > 0 && (
                  <span className="text-lg text-gray-400 line-through">{formatCurrency(product.price)}</span>
                )}
                {product.discount > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{product.discount}%</span>
                )}
              </div>

              {/* Description - always show */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Dosage */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Dosage</h3>
                <p className="text-gray-600 text-sm">{product.dosage || '—'}</p>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Ingredients</h3>
                <p className="text-gray-600 text-sm">
                  {ingredients.length > 0 ? ingredients.join(', ') : (product.ingredients ? String(product.ingredients) : '—')}
                </p>
              </div>

              {/* Usage / What it's for */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">What it&apos;s for</h3>
                <p className="text-gray-600 text-sm">{product.usage || '—'}</p>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700">−</button>
                  <span className="px-5 py-2.5 font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700">+</button>
                </div>
                <button onClick={handleAddToCart}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${added ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button onClick={toggleWishlist}
                  className={`px-6 py-3 rounded-xl font-bold border-2 transition-all ${inWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  {inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                </button>
              </div>

              <p className="text-sm text-gray-500">In stock: {product.stock ?? 100} units</p>
            </div>
          </div>

          {/* Reviews section - only for real products */}
          {product && (product._id || product.id) && !String(product._id || product.id).startsWith('f') && (
            <div className="mt-16 border-t border-gray-200 pt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews & Ratings</h2>
              {!user ? (
                <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-gray-700 mb-3">Sign in to rate and review this product.</p>
                  <button type="button" onClick={() => navigate('/login')} className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700">
                    Sign In to Review
                  </button>
                </div>
              ) : user.role !== 'admin' && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3">Rate this product</h3>
                  {reviewSuccess && <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">✓ Thanks for your review!</div>}
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewStars(s)}
                        className={`text-2xl ${s <= reviewStars ? 'text-yellow-500' : 'text-gray-200'}`}>★</button>
                    ))}
                  </div>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                    placeholder="Share your experience (optional)" rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                  <button type="submit" disabled={submittingReview}
                    className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-60">
                    {submittingReview ? 'Submitting…' : 'Submit Review'}
                  </button>
                </form>
              )}
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="p-4 bg-white rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-700 font-bold text-sm">
                          {(r.userName || 'U')[0]}
                        </div>
                        <span className="font-medium text-gray-800">{r.userName || 'Anonymous'}</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-sm ${s <= (r.rating || 0) ? 'text-yellow-500' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
