import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  discount:    { type: Number, default: 0 },
  category:    { type: String, required: true, trim: true },
  species:     { type: String, enum: ['dog', 'cat', 'bird', 'rabbit', 'fish', 'all'], default: 'all' },
  image:       { type: String, default: '' },
  stock:       { type: Number, default: 100 },
  dosage:      { type: String, default: '' },
  ingredients: { type: [String], default: [] },
  usage:       { type: String, default: '' },
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text', category: 'text' })

export default mongoose.model('Product', productSchema)