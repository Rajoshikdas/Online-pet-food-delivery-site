import Joi from 'joi'

const VALID_SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'fish', 'all']

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required()
    .messages({
      'string.empty': 'Product name is required',
      'string.max': 'Product name must be at most 200 characters',
    }),
  description: Joi.string().max(2000).allow('').default(''),
  price: Joi.number().positive().required()
    .messages({
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required',
    }),
  discount: Joi.number().min(0).max(100).default(0),
  category: Joi.string().trim().min(1).max(100).required()
    .messages({
      'string.empty': 'Category is required',
    }),
  species: Joi.string().valid(...VALID_SPECIES).default('all'),
  image: Joi.string().allow('').default(''),
  stock: Joi.number().integer().min(0).default(100),
  dosage: Joi.string().max(500).allow('').default(''),
  ingredients: Joi.array().items(Joi.string()).default([]),
  usage: Joi.string().max(500).allow('').default(''),
})

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200),
  description: Joi.string().max(2000).allow(''),
  price: Joi.number().positive(),
  discount: Joi.number().min(0).max(100),
  category: Joi.string().trim().min(1).max(100),
  species: Joi.string().valid(...VALID_SPECIES),
  image: Joi.string().allow(''),
  stock: Joi.number().integer().min(0),
  dosage: Joi.string().max(500).allow(''),
  ingredients: Joi.array().items(Joi.string()),
  usage: Joi.string().max(500).allow(''),
})
