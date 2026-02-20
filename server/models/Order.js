import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  qty:      { type: Number, default: 1 },
  category: { type: String, default: '' },
  species:  { type: String, default: '' },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:  [orderItemSchema],
  total:  { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Delivered', 'Completed'], default: 'Paid' },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)