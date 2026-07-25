import Notification from '../models/Notification.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  success(res, 200, 'Notifications fetched', notifications);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  success(res, 200, 'Notification marked as read', notification);
});

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create(req.body);
  success(res, 201, 'Notification created', notification);
});
