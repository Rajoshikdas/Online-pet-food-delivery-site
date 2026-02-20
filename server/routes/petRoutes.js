import express from 'express'
import { getMyPets, createPet, updatePet, deletePet } from '../controllers/petController.js'
import { authMiddleware } from '../Middleware/authMiddleware.js'
import { validate, createPetSchema, updatePetSchema } from '../validators/index.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getMyPets)
router.post('/', validate(createPetSchema), createPet)
router.put('/:id', validate(updatePetSchema), updatePet)
router.delete('/:id', deletePet)

export default router
