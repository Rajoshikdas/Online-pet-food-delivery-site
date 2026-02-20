import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { formatCurrency } from '../utils/currency'

const STATUS_STYLES = {
  Paid:      'bg-yellow-100 text-yellow-700',
  Delivered: 'bg-orange-100 text-orange-600',
  Completed: 'bg-green-100  text-green-700',
}

const NAV_ITEMS = [
  { label: 'Orders',      icon: '📦', tab: 'Orders'      },
  { label: 'Feedback',    icon: '⭐', tab: 'Feedback'    },
  { label: 'Add Product', icon: '➕', tab: 'AddProduct'  },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders,       setOrders]       = useState([])
  const [selected,     setSelected]     = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [activeNav,    setActiveNav]    = useState('Orders')
  const [statusFilter, setStatusFilter] = useState('Any status')
  const [sortBy,       setSortBy]       = useState('Date')
  const [feedback,     setFeedback]     = useState([])
  const [productForm,  setProductForm]  = useState({
    name: '', description: '', price: '', discount: '', category: '', species: 'dog',
    ingredients: '', dosage: '', usage: '', image: ''
  })
  const [productSaving, setProductSaving] = useState(false)
  const [productMsg,    setProductMsg]    = useState({ type: '', text: '' })

  useEffect(() => {
    api.get('/orders')
      .then(res => {
        setOrders(res.data)
        if (res.data.length) setSelected(res.data[0])
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeNav === 'Feedback') {
      api.get('/feedback')
        .then(res => setFeedback(res.data || []))
        .catch(() => setFeedback([]))
    }
  }, [activeNav])

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? data : o))
      setSelected(data)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleNavClick = (item) => {
    setActiveNav(item.tab || item.label)
    setProductMsg({ type: '', text: '' })
  }

  const handleProductChange = (e) => {
    const { name, value } = e.target
    setProductForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setProductSaving(true)
    setProductMsg({ type: '', text: '' })
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        discount: productForm.discount ? Number(productForm.discount) : 0,
      }
      await api.post('/products', payload)
      setProductMsg({ type: 'success', text: 'Product added successfully!' })
      setProductForm({
        name: '', description: '', price: '', discount: '', category: '', species: 'dog',
        ingredients: '', dosage: '', usage: '', image: ''
      })
    } catch (err) {
      setProductMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add product' })
    } finally {
      setProductSaving(false)
    }
  }

  const formatDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const filteredOrders = orders
    .filter(o => statusFilter === 'Any status' || o.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'Total') return b.total - a.total
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 mt-16" style={{ height: 'calc(100vh - 64px)' }}>

        {/* LEFT SIDEBAR */}
        <div className="w-64 min-w-64 bg-gray-900 text-white flex flex-col py-6 overflow-y-auto">
          <div className="px-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-black text-sm shrink-0">
                A
              </div>
              <span className="text-lg font-black text-white">Admin</span>
            </div>
            {user && (
              <div className="mt-3 text-xs text-gray-400">
                Logged in as <span className="text-white font-semibold">{user.name}</span>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-1 px-3 flex-1">
            {NAV_ITEMS.map(item => (
              <button key={item.label}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all w-full
                  ${activeNav === (item.tab || item.label)
                    ? 'bg-white text-gray-900 font-semibold shadow'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-3 mt-4 flex flex-col gap-1">
            <Link to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition w-full">
              <span>🏠</span> Back to Site
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-gray-800 transition w-full">
              <span>🚪</span> Log out
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex overflow-hidden bg-gray-100">
          <div className="flex-1 overflow-y-auto p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-gray-900">
                {activeNav === 'AddProduct' ? 'Add Product' : activeNav}
              </h1>
              {activeNav === 'Orders' && (
                <div className="text-sm text-gray-500">
                  {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Feedback view */}
            {activeNav === 'Feedback' && (
              <div className="space-y-4">
                {feedback.length === 0 ? (
                  <div className="bg-white rounded-2xl p-16 text-center">
                    <div className="text-4xl mb-3">⭐</div>
                    <p className="text-gray-500">No feedback yet.</p>
                  </div>
                ) : (
                  feedback.map((f, i) => (
                    <div key={f._id || i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-lg font-bold text-yellow-700">
                          {(f.name || 'U')[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{f.name || 'Anonymous'}</div>
                          <div className="text-xs text-gray-500">{f.user?.email} · {f.role || 'Pet Owner'}</div>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= (f.rating || 5) ? 'text-yellow-500' : 'text-gray-200'}`}>★</span>)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{f.text}</p>
                      <div className="text-xs text-gray-400 mt-2">{new Date(f.createdAt).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Add Product view */}
            {activeNav === 'AddProduct' && (
              <div className="w-full">
                <form onSubmit={handleAddProduct} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                  {productMsg.text && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${productMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {productMsg.text}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name *</label>
                      <input type="text" name="name" value={productForm.name} onChange={handleProductChange} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="e.g. Premium Dog Food" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
                      <input type="text" name="category" value={productForm.category} onChange={handleProductChange} required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="e.g. Food, Treats, Toys" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                    <textarea name="description" value={productForm.description} onChange={handleProductChange} rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" placeholder="Product description..." />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (₹) *</label>
                      <input type="number" name="price" value={productForm.price} onChange={handleProductChange} required min="0" step="0.01"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="499" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount (%)</label>
                      <input type="number" name="discount" value={productForm.discount} onChange={handleProductChange} min="0" max="100"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="10" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Species *</label>
                      <select name="species" value={productForm.species} onChange={handleProductChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer">
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="fish">Fish</option>
                        <option value="rabbit">Rabbit</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL</label>
                    <input type="url" name="image" value={productForm.image} onChange={handleProductChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="https://example.com/image.jpg" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ingredients</label>
                    <textarea name="ingredients" value={productForm.ingredients} onChange={handleProductChange} rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" placeholder="List of ingredients..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Dosage</label>
                      <input type="text" name="dosage" value={productForm.dosage} onChange={handleProductChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="e.g. 50g per day" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Usage</label>
                      <input type="text" name="usage" value={productForm.usage} onChange={handleProductChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="e.g. Mix with water" />
                    </div>
                  </div>

                  <button type="submit" disabled={productSaving}
                    className="w-full py-3 rounded-xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {productSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>➕ Add Product</>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Orders view */}
            {activeNav === 'Orders' && (
            <>
            {/* Filters */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none shadow-sm cursor-pointer">
                <option>Any status</option>
                <option>Paid</option>
                <option>Delivered</option>
                <option>Completed</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none shadow-sm cursor-pointer">
                <option value="Date">Sort by Date</option>
                <option value="Total">Sort by Total</option>
              </select>
            </div>

            {/* Table */}
            {loading ? (
              <div className="bg-white rounded-2xl p-16 text-center text-gray-400 animate-pulse">Loading orders...</div>
            ) : error ? (
              <div className="bg-white rounded-2xl p-16 text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-gray-500">{error}</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-500">No orders found.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header row */}
                <div className="grid text-xs font-semibold text-gray-400 uppercase tracking-widest px-5 py-3 border-b border-gray-100 bg-gray-50"
                     style={{ gridTemplateColumns: '36px 110px 1fr 120px 100px 90px 32px' }}>
                  <div /><div>Order</div><div>Customer</div><div>Status</div><div>Total</div><div>Date</div><div />
                </div>

                {filteredOrders.map(order => (
                  <div key={order._id}
                    onClick={() => setSelected(order)}
                    className={`grid items-center px-5 py-3.5 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50
                      ${selected?._id === order._id ? 'bg-blue-50 border-blue-100' : ''}`}
                    style={{ gridTemplateColumns: '36px 110px 1fr 120px 100px 90px 32px' }}>

                    <div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition
                        ${selected?._id === order._id ? 'bg-gray-900 border-gray-900' : 'border-gray-200'}`}>
                        {selected?._id === order._id && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-700">#{order._id.slice(-6).toUpperCase()}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-base shrink-0">👤</div>
                      <span className="text-sm text-gray-700 font-medium truncate">{order.user?.name || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">{formatCurrency(order.total)}</div>
                    <div className="text-sm text-gray-400">{formatDate(order.createdAt)}</div>
                    <div className="text-gray-300 text-lg text-center">⋯</div>
                  </div>
                ))}
              </div>
            )}
            </>
            )}
          </div>

          {/* RIGHT DETAIL PANEL */}
          {selected && activeNav === 'Orders' && (
            <div className="w-96 min-w-96 bg-white border-l border-gray-100 shadow-2xl flex flex-col overflow-y-auto">
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Order #{selected._id.slice(-6).toUpperCase()}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[selected.status]}`}>
                      {selected.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(selected.createdAt)}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition font-bold text-sm">
                  ✕
                </button>
              </div>

              {/* Customer */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl shadow">👤</div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">{selected.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-400">{selected.user?.email || ''}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  {[['✉️', 'Email'], ['📞', 'Call'], ['💬', 'Message']].map(([icon, label]) => (
                    <button key={label} title={label}
                      onClick={() => alert(`${label} customer: ${selected.user?.name}`)}
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-base hover:bg-gray-200 transition">
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="px-6 py-5 flex-1">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Order items</h3>
                <div className="flex flex-col gap-3">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0">🛒</div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-700 leading-snug">{item.name}</div>
                        {item.qty > 1 && <div className="text-xs text-gray-400">x{item.qty}</div>}
                      </div>
                      <div className="text-sm font-bold text-gray-800 shrink-0">{formatCurrency(item.price)}</div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Total</span>
                  <span className="text-xl font-black text-gray-900">{formatCurrency(selected.total)}</span>
                </div>

                {/* Status updater */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Update Status</label>
                  <select value={selected.status}
                    onChange={e => updateStatus(selected._id, e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer">
                    <option>Paid</option>
                    <option>Delivered</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => alert(`Tracking order #${selected._id.slice(-6).toUpperCase()}`)}
                  className="flex-1 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2 active:scale-95">
                  ⚙️ Track
                </button>
                <button
                  onClick={() => {
                    if (confirm('Issue a refund for this order?')) {
                      alert(`Refund initiated for ${formatCurrency(selected.total)}`)
                    }
                  }}
                  className="flex-1 py-2.5 rounded-full bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-300 transition flex items-center justify-center gap-2 active:scale-95">
                  ↩️ Refund
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}