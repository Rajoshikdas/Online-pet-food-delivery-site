import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatCurrency, getDiscountedPrice } from '../utils/currency'

export default function ProductCard({ id, image, name, price, discount, rating: ratingProp, onAddToCart, isAdmin, product }) {
  const { addToCart } = useCart()
  const rating = ratingProp ?? product?.avgRating ?? null
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [added, setAdded] = useState(false)
  const productId = id || product?._id || product?.id
  const inWishlist = isInWishlist?.(productId)

  const discountedPrice = discount > 0 ? getDiscountedPrice(price, discount) : null

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart()
    } else {
      addToCart({ id, image, name, price, discount })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const productData = product || { id, image, name, price, discount, _id: id }
  const handleWishlist = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (inWishlist) {
      removeFromWishlist?.(productId)
    } else {
      addToWishlist?.(productData)
    }
  }
  return (
    <Link to={`/products/${productId}`} state={{ product: productData }} className="block group relative rounded-2xl shadow-lg bg-white border border-gray-100 overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 flex flex-col">
      {/* Wishlist heart - stacked on top */}
      {!isAdmin && (
        <button
          type="button"
          onClick={handleWishlist}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-gray-200 flex items-center justify-center transition hover:bg-white hover:scale-110"
        >
          <span className={`text-base ${inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
            {inWishlist ? '❤️' : '🤍'}
          </span>
        </button>
      )}
      {/* Discount Badge - use > 0 to avoid rendering "0" when discount is 0 */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          -{discount}%
        </div>
      )}

      {/* Image */}
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-yellow-50 to-sky-100 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/70 shadow-inner flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Price Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {discount > 0 && discountedPrice != null ? (
            <>
              <span className="text-lg font-black text-gray-900">{formatCurrency(discountedPrice)}</span>
              <span className="text-xs text-gray-400 line-through">{formatCurrency(price)}</span>
            </>
          ) : (
            <span className="text-lg font-black text-gray-900">{formatCurrency(price)}</span>
          )}
        </div>

        {/* 1 star + avg rating - only when product has reviews */}
        {rating != null && rating > 0 && (
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-gray-600">{Number(rating).toFixed(1)}</span>
          </div>
        )}

        {/* Add to Cart Button - hidden for admin */}
        {!isAdmin && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart() }}
            className={`mt-auto w-full text-sm font-semibold py-2.5 rounded-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2
              ${added
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 text-white hover:bg-sky-600'
              }`}
          >
            {added ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </Link>
  )
}