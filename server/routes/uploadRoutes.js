import express from 'express'
import upload from '../Middleware/upload.js'
import { uploadImage } from '../controllers/uploadController.js'
import { authMiddleware } from '../Middleware/authMiddleware.js'

const router = express.Router()
router.use(authMiddleware)

router.post('/image', upload.single('image'), uploadImage)

export default router
