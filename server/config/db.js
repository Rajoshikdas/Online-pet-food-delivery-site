import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('MongoDB connection error: MONGO_URI is not set in .env')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`)
    if (err.message?.includes('bad auth')) {
      console.error('Tip: If your Atlas password has special chars (@, #, :, etc.), URL-encode them (e.g. @ → %40)')
    }
    process.exit(1)
  }
}

export default connectDB