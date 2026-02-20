import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatCurrency, getDiscountedPrice } from '../utils/currency'

const SPECIES_EMOJI = { dog: '🐕', cat: '🐈', bird: '🐦', rabbit: '🐇', fish: '🐠' }

export default function Wishlist() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { wishlist, removeFromWishlist, refreshWishlist } = useWishlist()
  const { addToCart } = useCart()

  useEffect(() => {
    if (user) refreshWishlist?.()
  }, [user, refreshWishlist])

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 mt-16 flex flex-col items-center justify-center gap-6 px-4 py-20">
          <div className="text-6xl">🤍</div>
          <h1 className="text-2xl font-bold text-gray-800">Sign in to view your wishlist</h1>
          <p className="text-gray-500 text-center">Create an account or sign in to save products to your wishlist.</p>
          <button onClick={() => navigate('/login')} className="bg-gray-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-700 transition">
            Sign In
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition font-bold">
              ←
            </button>
            <h1 className="text-2xl font-black text-gray-900">My Wishlist</h1>
            <div className="w-9" />
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <div className="text-6xl mb-4">🤍</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-6">Save products you love by clicking the heart icon.</p>
              <Link to="/products" className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-700 transition">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map(p => {
                const id = p._id || p.id
                const emoji = SPECIES_EMOJI[p.species] || '🐾'
                const finalPrice = p.discount > 0 ? getDiscountedPrice(p.price, p.discount) : (p.price ?? 0)
                return (
                  <div key={id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group hover:shadow-md transition relative">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); removeFromWishlist(id) }}
                      title="Remove from wishlist"
                      className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Link to={`/products/${id}`} state={{ product: p }} className="block">
                      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-6xl relative">
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : emoji}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 line-clamp-2">{p.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-gray-900">{formatCurrency(finalPrice)}</span>
                          {p.discount > 0 && <span className="text-xs text-gray-400 line-through">{formatCurrency(p.price)}</span>}
                        </div>
                      </div>
                    </Link>
                    <div className="px-4 pb-4 flex gap-2">
                      <button onClick={() => addToCart({ ...p, id: p._id || p.id })} className="flex-1 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition">
                        Add to Cart
                      </button>
                      <button onClick={() => removeFromWishlist(id)} className="px-4 py-2 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold transition" title="Remove">
                        🤍
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
