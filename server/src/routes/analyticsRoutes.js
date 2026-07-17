import express from 'express';
import { getDashboardStats, getRevenueChart, getTopItems } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/restaurant/:restaurantId/dashboard', protect, authorize('admin', 'superadmin'), getDashboardStats);
router.get('/restaurant/:restaurantId/revenue', protect, authorize('admin', 'superadmin'), getRevenueChart);
router.get('/restaurant/:restaurantId/top-items', protect, authorize('admin', 'superadmin'), getTopItems);

export default router;
