import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  productId: { type: String, default: null },
  productSnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true })

wishlistSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true })
wishlistSchema.index({ user: 1, productId: 1 }, { unique: true, sparse: true })

export default mongoose.model('Wishlist', wishlistSchema)
