import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'

function PrescriptionCard({ prescription, onRefill, onDelete }) {
  const { _id, medicineName, dosage, hospital, expiryDate } = prescription
  const [requested, setRequested] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const formatDate = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'

  const handleRefill = () => {
    setRequested(true)
    onRefill?.()
    setTimeout(() => setRequested(false), 3000)
  }

  const handleDelete = async () => {
    if (!confirm('Remove this prescription?')) return
    setDeleting(true)
    try {
      await api.delete(`/prescriptions/${_id}`)
      onDelete?.()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-2xl shrink-0">💊</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-base font-bold text-gray-800">{medicineName}</h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400 whitespace-nowrap">Exp: {formatDate(expiryDate)}</span>
              <button type="button" onClick={handleDelete} disabled={deleting}
                className="text-red-500 hover:text-red-600 text-sm font-medium disabled:opacity-50" title="Remove prescription">
                Remove
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">{dosage}</p>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-semibold text-gray-700">{hospital || '—'}</span>
            <button onClick={handleRefill}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200
                ${requested
                  ? 'bg-green-500 text-white border-2 border-green-500'
                  : 'border-2 border-teal-500 text-teal-600 hover:bg-teal-500 hover:text-white'
                }`}>
              {requested ? '✅ Requested!' : 'Request Refill'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Prescriptions() {
  const navigate = useNavigate()
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ medicineName: '', dosage: '', hospital: '', expiryDate: '' })

  const fetchPrescriptions = () => {
    setLoading(true)
    api.get('/prescriptions')
      .then(res => setPrescriptions(res.data || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load prescriptions'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const handleAddPrescription = async (e) => {
    e.preventDefault()
    if (!form.medicineName?.trim() || !form.dosage?.trim()) {
      alert('Medicine name and dosage are required')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/prescriptions', {
        medicineName: form.medicineName.trim(),
        dosage: form.dosage.trim(),
        hospital: form.hospital?.trim() || undefined,
        expiryDate: form.expiryDate || undefined,
      })
      setForm({ medicineName: '', dosage: '', hospital: '', expiryDate: '' })
      setFormOpen(false)
      fetchPrescriptions()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add prescription')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 mt-16">

        {/* Page header */}
        <div className="bg-white border-b border-gray-100 px-6 py-6">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <button onClick={() => navigate('/')}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition font-bold shrink-0">
              ←
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Prescriptions</h1>
              <p className="text-sm text-gray-500 mt-0.5">Your synced prescriptions from your provider(s).</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {loading ? (
            <div className="text-center text-gray-400 py-16 text-lg animate-pulse">Loading prescriptions...</div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">💊</div>
              <p className="text-gray-500 mb-6">{error}</p>
              <button onClick={() => navigate('/')}
                className="bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-gray-700 transition active:scale-95">
                ← Back to Home
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Prescriptions list */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                    Active Prescriptions ({prescriptions.length})
                  </h2>
                  <button onClick={() => setFormOpen(true)}
                    className="px-4 py-2 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-500 transition active:scale-95">
                    + Add Prescription
                  </button>
                </div>

                {prescriptions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="text-5xl mb-3">💊</div>
                    <h3 className="text-gray-700 font-bold mb-2">No prescriptions yet</h3>
                    <p className="text-gray-400 text-sm mb-6">Your prescriptions from your vet will appear here.</p>
                    <button onClick={() => setFormOpen(true)}
                      className="bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-teal-500 transition active:scale-95">
                      + Add Prescription
                    </button>
                  </div>
                ) : (
                  prescriptions.map(rx => (
                    <PrescriptionCard key={rx._id}
                      prescription={rx}
                      onRefill={() => console.log('Refill requested:', rx.medicineName)}
                      onDelete={fetchPrescriptions}
                    />
                  ))
                )}
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-base font-bold text-gray-800 mb-4">Summary</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Total Prescriptions', value: String(prescriptions.length), color: 'bg-sky-50 text-sky-700' },
                      { label: 'Active',              value: String(prescriptions.length), color: 'bg-green-50 text-green-700' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-500">{s.label}</span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-teal-600 rounded-2xl p-6 text-white">
                  <div className="text-3xl mb-3">🏥</div>
                  <h3 className="font-bold text-lg mb-1">Your Provider</h3>
                  <p className="text-teal-100 text-sm mb-4">Contact your veterinary partner for support.</p>
                  <button onClick={() => alert('Contacting provider...')}
                    className="w-full py-2.5 rounded-full bg-white text-teal-700 text-sm font-bold hover:bg-teal-50 transition active:scale-95">
                    Contact Provider
                  </button>
                </div>

                <button onClick={() => navigate('/')}
                  className="w-full py-3 rounded-full border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:border-gray-300 hover:text-gray-700 transition active:scale-95">
                  ← Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Prescription modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !submitting && setFormOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Prescription</h3>
            <form onSubmit={handleAddPrescription} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine name *</label>
                <input type="text" value={form.medicineName} onChange={e => setForm(f => ({ ...f, medicineName: e.target.value }))}
                  placeholder="e.g. Amoxicillin" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                <input type="text" value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
                  placeholder="e.g. 10mg twice daily" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital / Provider</label>
                <input type="text" value={form.hospital} onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))}
                  placeholder="Optional"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry date</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => !submitting && setFormOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-500 transition disabled:opacity-60">
                  {submitting ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}