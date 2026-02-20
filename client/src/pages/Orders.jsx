import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'
import { formatCurrency } from '../utils/currency'

export default function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(Array.isArray(r.data) ? r.data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition font-bold">
              ←
            </button>
            <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
            <div className="w-9" />
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading…</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6">Your orders will appear here.</p>
              <button onClick={() => navigate('/products')} className="bg-gray-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-700 transition">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(o => (
                <div key={o._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-gray-900">#{String(o._id).slice(-6).toUpperCase()}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(o.total)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">{formatDate(o.createdAt)} · {o.status || 'Pending'}</div>
                  <div className="space-y-2">
                    {o.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-gray-600">
                        <span>{item.name} ×{item.qty || 1}</span>
                        <span>{formatCurrency((item.price || 0) * (item.qty || 1))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
