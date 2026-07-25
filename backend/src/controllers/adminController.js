import User from '../models/User.js';
import Prediction from '../models/Prediction.js';
import Disease from '../models/Disease.js';
import CommunityPost from '../models/Community.js';
import SupportTicket from '../models/SupportTicket.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';

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
  if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await User.countDocuments(filter);
  success(res, 200, 'Users fetched', users, { page: Number(page), limit: Number(limit), total });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
  success(res, 200, 'User status updated', user);
});

export const verifyExpert = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { 'expertDetails.verified': true },
    { new: true }
  );
  success(res, 200, 'Expert verified', user);
});

export const listCommunityPostsAdmin = asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find().populate('author', 'name email').sort({ createdAt: -1 });
  success(res, 200, 'Community posts fetched', posts);
});
