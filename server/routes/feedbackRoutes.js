import express from 'express'
import { createFeedback, getAllFeedback, getPublicFeedback } from '../controllers/feedbackController.js'
import { authMiddleware, adminMiddleware } from '../Middleware/authMiddleware.js'
import { validate, createFeedbackSchema } from '../validators/index.js'

const router = express.Router()

router.get('/public', getPublicFeedback)
router.post('/', authMiddleware, validate(createFeedbackSchema), createFeedback)
router.post('/submit', authMiddleware, validate(createFeedbackSchema), createFeedback)
router.get('/', authMiddleware, adminMiddleware, getAllFeedback)

export default router
