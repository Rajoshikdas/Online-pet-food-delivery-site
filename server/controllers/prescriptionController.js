import Prescription from '../models/Prescription.js'

export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(prescriptions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createPrescription = async (req, res) => {
  try {
    const { medicineName, dosage, hospital, expiryDate } = req.body
    const prescription = await Prescription.create({
      user: req.user._id,
      medicineName,
      dosage,
      hospital: hospital || '',
      expiryDate: expiryDate || null,
    })
    res.status(201).json(prescription)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' })
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
