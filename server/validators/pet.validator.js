import Joi from 'joi'

const VALID_SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'fish']
const VALID_GENDERS = ['female', 'male', '']

export const createPetSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required()
    .messages({
      'string.empty': 'Pet name is required',
      'string.max': 'Pet name must be at most 50 characters',
    }),
  species: Joi.string().valid(...VALID_SPECIES).required()
    .messages({
      'any.only': `Species must be one of: ${VALID_SPECIES.join(', ')}`,
      'any.required': 'Species is required',
    }),
  breed: Joi.string().trim().max(50).allow('').default(''),
  age: Joi.string().trim().max(20).allow('').default(''),
  birthday: Joi.alternatives()
    .try(Joi.date(), Joi.string().allow('', null))
    .default(null),
  gender: Joi.string().valid(...VALID_GENDERS).default(''),
  neutered: Joi.alternatives()
    .try(
      Joi.boolean(),
      Joi.string().valid('yes', 'no', '')
    )
    .default(null),
  weight: Joi.string().trim().max(20).allow('').default(''),
  dietaryNotes: Joi.string().trim().max(500).allow('').default(''),
  image: Joi.string().allow('').default(''),
})

export const updatePetSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50),
  species: Joi.string().valid(...VALID_SPECIES),
  breed: Joi.string().trim().max(50).allow(''),
  age: Joi.string().trim().max(20).allow(''),
  birthday: Joi.alternatives()
    .try(Joi.date(), Joi.string().allow('', null)),
  gender: Joi.string().valid(...VALID_GENDERS),
  neutered: Joi.alternatives()
    .try(
      Joi.boolean(),
      Joi.string().valid('yes', 'no', '')
    ),
  weight: Joi.string().trim().max(20).allow(''),
  dietaryNotes: Joi.string().trim().max(500).allow(''),
  image: Joi.string().allow(''),
})
