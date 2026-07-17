import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Coupon from '../models/Coupon.js';
import Analytics from '../models/Analytics.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

export const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, customer, tableNumber, paymentMethod, couponCode, specialInstructions } = req.body;
    let subtotal = 0;
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (!menuItem || !menuItem.isAvailable) throw new Error(`${menuItem?.name || 'Item'} is not available`);
        const customizationPrice = (item.customizations || []).reduce((sum, c) => sum + (c.price || 0), 0);
        const itemTotal = (menuItem.discountedPrice || menuItem.price + customizationPrice) * item.quantity;
        subtotal += itemTotal;
        await MenuItem.findByIdAndUpdate(item.menuItemId, { $inc: { totalOrders: 1 } });
        return {
          menuItem: menuItem._id,
          name: menuItem.name,
          price: menuItem.discountedPrice || menuItem.price,
          quantity: item.quantity,
          image: menuItem.thumbnail,
          customizations: item.customizations || [],
          subtotal: itemTotal,
        };
      })
    );
    let couponDiscount = 0;
    let couponCodeUsed;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), restaurantId, isActive: true });
      if (coupon && coupon.usedCount < coupon.usageLimit && subtotal >= coupon.minimumOrder) {
        if (coupon.type === 'percentage') {
          couponDiscount = Math.min((subtotal * coupon.value) / 100, coupon.maximumDiscount || Infinity);
        } else {
          couponDiscount = coupon.value;
        }
        coupon.usedCount += 1;
        await coupon.save();
        couponCodeUsed = couponCode.toUpperCase();
      }
    }
    const restaurant = await (await import('../models/Restaurant.js')).default.findById(restaurantId);
    const taxRate = restaurant?.taxRate || 5;
    const taxAmount = ((subtotal - couponDiscount) * taxRate) / 100;
    const deliveryCharges = restaurant?.deliveryCharges || 0;
    const totalAmount = subtotal - couponDiscount + taxAmount + deliveryCharges;
    const order = await Order.create({
      restaurantId,
      customer,
      tableNumber,
      items: orderItems,
      paymentMethod,
      couponCode: couponCodeUsed,
      couponDiscount,
      subtotal,
      taxAmount,
      deliveryCharges,
      totalAmount,
      specialInstructions,
      timeline: [{ status: 'pending', note: 'Order placed' }],
    });
    await updateDailyAnalytics(restaurantId, {
      revenue: totalAmount,
      orderCount: 1,
      customerCount: 1,
    }, order);
    return successResponse(res, order, 'Order placed successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status, search, page = 1, limit = 20, startDate, endDate } = req.query;
    const filter = { restaurantId };
    if (status && status !== 'all') filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);
    return paginatedResponse(res, orders, total, page, limit, 'Orders fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem', 'name images');
    if (!order) return errorResponse(res, 'Order not found', 404);
    return successResponse(res, order, 'Order fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return errorResponse(res, 'Order not found', 404);
    order.status = status;
    order.timeline.push({ status, note: note || `Order ${status}`, timestamp: new Date() });
    await order.save();
    return successResponse(res, order, 'Order status updated');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.menuItem', 'name images thumbnail');
    if (!order) return errorResponse(res, 'Order not found', 404);
    return successResponse(res, order, 'Order fetched');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, restaurantId, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), restaurantId, isActive: true });
    if (!coupon) return errorResponse(res, 'Invalid coupon code', 400);
    if (coupon.usedCount >= coupon.usageLimit) return errorResponse(res, 'Coupon usage limit reached', 400);
    if (coupon.endDate && new Date() > coupon.endDate) return errorResponse(res, 'Coupon has expired', 400);
    if (subtotal < coupon.minimumOrder) {
      return errorResponse(res, `Minimum order amount is ₹${coupon.minimumOrder}`, 400);
    }
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.min((subtotal * coupon.value) / 100, coupon.maximumDiscount || Infinity);
    } else {
      discount = coupon.value;
    }
    return successResponse(res, { coupon, discount: Math.round(discount) }, 'Coupon applied successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const updateDailyAnalytics = async (restaurantId, data, order) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const updateData = { $inc: data };
  if (order) {
    const topItemUpdates = order.items.map((item) => ({
      name: item.name,
      menuItem: item.menuItem,
      count: item.quantity,
      revenue: item.subtotal,
    }));
    updateData.$push = {
      topItems: { $each: topItemUpdates },
    };
  }
  await Analytics.findOneAndUpdate({ restaurantId, date: today }, updateData, { upsert: true, new: true });
};
