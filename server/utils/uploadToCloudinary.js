// server/utils/uploadToCloudinary.js
import streamifier from 'streamifier'
import cloudinary from './cloudinary.js'

/**
 * Uploads a buffer to Cloudinary and returns the result (promise).
 * options: e.g. { folder: "products", public_id: "optional-id" }
 */
export default function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      }
    )
    streamifier.createReadStream(buffer).pipe(uploadStream)
  })
}