import MenuItem from '../models/MenuItem.js';
import Analytics from '../models/Analytics.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

export const getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { category, type, search, sort = 'createdAt', page = 1, limit = 20, featured, available } = req.query;
    const filter = { restaurantId };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (available !== undefined) filter.isAvailable = available === 'true';
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.$text = { $search: search };
    const sortObj = {};
    if (sort === 'price') sortObj.price = 1;
    else if (sort === 'rating') sortObj.rating = -1;
    else if (sort === 'popular') sortObj.totalOrders = -1;
    else sortObj.createdAt = -1;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      MenuItem.find(filter).populate('category', 'name slug color icon').sort(sortObj).skip(skip).limit(parseInt(limit)),
      MenuItem.countDocuments(filter),
    ]);
    return paginatedResponse(res, items, total, page, limit, 'Menu items fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category', 'name slug color icon');
    if (!item) return errorResponse(res, 'Menu item not found', 404);
    return successResponse(res, item, 'Menu item fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const images = req.files?.images ? req.files.images.map((f) => f.path) : [];
    const thumbnail = images[0] || '';
    const item = await MenuItem.create({ ...req.body, slug, images, thumbnail });
    return successResponse(res, item, 'Menu item created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.files?.images) {
      const newImages = req.files.images.map((f) => f.path);
      updateData.images = [...(req.body.existingImages ? JSON.parse(req.body.existingImages) : []), ...newImages];
      updateData.thumbnail = updateData.images[0];
    }
    const item = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!item) return errorResponse(res, 'Menu item not found', 404);
    return successResponse(res, item, 'Menu item updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return errorResponse(res, 'Menu item not found', 404);
    return successResponse(res, null, 'Menu item deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const upload3DModel = async (req, res) => {
  try {
    const modelData = {};
    if (req.files?.glb) modelData['model3d.glb'] = req.files.glb[0].path;
    if (req.files?.usdz) modelData['model3d.usdz'] = req.files.usdz[0].path;
    if (req.files?.poster) modelData['model3d.poster'] = req.files.poster[0].path;
    const item = await MenuItem.findByIdAndUpdate(req.params.id, modelData, { new: true });
    if (!item) return errorResponse(res, 'Menu item not found', 404);
    return successResponse(res, item, '3D model uploaded successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const trackARView = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, { $inc: { arViews: 1 } }, { new: true });
    await updateDailyAnalytics(item.restaurantId, { arViewCount: 1 });
    return successResponse(res, null, 'AR view tracked');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getFeaturedItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const items = await MenuItem.find({ restaurantId, isFeatured: true, isAvailable: true })
      .populate('category', 'name slug')
      .limit(8);
    return successResponse(res, items, 'Featured items fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getRecommendedItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const items = await MenuItem.find({ restaurantId, isRecommended: true, isAvailable: true })
      .populate('category', 'name slug')
      .limit(6);
    return successResponse(res, items, 'Recommended items fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const updateDailyAnalytics = async (restaurantId, data) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await Analytics.findOneAndUpdate(
    { restaurantId, date: today },
    { $inc: data },
    { upsert: true, new: true }
  );
};
