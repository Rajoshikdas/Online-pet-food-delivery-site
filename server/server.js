import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import User from './models/User.js'
import authRoutes from './routes/authRoutes.js'
import prescriptionRoutes from './routes/prescriptionRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import petRoutes from './routes/petRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { seedProductsIfEmpty } from './controllers/productController.js'

dotenv.config()
await connectDB()

// Create admin user if none exists (User model pre-save hashes password)
const ensureAdmin = async () => {
  const exists = await User.findOne({ role: 'admin' })
  if (!exists) {
    await User.create({
      name: 'Admin',
      email: 'admin@petfood.com',
      password: 'Admin123',
      role: 'admin',
    })
    console.log('Admin user created: admin@petfood.com')
  }
}
await ensureAdmin()

// Seed products if DB has none (so Products page shows data)
await seedProductsIfEmpty()

const app = express()

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'https://your-frontend-render-url.onrender.com'], credentials: true }))
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth',          authRoutes)
app.use('/api/prescriptions', prescriptionRoutes)
app.use('/api/orders',        orderRoutes)
app.use('/api/products',      productRoutes)
app.use('/api/feedback',      feedbackRoutes)
app.use('/api/wishlist',      wishlistRoutes)
app.use('/api/pets',         petRoutes)
app.use('/api/upload',       uploadRoutes)

app.get('/', (_req, res) => res.json({ message: 'Pet Food API running' }))

app.use((_req, res) => res.status(404).json({ message: 'Not found', path: _req.path }))

app.use((err, _req, res, _next) => {
  const msg = err?.message || err?.toString?.() || 'Internal server error'
  console.error('Server error:', msg)
  if (err?.stack) console.error(err.stack)
  res.status(500).json({ message: msg })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))