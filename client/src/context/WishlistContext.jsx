import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

const STORAGE_KEY = 'focopet_wishlist'

function toId(p) {
  const v = p?._id ?? p?.id
  return v != null ? String(v) : null
}

export const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const prevUserRef = useRef(null)

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        setWishlist(stored ? JSON.parse(stored) : [])
      } catch {
        setWishlist([])
      }
      return
    }
    try {
      const { data } = await api.get('/wishlist')
      const items = Array.isArray(data) ? data : []
      setWishlist(items)
    } catch {
      // Keep existing state on fetch failure (don't overwrite with [])
    }
  }, [user])

  useEffect(() => {
    if (!user && wishlist.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
    }
  }, [user, wishlist])

  useEffect(() => {
    const wasGuest = prevUserRef.current === null
    const nowLoggedIn = user !== null
    prevUserRef.current = user

    if (nowLoggedIn && wasGuest) {
      const stored = localStorage.getItem(STORAGE_KEY)
      const localItems = stored ? JSON.parse(stored) : []
      if (localItems.length > 0) {
        Promise.all(
          localItems.map(p => {
            const id = toId(p)
            return id ? api.post('/wishlist', { productId: id }).catch(() => null) : Promise.resolve(null)
          })
        ).then(() => {
          localStorage.removeItem(STORAGE_KEY)
          fetchWishlist()
        })
        return
      }
    }
    fetchWishlist()
  }, [user, fetchWishlist])

  const addToWishlist = async (product) => {
    const id = toId(product)
    if (!id) return
    if (wishlist.some(p => toId(p) === id)) return

    if (user) {
      try {
        await api.post('/wishlist', {
          productId: id,
          productSnapshot: {
            name: product?.name,
            price: product?.price,
            discount: product?.discount,
            image: product?.image,
            category: product?.category,
            species: product?.species,
            description: product?.description,
          },
        })
        await fetchWishlist()
      } catch (err) {
        const msg = err?.response?.data?.message
        if (msg) console.warn('Wishlist add failed:', msg)
        setWishlist(prev => {
          if (prev.some(p => toId(p) === id)) return prev
          return [...prev, { ...product, _id: id, id }]
        })
      }
    } else {
      setWishlist(prev => [...prev, { ...product, _id: id, id }])
    }
  }

  const removeFromWishlist = async (id) => {
    const sid = id != null ? String(id) : null
    if (!sid) return
    setWishlist(prev => prev.filter(p => toId(p) !== sid))
    if (user) {
      try {
        await api.delete(`/wishlist/${sid}`)
        await fetchWishlist()
      } catch {
        fetchWishlist()
      }
    }
  }

  const isInWishlist = (id) => {
    if (id == null) return false
    const sid = String(id)
    return wishlist.some(p => toId(p) === sid)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
