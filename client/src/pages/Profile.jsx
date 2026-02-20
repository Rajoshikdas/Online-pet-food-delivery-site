import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const SPECIES_EMOJI = { dog: '🐕', cat: '🐈', bird: '🐦', rabbit: '🐇', fish: '🐠' }
const SPECIES_LABEL = { dog: 'Dog', cat: 'Cat', bird: 'Bird', rabbit: 'Rabbit', fish: 'Fish' }
const SPECIES_BG = {
  dog: 'from-[#ffd4e5] to-[#ff579f]',
  cat: 'from-[#ffe0ed] to-[#ff579f]',
  bird: 'from-[#ffd4e5] to-[#ff579f]',
  rabbit: 'from-[#ffe0ed] to-[#ff579f]',
  fish: 'from-[#ffd4e5] to-[#ff579f]',
}

function InfoCell({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 text-base">{icon}</div>
      <div>
        <div className="text-xs text-gray-400 font-medium mb-0.5">{label}</div>
        <div className="text-sm text-gray-800 font-semibold capitalize">{value || '—'}</div>
      </div>
    </div>
  )
}

function PetProfileCard({ pet, onDelete, isFirst }) {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const species = pet?.species || 'dog'
  const emoji = SPECIES_EMOJI[species] || '🐾'
  const bgGradient = SPECIES_BG[species] || 'from-[#ffd4e5] to-[#ff579f]'

  const formatDate = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'

  const handleDelete = async () => {
    if (!confirm(`Remove ${pet.name} from your profile?`)) return
    setDeleting(true)
    try {
      await api.delete(`/pets/${pet._id}`)
      onDelete?.()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove pet')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mb-12">
      {/* Hero banner - flush with navbar for first pet */}
      <div className={`relative w-full h-72 bg-gradient-to-r ${bgGradient} flex items-center justify-center overflow-hidden ${isFirst ? 'rounded-b-2xl' : 'rounded-t-2xl'}`}>
        {isFirst && (
          <div className="absolute top-5 left-5 flex items-center gap-3 z-10">
            <Link to="/" className="w-9 h-9 rounded-full bg-pink-300/50 hover:bg-pink-400/60 flex items-center justify-center text-gray-700 text-base font-bold transition shrink-0">
              ←
            </Link>
            <span className="text-xl font-bold text-gray-700">My Pet</span>
          </div>
        )}
        <div className="w-40 h-40 rounded-full bg-white/40 flex items-center justify-center overflow-hidden shadow-xl border-2 border-white/60 shrink-0">
          {pet.image ? (
            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-7xl">{emoji}</span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800/30 to-transparent" />
        <div className="absolute bottom-5 left-8 z-10">
          <h1 className="text-gray-800 text-3xl font-black drop-shadow-sm">{pet.name}</h1>
          <p className="text-gray-600 text-sm font-medium">
            {SPECIES_LABEL[species]} {pet.breed ? `· ${pet.breed}` : ''}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-800">Basic Info</h3>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/onboarding', { state: { editPet: pet } })}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-500 transition px-3 py-1 rounded-full border border-teal-200 hover:bg-teal-50">
                    Edit
                  </button>
                  <button onClick={handleDelete} disabled={deleting}
                    className="text-xs font-semibold text-red-600 hover:text-red-500 transition px-3 py-1 rounded-full border border-red-200 hover:bg-red-50 disabled:opacity-50">
                    Remove
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <InfoCell label="Name" value={pet.name} icon="🏷️" />
                <InfoCell label="Species" value={SPECIES_LABEL[species]} icon={emoji} />
                {pet.breed && <InfoCell label="Breed" value={pet.breed} icon={emoji} />}
                {pet.gender && <InfoCell label="Sex" value={pet.gender} icon="⚥" />}
                {pet.birthday && <InfoCell label="Birthday" value={formatDate(pet.birthday)} icon="🎂" />}
                {pet.weight && <InfoCell label="Weight / Size" value={pet.weight} icon="⚖️" />}
                {pet.neutered !== undefined && pet.neutered !== null && ['dog', 'cat', 'rabbit'].includes(species) && (
                  <InfoCell label="Neutered / Spayed" value={pet.neutered ? 'Yes' : 'No'} icon="💊" />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">Quick Stats</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Pet Type</span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-700">
                    {emoji} {SPECIES_LABEL[species]}
                  </span>
                </div>
                {pet.weight && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Weight</span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">{pet.weight}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/prescriptions')}
                className="w-full py-3 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-500 transition active:scale-95">
                💊 View Prescriptions
              </button>
              <button onClick={() => navigate(`/products?species=${species}`)}
                className="w-full py-3 rounded-full bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-300 transition active:scale-95">
                🛍️ Shop for {SPECIES_LABEL[species]}
              </button>
              <button onClick={() => navigate('/onboarding', { state: { editPet: pet } })}
                className="w-full py-3 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition active:scale-95">
                ✏️ Edit Pet Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    api.get('/pets')
      .then(res => setPets(res.data || []))
      .catch(() => setPets([]))
      .finally(() => setLoading(false))
  }, [user, navigate])

  const fetchPets = () => {
    api.get('/pets').then(res => setPets(res.data || [])).catch(() => setPets([]))
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 mt-16">

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-lg animate-pulse">Loading pet profiles…</div>
          </div>
        ) : pets.length === 0 ? (
          <div className="max-w-xl mx-auto mt-24 text-center px-4">
            <div className="text-6xl mb-4">🐾</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No pet found</h2>
            <p className="text-gray-400 mb-8">You haven't added a pet yet. Let's get started!</p>
            <button onClick={() => navigate('/onboarding')}
              className="bg-gray-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-700 transition shadow-lg active:scale-95 mb-12">
              Add Your Pet →
            </button>
          </div>
        ) : (
          <div className="pb-12">
            {pets.map((pet, idx) => (
              <PetProfileCard key={pet._id} pet={pet} onDelete={fetchPets} isFirst={idx === 0} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
