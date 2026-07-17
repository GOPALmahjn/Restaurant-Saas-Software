import Category from '../models/Category.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getCategories = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const categories = await Category.find({ restaurantId, isActive: true }).sort({ order: 1 });
    return successResponse(res, categories, 'Categories fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const createCategory = async (req, res) => {
  try {
    const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const lastCategory = await Category.findOne({ restaurantId: req.body.restaurantId }).sort({ order: -1 });
    const order = lastCategory ? lastCategory.order + 1 : 0;
    const image = req.file ? req.file.path : req.body.image;
    const category = await Category.create({ ...req.body, slug, order, image });
    return successResponse(res, category, 'Category created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const image = req.file ? req.file.path : req.body.image;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...(image && { image }) },
      { new: true, runValidators: true }
    );
    if (!category) return errorResponse(res, 'Category not found', 404);
    return successResponse(res, category, 'Category updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return errorResponse(res, 'Category not found', 404);
    return successResponse(res, null, 'Category deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    await Promise.all(
      categories.map(({ id, order }) => Category.findByIdAndUpdate(id, { order }))
    );
    return successResponse(res, null, 'Categories reordered successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
