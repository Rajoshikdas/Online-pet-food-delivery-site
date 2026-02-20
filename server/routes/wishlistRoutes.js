import express from 'express'
import { getMyWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js'
import { authMiddleware } from '../Middleware/authMiddleware.js'
import { validate, addToWishlistSchema } from '../validators/index.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getMyWishlist)
router.post('/', validate(addToWishlistSchema), addToWishlist)
router.delete('/:productId', removeFromWishlist)

export default router
