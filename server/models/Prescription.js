import mongoose from 'mongoose'

const prescriptionSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineName: { type: String, required: true, trim: true },
  dosage:       { type: String, required: true },
  hospital:     { type: String, trim: true },
  expiryDate:   { type: Date },
}, { timestamps: true })

export default mongoose.model('Prescription', prescriptionSchema)