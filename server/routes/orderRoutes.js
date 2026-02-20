import express from 'express'
import { getMyOrders, createOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController.js'
import { authMiddleware, adminMiddleware } from '../Middleware/authMiddleware.js'
import { validate, createOrderSchema, updateOrderStatusSchema } from '../validators/index.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/my', getMyOrders)
router.post('/', validate(createOrderSchema), createOrder)

router.get('/', adminMiddleware, getAllOrders)
router.put('/:id/status', adminMiddleware, validate(updateOrderStatusSchema), updateOrderStatus)

export default router
