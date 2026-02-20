import Joi from 'joi'

export const createFeedbackSchema = Joi.object({
  name: Joi.string().trim().max(100).allow('').default(''),
  role: Joi.string().trim().max(100).allow('').default('Pet Owner'),
  rating: Joi.number().integer().min(1).max(5).default(5),
  text: Joi.string().trim().min(1).max(1000).required()
    .messages({
      'string.empty': 'Feedback text is required',
      'string.max': 'Feedback must be at most 1000 characters',
    }),
})
