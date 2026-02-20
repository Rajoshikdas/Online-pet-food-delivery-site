/**
 * Removes the legacy `rating` field from all Product documents.
 * Run once: node scripts/remove-product-ratings.js
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'
import connectDB from '../config/db.js'

dotenv.config()
await connectDB()
const result = await Product.updateMany({}, { $unset: { rating: '' } })
console.log(`Removed rating field from ${result.modifiedCount} products`)
process.exit(0)
