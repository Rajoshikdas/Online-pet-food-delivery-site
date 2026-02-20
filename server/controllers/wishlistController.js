import Wishlist from '../models/Wishlist.js'
import Product from '../models/Product.js'

export async function getMyWishlist(req, res) {
  try {
    const userId = req.user._id
    const items = await Wishlist.find({ user: userId })
      .populate('product')
      .sort({ createdAt: -1 })
      .lean()

    const products = items.map(w => {
      if (w.product) return { ...w.product, _id: w.product._id, id: w.product._id }
      if (w.productSnapshot) return { ...w.productSnapshot, _id: w.productId, id: w.productId }
      if (w.productId) return { _id: w.productId, id: w.productId, name: 'Product', price: 0 }
      return null
    }).filter(Boolean)

    return res.json(products)
  } catch (err) {
    console.error('getMyWishlist:', err?.message)
    return res.status(500).json({ message: err?.message || 'Failed to load wishlist' })
  }
}

export async function addToWishlist(req, res) {
  try {
    const userId = req.user._id
    const { productId, productSnapshot } = req.body

    const existing = await Wishlist.findOne({
      user: userId,
      $or: [{ productId }, { product: productId }],
    })
    if (existing) return res.status(201).json(existing)

    const product = await Product.findById(productId)
    if (product) {
      const item = await Wishlist.create({ user: userId, product: product._id, productId })
      return res.status(201).json(item)
    }

    if (!productSnapshot || typeof productSnapshot !== 'object') {
      return res.status(400).json({ message: 'Product not found. Please add from the Products page.' })
    }

    const snapshot = {
      name: productSnapshot.name || 'Unknown Product',
      price: productSnapshot.price ?? 0,
      discount: productSnapshot.discount ?? 0,
      image: productSnapshot.image || '',
      category: productSnapshot.category || '',
      species: productSnapshot.species || 'all',
      description: productSnapshot.description || '',
    }
    const item = await Wishlist.create({ user: userId, productId, productSnapshot: snapshot })
    return res.status(201).json(item)
  } catch (err) {
    console.error('addToWishlist:', err?.message)
    return res.status(500).json({ message: err?.message || 'Failed to add to wishlist' })
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const userId = req.user._id
    const productId = req.params.productId

    await Wishlist.findOneAndDelete({
      user: userId,
      $or: [{ productId }, { product: productId }],
    })
    return res.json({ success: true })
  } catch (err) {
    console.error('removeFromWishlist:', err?.message)
    return res.status(500).json({ message: err?.message || 'Failed to remove from wishlist' })
  }
}
