import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import { generateAccessToken, generateRefreshToken, setCookies } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/response.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }
    const user = await User.create({ name, email, password, phone });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    setCookies(res, accessToken, refreshToken);
    return successResponse(res, { user, accessToken }, 'Registration successful', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 'Invalid email or password', 401);
    }
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 401);
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    setCookies(res, accessToken, refreshToken);
    return successResponse(res, { user, accessToken }, 'Login successful');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: { $in: ['admin', 'superadmin'] } }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 'Invalid credentials', 401);
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    setCookies(res, accessToken, refreshToken);
    return successResponse(res, { user, accessToken }, 'Admin login successful');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) return errorResponse(res, 'No refresh token', 401);
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return errorResponse(res, 'Invalid refresh token', 401);
    }
    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    setCookies(res, accessToken, newRefreshToken);
    return successResponse(res, { accessToken }, 'Token refreshed');
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    return successResponse(res, user, 'User fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, preferences },
      { new: true, runValidators: true }
    );
    return successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
