import express from 'express';
import { getReviews, createReview, deleteReview } from '../controllers/reviewController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { uploadImages } from '../middleware/upload.js';

const router = express.Router();

router.get('/menu-item/:menuItemId', getReviews);
router.post('/', optionalAuth, uploadImages.array('images', 3), createReview);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteReview);

export default router;
