import express from 'express';
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  upload3DModel,
  trackARView,
  getFeaturedItems,
  getRecommendedItems,
} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadImages, uploadModel } from '../middleware/upload.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', getMenuItems);
router.get('/restaurant/:restaurantId/featured', getFeaturedItems);
router.get('/restaurant/:restaurantId/recommended', getRecommendedItems);
router.get('/:id', getMenuItem);
router.post('/', protect, authorize('admin', 'superadmin'), uploadImages.fields([{ name: 'images', maxCount: 5 }]), createMenuItem);
router.put('/:id', protect, authorize('admin', 'superadmin'), uploadImages.fields([{ name: 'images', maxCount: 5 }]), updateMenuItem);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteMenuItem);
router.post('/:id/model', protect, authorize('admin', 'superadmin'), uploadModel.fields([{ name: 'glb' }, { name: 'usdz' }, { name: 'poster' }]), upload3DModel);
router.post('/:id/ar-view', trackARView);

export default router;
