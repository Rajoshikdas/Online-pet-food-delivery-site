import mongoose from 'mongoose'

const productReviewSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, default: '' },
}, { timestamps: true })

productReviewSchema.index({ product: 1 })

export default mongoose.model('ProductReview', productReviewSchema)
