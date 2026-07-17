import Review from '../models/Review.js';
import MenuItem from '../models/MenuItem.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

export const getReviews = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      Review.find({ menuItem: menuItemId, isApproved: true }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Review.countDocuments({ menuItem: menuItemId, isApproved: true }),
    ]);
    return paginatedResponse(res, reviews, total, page, limit, 'Reviews fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const createReview = async (req, res) => {
  try {
    const { menuItemId, restaurantId, rating, comment, userName, userAvatar } = req.body;
    const review = await Review.create({
      menuItem: menuItemId,
      restaurantId,
      user: { name: userName, avatar: userAvatar, userId: req.user?._id },
      rating,
      comment,
      images: req.files ? req.files.map((f) => f.path) : [],
    });
    const reviews = await Review.find({ menuItem: menuItemId, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await MenuItem.findByIdAndUpdate(menuItemId, { rating: Math.round(avgRating * 10) / 10, totalReviews: reviews.length });
    return successResponse(res, review, 'Review submitted successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Review deleted');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
