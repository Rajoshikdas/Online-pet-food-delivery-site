import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Register() {
  const { register, loading, user } = useAuth()
  const navigate = useNavigate()
  const [form,  setForm]  = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    try {
      await register(form.name, form.email, form.password)
      navigate('/products')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20 mt-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🐶</div>
            <h1 className="text-2xl font-black text-gray-900">Create account</h1>
            <p className="text-gray-500 text-sm mt-1">Join FocoPet and start caring for your pet</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange}
                placeholder="John Doe" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm Password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
                placeholder="Repeat password" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gray-900 text-white font-semibold py-3 rounded-full hover:bg-gray-700 transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-900 font-semibold hover:underline">Sign in</Link>
          </p>

          <div className="mt-4 text-center">
            <button onClick={() => navigate('/')}
              className="text-xs text-gray-400 hover:text-gray-600 transition">
              ← Back to Home
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}