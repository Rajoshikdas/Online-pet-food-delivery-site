import express from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import { authMiddleware } from '../Middleware/authMiddleware.js'
import { validate, registerSchema, loginSchema } from '../validators/index.js'

const router = express.Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', authMiddleware, getMe)

export default router
