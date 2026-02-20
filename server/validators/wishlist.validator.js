import Joi from 'joi'

const productSnapshotSchema = Joi.object({
  name: Joi.string().default('Unknown Product'),
  price: Joi.number().default(0),
  discount: Joi.number().default(0),
  image: Joi.string().allow('').default(''),
  category: Joi.string().allow('').default(''),
  species: Joi.string().allow('').default('all'),
  description: Joi.string().allow('').default(''),
}).unknown(true)

export const addToWishlistSchema = Joi.object({
  productId: Joi.string().required()
    .messages({
      'string.empty': 'Product ID is required',
      'any.required': 'Product ID is required',
    }),
  productSnapshot: productSnapshotSchema.optional(),
})
