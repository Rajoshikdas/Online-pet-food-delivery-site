import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const STEPS = [
  { label: 'Pet basics', id: 'pet' },
  { label: 'Vet details', id: 'vet' },
  { label: 'Confirm', id: 'confirm' },
]

const PET_TYPES = [
  { id: 'dog', label: 'Dog', emoji: '🐕', breeds: ['Labrador', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Poodle', 'Beagle', 'Husky', 'Shih Tzu', 'Other'] },
  { id: 'cat', label: 'Cat', emoji: '🐈', breeds: ['Persian', 'Siamese', 'Maine Coon', 'Ragdoll', 'Bengal', 'Abyssinian', 'Sphynx', 'British Shorthair', 'Other'] },
  { id: 'bird', label: 'Bird', emoji: '🐦', breeds: ['Budgerigar', 'Cockatiel', 'Parrot', 'Lovebird', 'Canary', 'Finch', 'Macaw', 'Cockatoo', 'Other'] },
  { id: 'rabbit', label: 'Rabbit', emoji: '🐇', breeds: ['Holland Lop', 'Mini Rex', 'Netherland Dwarf', 'Lionhead', 'Flemish Giant', 'Angora', 'Rex', 'Other'] },
  { id: 'fish', label: 'Fish', emoji: '🐠', breeds: ['Goldfish', 'Betta', 'Guppy', 'Neon Tetra', 'Oscar', 'Angelfish', 'Clownfish', 'Koi', 'Other'] },
]

const WEIGHT_OPTIONS = {
  dog: ['0–10 lbs', '10–25 lbs', '25–50 lbs', '50–100 lbs', '100+ lbs'],
  cat: ['Under 5 lbs', '5–10 lbs', '10–15 lbs', '15+ lbs'],
  bird: ['Under 100g', '100–500g', '500g–1kg', '1kg+'],
  rabbit: ['Under 2 lbs', '2–5 lbs', '5–10 lbs', '10+ lbs'],
  fish: ['Small (< 3in)', 'Medium (3–6in)', 'Large (6–12in)', 'XL (12in+)'],
}

const SHOW_GENDER = (type) => ['dog', 'cat', 'rabbit'].includes(type)
const SHOW_NEUTERED = (type) => ['dog', 'cat', 'rabbit'].includes(type)

export default function Onboarding() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const editPet = location.state?.editPet

  const [petType, setPetType] = useState(null)
  const [form, setForm] = useState({
    name: '', breed: '', birthday: '', gender: 'female', neutered: 'yes', weight: '', image: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (editPet) {
      const type = PET_TYPES.find(t => t.id === editPet.species)
      setPetType(type || PET_TYPES[0])
      const weightOpts = WEIGHT_OPTIONS[editPet.species] || WEIGHT_OPTIONS.dog
      setForm({
        name: editPet.name || '',
        breed: editPet.breed || '',
        birthday: editPet.birthday ? (typeof editPet.birthday === 'string' ? editPet.birthday : editPet.birthday.split('T')[0]) : '',
        gender: editPet.gender || 'female',
        neutered: editPet.neutered === true ? 'yes' : editPet.neutered === false ? 'no' : 'yes',
        weight: editPet.weight || weightOpts[0],
        image: editPet.image || '',
      })
    }
  }, [user, navigate, editPet])

  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleImageUpload = async (e) => {
    const file = e?.target?.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setUploadingImage(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await api.post('/upload/image', fd)
      set('image', data.url || data.secure_url)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const selectPetType = (type) => {
    setPetType(type)
    setForm(p => ({ ...p, weight: WEIGHT_OPTIONS[type.id][0], breed: '', gender: 'female', neutered: 'yes' }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!petType && !editPet) return setError('Please select a pet type')
    if (!form.name.trim()) return setError('Pet name is required')
    const species = petType?.id || editPet?.species
    if (!species) return setError('Species is required')
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, species, neutered: form.neutered === 'yes', image: form.image || undefined }
      if (editPet) {
        await api.put(`/pets/${editPet._id}`, payload)
      } else {
        await api.post('/pets', payload)
      }
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save pet. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex mt-16" style={{ minHeight: 'calc(100vh - 64px)' }}>

        {/* LEFT SIDEBAR */}
        <div style={{ width: '260px', minWidth: '260px', backgroundColor: '#4a4a6a' }}
          className="hidden md:flex flex-col justify-between py-10 px-7">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <span className="text-white text-2xl">🐾</span>
              <span className="text-white font-black text-sm tracking-widest uppercase">FocoPet</span>
            </div>
            <ol className="flex flex-col gap-7">
              {STEPS.map((step, idx) => {
                const ACTIVE = 0
                const isActive = idx === ACTIVE
                const isDone = idx < ACTIVE
                return (
                  <li key={step.id} className="flex items-center gap-3">
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      border: isActive ? '2px solid white' : isDone ? '2px solid rgba(255,255,255,0.5)' : '2px solid rgba(255,255,255,0.2)',
                      backgroundColor: isActive ? 'white' : isDone ? 'rgba(255,255,255,0.2)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isDone && <svg style={{ width: '11px', height: '11px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      {isActive && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4a4a6a' }} />}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: isActive ? '700' : '400', color: isActive ? 'white' : 'rgba(255,255,255,0.4)' }}>
                      {step.label}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="flex justify-center">
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px', transition: 'all 0.3s', overflow: 'hidden' }}>
              {form.image ? (
                <img src={form.image} alt="Pet" className="w-full h-full object-cover" />
              ) : (
                <span>{petType ? petType.emoji : '🐾'}</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 bg-white flex items-start justify-center px-6 md:px-12 py-10 overflow-y-auto">
          <div className="w-full max-w-2xl">

            {!petType && !editPet ? (
              <>
                <h1 className="text-3xl font-black text-gray-900 leading-snug mb-2">
                  What kind of pet do you have?
                </h1>
                <p className="text-gray-400 text-sm mb-8">Select your pet to get started with the right products.</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {PET_TYPES.map(type => (
                    <button key={type.id} onClick={() => selectPetType(type)}
                      className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-100 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 active:scale-95 group">
                      <span className="text-5xl group-hover:scale-110 transition-transform">{type.emoji}</span>
                      <span className="text-sm font-bold text-gray-700">{type.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                  <button onClick={() => navigate('/')}
                    className="px-7 py-3 rounded-full border-2 border-gray-200 text-sm font-semibold text-gray-500 hover:border-gray-400 transition active:scale-95">
                    ← Back
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => { if (!editPet) { setPetType(null); setError('') } else navigate('/profile') }}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition font-bold shrink-0">
                    ←
                  </button>
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">
                      {editPet ? 'Edit' : 'Tell us about your'} {petType?.label?.toLowerCase() || editPet?.species} {petType?.emoji || '🐾'}
                    </h1>
                    <p className="text-gray-400 text-sm">Fill in the basic details for your pet.</p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        {(petType || editPet)?.label || ''} Name *
                      </label>
                      <input name="name" type="text" value={form.name} onChange={handleChange}
                        placeholder="My pet's name…" required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-400 transition" />
                    </div>
                    <div className="flex flex-col justify-end">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 font-medium hover:border-slate-400 hover:text-slate-500 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                        {uploadingImage ? '⏳ Uploading…' : form.image ? '✓ Photo uploaded' : '📷 Upload photo'}
                      </button>
                      {form.image && (
                        <img src={form.image} alt="Pet" className="mt-2 w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Breed</label>
                      <select name="breed" value={form.breed} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-400 transition bg-white">
                        <option value="">Select breed…</option>
                        {(petType ? PET_TYPES.find(p => p.id === petType.id) : editPet ? PET_TYPES.find(p => p.id === editPet.species) : PET_TYPES[0])?.breeds?.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        {(petType?.id || editPet?.species) === 'fish' ? 'Acquired Date' : 'Birthday'}
                      </label>
                      <input name="birthday" type="date" value={form.birthday} onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition" />
                    </div>
                  </div>

                  {SHOW_GENDER(petType?.id || editPet?.species) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2">Gender</label>
                        <div className="flex gap-2">
                          {['female', 'male'].map(g => (
                            <button key={g} type="button" onClick={() => set('gender', g)}
                              style={{ flex: 1, padding: '9px 0', borderRadius: '999px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: form.gender === g ? '#4a4a6a' : '#f3f4f6', color: form.gender === g ? 'white' : '#6b7280' }}>
                              {g === 'female' ? '♀ Female' : '♂ Male'}
                            </button>
                          ))}
                        </div>
                      </div>
                      {SHOW_NEUTERED(petType?.id || editPet?.species) && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-2">
                            {(petType?.id || editPet?.species) === 'rabbit' ? 'Spayed/Neutered' : 'Spayed or Neutered'}
                          </label>
                          <div className="flex gap-2">
                            {['yes', 'no'].map(n => (
                              <button key={n} type="button" onClick={() => set('neutered', n)}
                                style={{ flex: 1, padding: '9px 0', borderRadius: '999px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: form.neutered === n ? '#4a4a6a' : '#f3f4f6', color: form.neutered === n ? 'white' : '#6b7280' }}>
                                {n === 'yes' ? 'Yes' : 'No'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">
                      {(petType?.id || editPet?.species) === 'fish' ? 'Size' : (petType?.id || editPet?.species) === 'bird' ? 'Weight' : 'Weight'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(WEIGHT_OPTIONS[petType?.id || editPet?.species] || WEIGHT_OPTIONS.dog).map(w => (
                        <button key={w} type="button" onClick={() => set('weight', w)}
                          style={{ padding: '9px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: form.weight === w ? '#4a4a6a' : '#f3f4f6', color: form.weight === w ? 'white' : '#6b7280' }}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button type="button" onClick={() => { if (!editPet) { setPetType(null); setError('') } else navigate('/profile') }}
                      className="px-8 py-3 rounded-full border-2 border-gray-200 text-sm font-semibold text-gray-500 hover:border-gray-400 transition active:scale-95">
                      ← Back
                    </button>
                    <button type="submit" disabled={loading}
                      className="px-10 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition shadow-md active:scale-95 disabled:opacity-60">
                      {loading ? 'Saving…' : editPet ? 'Update Pet →' : 'Save Pet →'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
