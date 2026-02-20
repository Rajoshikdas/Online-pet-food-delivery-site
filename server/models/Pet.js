import mongoose from 'mongoose'

const petSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:      { type: String, required: true, trim: true },
  species:   { type: String, enum: ['dog', 'cat', 'bird', 'rabbit', 'fish'], required: true },
  breed:     { type: String, trim: true, default: '' },
  age:       { type: String, trim: true, default: '' },
  birthday:  { type: Date, default: null },
  gender:    { type: String, enum: ['female', 'male', ''], default: '' },
  neutered:  { type: Boolean, default: null },
  weight:    { type: String, trim: true, default: '' },
  dietaryNotes: { type: String, trim: true, default: '' },
  image:     { type: String, default: '' },
}, { timestamps: true })

petSchema.index({ user: 1 })

export default mongoose.model('Pet', petSchema)
