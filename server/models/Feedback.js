import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:   { type: String, required: true, trim: true },
  role:   { type: String, trim: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  text:   { type: String, required: true, trim: true },
}, { timestamps: true })

export default mongoose.model('Feedback', feedbackSchema)
