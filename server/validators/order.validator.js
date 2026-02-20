import Joi from 'joi'

const orderItemSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  qty: Joi.number().integer().min(1).default(1),
  category: Joi.string().allow('').default(''),
  species: Joi.string().allow('').default(''),
})

export const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required()
    .messages({
      'array.min': 'Order must have at least one item',
      'any.required': 'Order items are required',
    }),
  total: Joi.number().positive().required()
    .messages({
      'number.positive': 'Order total must be a positive number',
      'any.required': 'Order total is required',
    }),
})

const VALID_STATUSES = ['Paid', 'Delivered', 'Completed']

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid(...VALID_STATUSES).required()
    .messages({
      'any.only': `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      'any.required': 'Status is required',
    }),
})
