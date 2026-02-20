import ProductReview from '../models/ProductReview.js'

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ product: req.params.productId })
      .sort({ createdAt: -1 })
      .lean()
    const count = reviews.length
    const avgRating = count > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
      : null
    res.json({ reviews, avgRating, count })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const productId = req.params.productId

    const existing = await ProductReview.findOne({ product: productId, user: req.user._id })
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product' })
    }

    const review = await ProductReview.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name || 'Anonymous',
      rating: Number(rating),
      comment: comment || '',
    })
    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
