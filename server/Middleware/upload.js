// server/Middleware/upload.js
import multer from 'multer'

// Use memory storage so file buffer is available without writing to disk
const storage = multer.memoryStorage()

const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]
const fileFilter = (req, file, cb) => {
  const mime = (file.mimetype || '').toLowerCase()
  const allowed = mime.startsWith('image/') || ALLOWED_MIMETYPES.includes(mime)
  if (!allowed) {
    cb(new Error('Invalid file type. Supported: JPEG, PNG, WebP, AVIF, GIF.'), false)
  } else {
    cb(null, true)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

export default upload