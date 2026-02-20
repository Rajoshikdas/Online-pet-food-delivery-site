import uploadBufferToCloudinary from '../utils/uploadToCloudinary.js'

/**
 * POST /api/upload/image
 * Expects multipart/form-data with field name "image"
 * Returns { url, secure_url } from Cloudinary
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'No image file provided' })
    }
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'pet-profiles',
    })
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({
      message: err.message || 'Failed to upload image. Please try again.',
    })
  }
}
