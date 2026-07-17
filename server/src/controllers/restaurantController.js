import Restaurant from '../models/Restaurant.js';
import { successResponse, errorResponse } from '../utils/response.js';
import QRCode from 'qrcode';

export const getRestaurant = async (req, res) => {
  try {
    const { slug } = req.params;
    const restaurant = await Restaurant.findOne({ slug, isActive: true });
    if (!restaurant) return errorResponse(res, 'Restaurant not found', 404);
    return successResponse(res, restaurant, 'Restaurant fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return errorResponse(res, 'Restaurant not found', 404);
    return successResponse(res, restaurant, 'Restaurant fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const restaurant = await Restaurant.create({ ...req.body, slug, ownerId: req.user._id });
    await generateTableQRCodes(restaurant);
    return successResponse(res, restaurant, 'Restaurant created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!restaurant) return errorResponse(res, 'Restaurant not found', 404);
    return successResponse(res, restaurant, 'Restaurant updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const generateQRCode = async (req, res) => {
  try {
    const { restaurantId, tableNumber } = req.params;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const url = `${clientUrl}/menu/${restaurantId}?table=${tableNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' },
    });
    return successResponse(res, { qrCode: qrCodeDataUrl, url }, 'QR Code generated');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const generateAllTableQRCodes = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return errorResponse(res, 'Restaurant not found', 404);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const qrCodes = await Promise.all(
      restaurant.tables.map(async (table) => {
        const url = `${clientUrl}/menu/${restaurant._id}?table=${table.tableNumber}`;
        const qrCode = await QRCode.toDataURL(url, { width: 300, margin: 2 });
        return { tableNumber: table.tableNumber, qrCode, url };
      })
    );
    return successResponse(res, qrCodes, 'QR Codes generated');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const generateTableQRCodes = async (restaurant) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  if (restaurant.tables && restaurant.tables.length > 0) {
    const updatedTables = await Promise.all(
      restaurant.tables.map(async (table) => {
        const url = `${clientUrl}/menu/${restaurant._id}?table=${table.tableNumber}`;
        const qrCode = await QRCode.toDataURL(url, { width: 300, margin: 2 });
        return { ...table.toObject(), qrCode };
      })
    );
    restaurant.tables = updatedTables;
    await restaurant.save();
  }
};

export const uploadRestaurantImages = async (req, res) => {
  try {
    const updateData = {};
    if (req.files?.logo) updateData.logo = req.files.logo[0].path;
    if (req.files?.cover) updateData.coverImage = req.files.cover[0].path;
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return successResponse(res, restaurant, 'Images uploaded successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
