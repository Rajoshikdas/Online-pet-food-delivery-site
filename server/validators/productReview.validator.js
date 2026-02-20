import Joi from 'joi'

export const createProductReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required()
    .messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5',
      'any.required': 'Rating is required',
    }),
  comment: Joi.string().trim().max(1000).allow('').default(''),
})
