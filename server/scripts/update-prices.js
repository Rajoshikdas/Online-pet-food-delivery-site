/**
 * Migration: Add ₹100 to all product prices in the database.
 * Run from server folder: node scripts/update-prices.js
 */
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

dotenv.config()

const INCREMENT = 100

async function updatePrices() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('MONGO_URI is not set in .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
    console.log('Connected to MongoDB\n')

    const products = await Product.find({})
    if (products.length === 0) {
      console.log('No products found in the database.')
      process.exit(0)
    }

    console.log(`Found ${products.length} product(s). Adding ₹${INCREMENT} to each price...\n`)

    let updated = 0
    for (const p of products) {
      const oldPrice = p.price
      const newPrice = Math.round((oldPrice + INCREMENT) * 100) / 100
      await Product.findByIdAndUpdate(p._id, { price: newPrice })
      console.log(`  ${p.name.slice(0, 50).padEnd(52)} ₹${oldPrice} → ₹${newPrice}`)
      updated++
    }

    console.log(`\n✓ Updated ${updated} product(s)`)
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
    process.exit(0)
  }
}

updatePrices()
