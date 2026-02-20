import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function OrderSuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Congratulations!</h2>
        <p className="text-gray-600 mb-6">Your order is placed and will reach you soon.</p>
        <button onClick={onClose}
          className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-700 transition active:scale-95">
          Continue
        </button>
      </div>
    </div>
  )
}
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { formatCurrency, getDiscountedPrice } from '../utils/currency'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, removeFromCart, cartCount, clearCart } = useCart()
  const [placing, setPlacing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => {
    const price = getDiscountedPrice(item.price, item.discount || 0)
    return sum + price * (item.quantity || 1)
  }, 0)
  const tax = subtotal * 0
  const total = subtotal + tax

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition font-bold shrink-0">
              ←
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
              <p className="text-sm text-gray-500">{cartCount} item{cartCount !== 1 ? 's' : ''} in cart</p>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some products to get started.</p>
              <button onClick={() => navigate('/products')}
                className="bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-gray-700 transition active:scale-95">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map(item => (
                  <div key={item.id || item._id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-3xl">
                      {item.species === 'dog' ? '🐕' : item.species === 'cat' ? '🐈' : item.species === 'bird' ? '🐦' : item.species === 'rabbit' ? '🐇' : item.species === 'fish' ? '🐠' : '🐾'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black text-gray-900">
                          {formatCurrency(getDiscountedPrice(item.price, item.discount) * (item.quantity || 1))}
                        </span>
                        <span className="text-sm text-gray-400">Qty: {item.quantity || 1}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id || item._id)}
                      className="text-red-500 hover:text-red-600 text-sm font-semibold shrink-0">
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                  <h3 className="font-black text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-black text-lg text-gray-900 pt-3 border-t border-gray-100">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!user) { navigate('/login'); return }
                      setPlacing(true)
                      try {
                        const items = cartItems.map(i => ({
                          name: i.name,
                          price: getDiscountedPrice(i.price, i.discount),
                          qty: i.quantity || 1,
                          category: i.category || '',
                          species: i.species || '',
                        }))
                        await api.post('/orders', { items, total })
                        clearCart?.()
                        setOrderSuccess(true)
                      } catch (e) {
                        alert(e.response?.data?.message || 'Failed to place order')
                      } finally {
                        setPlacing(false)
                      }
                    }}
                    disabled={placing}
                    className="w-full mt-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-700 transition active:scale-95 disabled:opacity-60">
                    {placing ? 'Placing…' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {orderSuccess && (
        <OrderSuccessModal onClose={() => { setOrderSuccess(false); navigate('/orders') }} />
      )}
    </div>
  )
}
