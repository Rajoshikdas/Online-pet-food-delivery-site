import express from 'express'
import {
  getGroupedProducts,
  getProducts,
  getCategories,
  getProductById,
  seedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { getProductReviews, createProductReview } from '../controllers/productReviewController.js'
import { authMiddleware, adminMiddleware } from '../Middleware/authMiddleware.js'
import { validate, createProductSchema, updateProductSchema, createProductReviewSchema } from '../validators/index.js'

const router = express.Router()
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

router.get('/list', getProducts)
router.get('/', getGroupedProducts)
router.get('/categories', getCategories)
router.get('/:id/reviews', getProductReviews)
router.get('/:id', getProductById)
router.post('/:id/reviews', authMiddleware, validate(createProductReviewSchema), createProductReview)
router.post('/', authMiddleware, adminMiddleware, validate(createProductSchema), asyncHandler(createProduct))
router.put('/:id', authMiddleware, adminMiddleware, validate(updateProductSchema), asyncHandler(updateProduct))
router.delete('/:id', authMiddleware, adminMiddleware, asyncHandler(deleteProduct))
router.post('/seed', authMiddleware, adminMiddleware, asyncHandler(seedProducts))

export default router
