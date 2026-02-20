/**
 * Joi validation middleware and exports
 */

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    const messages = error.details.map(d => d.message)
    return res.status(400).json({ message: messages.join(', ') })
  }
  req.body = value
  next()
}

export * from './auth.validator.js'
export * from './pet.validator.js'
export * from './order.validator.js'
export * from './product.validator.js'
export * from './feedback.validator.js'
export * from './prescription.validator.js'
export * from './productReview.validator.js'
export * from './wishlist.validator.js'
