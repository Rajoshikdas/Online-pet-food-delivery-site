import Joi from 'joi'

export const createPrescriptionSchema = Joi.object({
  medicineName: Joi.string().trim().min(1).max(200).required()
    .messages({
      'string.empty': 'Medicine name is required',
      'string.max': 'Medicine name must be at most 200 characters',
    }),
  dosage: Joi.string().trim().min(1).max(200).required()
    .messages({
      'string.empty': 'Dosage is required',
      'string.max': 'Dosage must be at most 200 characters',
    }),
  hospital: Joi.string().trim().max(200).allow('').default(''),
  expiryDate: Joi.alternatives()
    .try(Joi.date(), Joi.string().allow('', null))
    .default(null),
})
