import express from 'express'
import { getMyPrescriptions, createPrescription, deletePrescription } from '../controllers/prescriptionController.js'
import { authMiddleware } from '../Middleware/authMiddleware.js'
import { validate, createPrescriptionSchema } from '../validators/index.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getMyPrescriptions)
router.post('/', validate(createPrescriptionSchema), createPrescription)
router.delete('/:id', deletePrescription)

export default router
