import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from '../../../config/db.js'
import authRoutes from '../../../routes/authRoutes.js'
import prescriptionRoutes from '../../../routes/prescriptionRoutes.js'
import orderRoutes from '../../../routes/orderRoutes.js'
import productRoutes from '../../../routes/productRoutes.js'
import feedbackRoutes from '../../../routes/feedbackRoutes.js'
import wishlistRoutes from '../../../routes/wishlistRoutes.js'
import petRoutes from '../../../routes/petRoutes.js'
import uploadRoutes from '../../../routes/uploadRoutes.js'

dotenv.config()

const app = express()

app.use(cors({ origin: ['https://your-netlify-site.netlify.app'], credentials: true }))
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/prescriptions', prescriptionRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/products', productRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/pets', petRoutes)
app.use('/api/upload', uploadRoutes)

export const handler = app
