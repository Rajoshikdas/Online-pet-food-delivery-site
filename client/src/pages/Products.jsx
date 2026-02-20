import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import ProductFormModal from '../components/ProductFormModal'
import api from '../services/api'
import { FALLBACK_GROUPED, SPECIES_CONFIG, SPECIES_KEYS } from '../data'
import { getSearchTerms } from '../utils/search'
import { isFallbackProduct } from '../utils/product'
import { formatCurrency, getDiscountedPrice } from '../utils/currency'

function ProductCard({ product, onAddToCart, onAddToWishlist, onRemoveFromWishlist, isInWishlist, isAdmin, onEdit, onDelete }) {
  const [added, setAdded] = useState(false)
  const productId = product._id || product.id
  const inWishlist = isInWishlist?.(productId)
  const finalPrice = product.discount > 0
    ? getDiscountedPrice(product.price, product.discount)
    : (product.price ?? 0)
  const rating = product.avgRating ?? null

  const handleAdd = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    onAddToCart?.({ ...product, id: productId })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const handleEdit = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (isFallbackProduct(product)) {
      alert('Cannot edit sample products. Add real products from the Dashboard to edit.')
      return
    }
    onEdit?.(product)
  }

  const handleDelete = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (isFallbackProduct(product)) {
      alert('Cannot delete sample products. Add real products from the Dashboard to manage.')
      return
    }
    onDelete?.(product)
  }

  const handleWishlist = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (inWishlist) {
      onRemoveFromWishlist?.(productId)
    } else {
      onAddToWishlist?.(product)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group relative">
      {!isAdmin && onAddToWishlist && (
        <button
          type="button"
          onClick={handleWishlist}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-gray-200 flex items-center justify-center transition hover:bg-white hover:scale-110"
        >
          <span className={`text-base ${inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
            {inWishlist ? '❤️' : '🤍'}
          </span>
        </button>
      )}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-20 flex gap-1">
          <button type="button" onClick={handleEdit} title="Edit"
            className="w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button type="button" onClick={handleDelete} title="Delete"
            className="w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center text-red-600 hover:bg-red-50 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      )}
      {productId ? (
        <Link to={`/products/${productId}`} state={{ product: isFallbackProduct(product) ? product : undefined }} className="block" onClick={(e) => isAdmin && e.preventDefault()}>
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            {product.discount > 0 && (
              <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10">
                -{product.discount}%
              </span>
            )}
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            ) : (
              <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
                {product.species === 'dog' ? '🐕' : product.species === 'cat' ? '🐈' : product.species === 'bird' ? '🐦' : product.species === 'rabbit' ? '🐇' : product.species === 'fish' ? '🐠' : '🐾'}
              </span>
            )}
          </div>
          <div className="p-3">
            <div className="text-xs text-gray-400 font-medium mb-0.5">{product.category}</div>
            <h3 className="text-xs font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-sky-600">{product.name}</h3>
            {(rating != null && rating > 0) && (
              <div className="flex items-center gap-1 mb-2">
                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-semibold text-gray-600">{Number(rating).toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-black text-gray-900">{formatCurrency(finalPrice)}</span>
                {product.discount > 0 && (
                  <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(product.price)}</span>
                )}
              </div>
              {!isAdmin && (
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(e) }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer
                    ${added ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
                  {added ? '✓ Added' : '+ Add'}
                </button>
              )}
            </div>
          </div>
        </Link>
      ) : (
        <div className="block relative">
          {!isAdmin && onAddToWishlist && (
            <button
              type="button"
              onClick={handleWishlist}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-gray-200 flex items-center justify-center transition hover:bg-white hover:scale-110"
            >
              <span className={`text-base ${inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                {inWishlist ? '❤️' : '🤍'}
              </span>
            </button>
          )}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            {product.discount > 0 && (
              <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10">
                -{product.discount}%
              </span>
            )}
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            ) : (
              <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
                {product.species === 'dog' ? '🐕' : product.species === 'cat' ? '🐈' : product.species === 'bird' ? '🐦' : product.species === 'rabbit' ? '🐇' : product.species === 'fish' ? '🐠' : '🐾'}
              </span>
            )}
          </div>
          <div className="p-3">
            <div className="text-xs text-gray-400 font-medium mb-0.5">{product.category}</div>
            <h3 className="text-xs font-semibold text-gray-800 leading-snug mb-2 line-clamp-2">{product.name}</h3>
            {(rating != null && rating > 0) && (
              <div className="flex items-center gap-1 mb-2">
                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-semibold text-gray-600">{Number(rating).toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-black text-gray-900">{formatCurrency(finalPrice)}</span>
                {product.discount > 0 && (
                  <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(product.price)}</span>
                )}
              </div>
              {!isAdmin && (
                <button type="button" onClick={handleAdd}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer
                    ${added ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
                  {added ? '✓ Added' : '+ Add'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SpeciesSection({ speciesKey, products, addToCart, addToWishlist, removeFromWishlist, isInWishlist, isAdmin, onEdit, onDelete }) {
  const config = SPECIES_CONFIG[speciesKey]
  if (!config || !products?.length) return null

  return (
    <section className="py-12">
      <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">{config.emoji}</span>
        {config.label}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map(p => (
          <ProductCard key={p._id || p.id} product={p} onAddToCart={addToCart} onAddToWishlist={addToWishlist} onRemoveFromWishlist={removeFromWishlist} isInWishlist={isInWishlist} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </section>
  )
}

function groupBySpecies(products) {
  const grouped = { dog: [], cat: [], bird: [], rabbit: [], fish: [] }
  for (const p of products || []) {
    const s = p.species || 'all'
    if (s === 'all') {
      ['dog', 'cat', 'bird', 'rabbit', 'fish'].forEach(k => grouped[k].push({ ...p }))
    } else if (grouped[s]) {
      grouped[s].push(p)
    }
  }
  return grouped
}

export default function Products() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')?.trim() || ''
  const speciesParam = searchParams.get('species')?.toLowerCase() || ''
  const isFromCategory = speciesParam && SPECIES_KEYS.includes(speciesParam)
  const effectiveQuery = isFromCategory ? speciesParam : searchQuery
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [grouped, setGrouped] = useState({ dog: [], cat: [], bird: [], rabbit: [], fish: [] })
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const searchIsSpecies = SPECIES_KEYS.includes(effectiveQuery.toLowerCase())
  const displaySpeciesKeys = searchIsSpecies ? [effectiveQuery.toLowerCase()] : SPECIES_KEYS

  const fetchProducts = () => {
    setLoading(true)
    const query = effectiveQuery
    if (query) {
      api.get(`/products/list?search=${encodeURIComponent(query)}&limit=100`)
        .catch(() => api.get('/products'))
        .then(res => {
          const products = res.data?.products || Object.values(res.data || {}).flat().filter(Boolean)
          if (products.length > 0) {
            setGrouped(groupBySpecies(products))
          } else if (searchIsSpecies && FALLBACK_GROUPED[query.toLowerCase()]) {
            setGrouped({ ...{ dog: [], cat: [], bird: [], rabbit: [], fish: [] }, [query.toLowerCase()]: FALLBACK_GROUPED[query.toLowerCase()] })
          } else if (!searchIsSpecies && query) {
            const terms = getSearchTerms(query)
            const all = Object.entries(FALLBACK_GROUPED).flatMap(([k, arr]) => (arr || []).map(p => ({ ...p })))
            const filtered = all.filter(p => {
              const name = (p.name || '').toLowerCase()
              const category = (p.category || '').toLowerCase()
              const species = (p.species || '').toLowerCase()
              return terms.some(t => name.includes(t) || category.includes(t) || species.includes(t))
            })
            setGrouped(groupBySpecies(filtered))
          } else {
            setGrouped(groupBySpecies(products))
          }
        })
        .catch(() => {
          if (searchIsSpecies && FALLBACK_GROUPED[query.toLowerCase()]) {
            setGrouped({ ...{ dog: [], cat: [], bird: [], rabbit: [], fish: [] }, [query.toLowerCase()]: FALLBACK_GROUPED[query.toLowerCase()] })
          } else if (!searchIsSpecies && query) {
            const terms = getSearchTerms(query)
            const all = Object.entries(FALLBACK_GROUPED).flatMap(([k, arr]) => (arr || []).map(p => ({ ...p })))
            const filtered = all.filter(p => {
              const name = (p.name || '').toLowerCase()
              const category = (p.category || '').toLowerCase()
              const species = (p.species || '').toLowerCase()
              return terms.some(t => name.includes(t) || category.includes(t) || species.includes(t))
            })
            setGrouped(groupBySpecies(filtered))
          } else {
            setGrouped({ dog: [], cat: [], bird: [], rabbit: [], fish: [] })
          }
        })
        .finally(() => setLoading(false))
    } else {
      api.get('/products')
        .then(res => {
          const data = res.data || {}
          const hasProducts = Object.values(data).some(arr => Array.isArray(arr) && arr.length > 0)
          setGrouped(hasProducts ? data : FALLBACK_GROUPED)
        })
        .catch(() => setGrouped(FALLBACK_GROUPED))
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [effectiveQuery])

  const handleFormSubmit = async (payload) => {
    try {
      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id
        if (!id || (typeof id === 'string' && id.startsWith('f'))) {
          alert('Cannot edit fallback product')
          return
        }
        await api.put(`/products/${String(id)}`, payload)
      } else {
        await api.post('/products', payload)
      }
      setEditingProduct(null)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product')
      throw err
    }
  }

  const clearSearch = () => navigate('/products')

  const handleDelete = async (product) => {
    const id = product._id || product.id
    if (!id || (typeof id === 'string' && id.startsWith('f'))) return // fallback products have string ids like fd1
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${String(id)}`)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition font-bold shrink-0">
                ←
              </button>
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  {isFromCategory ? (SPECIES_CONFIG[speciesParam]?.label || 'Products') : searchQuery ? `Results for "${searchQuery}"` : 'Products'}
                </h1>
                <p className="text-sm text-gray-500">
                  {isFromCategory ? 'Products for this category' : searchQuery ? (searchIsSpecies ? `${SPECIES_CONFIG[searchQuery.toLowerCase()]?.label || searchQuery}` : 'Matching product names and categories') : 'Browse by pet type'}
                </p>
              </div>
            </div>
            {((searchQuery && !isFromCategory) || isAdmin) && (
              <button onClick={(searchQuery && !isFromCategory) ? clearSearch : () => { setEditingProduct(null); setFormOpen(true) }}
                className="bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-700 transition flex items-center gap-2">
                {(searchQuery && !isFromCategory) ? '✕ Clear Search' : <><span>+</span> Add Product</>}
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 h-56 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {displaySpeciesKeys.map(speciesKey => (
                <SpeciesSection
                  key={speciesKey}
                  speciesKey={speciesKey}
                  products={grouped[speciesKey]}
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                  removeFromWishlist={removeFromWishlist}
                  isInWishlist={isInWishlist}
                  isAdmin={isAdmin}
                  onEdit={(p) => {
                    const id = p._id || p.id
                    if (id && !(typeof id === 'string' && id.startsWith('f'))) {
                      setEditingProduct(p)
                      setFormOpen(true)
                    }
                  }}
                  onDelete={handleDelete}
                />
              ))}
              {!Object.values(grouped).some(arr => arr?.length > 0) && (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No products yet</h3>
                  <p className="text-gray-400">Products will appear here once added.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <ProductFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingProduct(null) }}
        onSubmit={handleFormSubmit}
        product={editingProduct}
      />
    </div>
  )
}
