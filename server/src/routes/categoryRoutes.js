import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory, reorderCategories } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadImages } from '../middleware/upload.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', getCategories);
router.post('/', protect, authorize('admin', 'superadmin'), uploadImages.single('image'), createCategory);
router.put('/reorder', protect, authorize('admin', 'superadmin'), reorderCategories);
router.put('/:id', protect, authorize('admin', 'superadmin'), uploadImages.single('image'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteCategory);

export default router;
