import express from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus, getOrderByNumber, validateCoupon } from '../controllers/orderController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/restaurant/:restaurantId', protect, authorize('admin', 'superadmin'), getOrders);
router.get('/track/:orderNumber', getOrderByNumber);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('admin', 'superadmin'), updateOrderStatus);
router.post('/validate-coupon', validateCoupon);

export default router;
