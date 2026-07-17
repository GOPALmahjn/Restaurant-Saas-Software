import express from 'express';
import {
  getRestaurant,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  generateQRCode,
  generateAllTableQRCodes,
  uploadRestaurantImages,
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadImages, uploadLogo } from '../middleware/upload.js';

const router = express.Router();

router.get('/slug/:slug', getRestaurant);
router.get('/:id', getRestaurantById);
router.post('/', protect, authorize('admin', 'superadmin'), createRestaurant);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateRestaurant);
router.get('/:id/qr-codes', protect, authorize('admin', 'superadmin'), generateAllTableQRCodes);
router.get('/:restaurantId/qr/:tableNumber', generateQRCode);
router.post('/:id/images', protect, authorize('admin', 'superadmin'), uploadLogo.fields([{ name: 'logo' }, { name: 'cover' }]), uploadRestaurantImages);

export default router;
