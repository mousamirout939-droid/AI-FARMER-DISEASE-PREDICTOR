import User from '../models/User.js';
import Prediction from '../models/Prediction.js';
import Disease from '../models/Disease.js';
import CommunityPost from '../models/Community.js';
import SupportTicket from '../models/SupportTicket.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalFarmers, totalExperts, totalPredictions, totalDiseases, openTickets, recentPredictions] =
    await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'expert' }),
      Prediction.countDocuments(),
      Disease.countDocuments(),
      SupportTicket.countDocuments({ status: 'open' }),
      Prediction.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name'),
    ]);

  const predictionsByDay = await Prediction.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 30 },
  ]);

  const topDiseases = await Prediction.aggregate([
    { $group: { _id: '$predictedClass', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  success(res, 200, 'Dashboard stats fetched', {
    totalFarmers,
    totalExperts,
    totalPredictions,
    totalDiseases,
    openTickets,
    recentPredictions,
    predictionsByDay,
    topDiseases,
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    const safe = escapeRegex(search);
    filter.$or = [{ name: new RegExp(safe, 'i') }, { email: new RegExp(safe, 'i') }];
  }

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await User.countDocuments(filter);
  success(res, 200, 'Users fetched', users, { page: Number(page), limit: Number(limit), total });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    throw new ApiError(400, "You can't change your own account status");
  }

  const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  success(res, 200, 'User status updated', user);
});

export const verifyExpert = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { 'expertDetails.verified': true },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  success(res, 200, 'Expert verified', user);
});

export const promoteToAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  if (user.role === 'admin') {
    return success(res, 200, 'User is already an admin', user.toSafeObject());
  }

  user.role = 'admin';
  await user.save();
  success(res, 200, 'User promoted to admin', user.toSafeObject());
});

export const listCommunityPostsAdmin = asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find().populate('author', 'name email').sort({ createdAt: -1 });
  success(res, 200, 'Community posts fetched', posts);
});