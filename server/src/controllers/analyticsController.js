import Analytics from '../models/Analytics.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getDashboardStats = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [todayStats, monthStats, totalOrders, pendingOrders, totalMenuItems] = await Promise.all([
      Analytics.findOne({ restaurantId, date: today }),
      Analytics.aggregate([
        { $match: { restaurantId: new (await import('mongoose')).default.Types.ObjectId(restaurantId), date: { $gte: thisMonth } } },
        { $group: { _id: null, revenue: { $sum: '$revenue' }, orders: { $sum: '$orderCount' }, customers: { $sum: '$customerCount' } } },
      ]),
      Order.countDocuments({ restaurantId }),
      Order.countDocuments({ restaurantId, status: { $in: ['pending', 'confirmed', 'preparing'] } }),
      MenuItem.countDocuments({ restaurantId, isAvailable: true }),
    ]);
    return successResponse(res, {
      today: todayStats || { revenue: 0, orderCount: 0, customerCount: 0, arViewCount: 0 },
      thisMonth: monthStats[0] || { revenue: 0, orders: 0, customers: 0 },
      totalOrders,
      pendingOrders,
      totalMenuItems,
    }, 'Dashboard stats fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getRevenueChart = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { period = 'week' } = req.query;
    let startDate;
    const today = new Date();
    if (period === 'week') startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (period === 'month') startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    else startDate = new Date(today.getFullYear(), 0, 1);
    const analytics = await Analytics.find({
      restaurantId,
      date: { $gte: startDate, $lte: today },
    }).sort({ date: 1 });
    return successResponse(res, analytics, 'Revenue chart data fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getTopItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const items = await MenuItem.find({ restaurantId, isAvailable: true })
      .sort({ totalOrders: -1 })
      .limit(10)
      .populate('category', 'name');
    return successResponse(res, items, 'Top items fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
