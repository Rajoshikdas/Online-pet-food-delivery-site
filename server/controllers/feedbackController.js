import Feedback from '../models/Feedback.js'

export const getPublicFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).limit(20).lean()
    res.json(feedback)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createFeedback = async (req, res) => {
  try {
    const { name, role, rating, text } = req.body
    const feedback = await Feedback.create({
      user: req.user._id,
      name: name || req.user.name || 'Anonymous',
      role: role || 'Pet Owner',
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      text,
    })
    res.status(201).json(feedback)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    res.json(feedback)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
