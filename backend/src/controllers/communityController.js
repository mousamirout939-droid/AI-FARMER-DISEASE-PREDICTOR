import CommunityPost from '../models/Community.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';

export const listPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const posts = await CommunityPost.find()
    .populate('author', 'name avatar role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  success(res, 200, 'Posts fetched', posts);
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.create({ ...req.body, author: req.user._id });
  await post.populate('author', 'name avatar role');
  success(res, 201, 'Post created', post);
});

export const likePost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');
  const idx = post.likes.findIndex((id) => String(id) === String(req.user._id));
  if (idx >= 0) post.likes.splice(idx, 1);
  else post.likes.push(req.user._id);
  await post.save();
  success(res, 200, 'Post like toggled', post);
});

export const commentOnPost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');
  post.comments.push({ user: req.user._id, text: req.body.text });
  await post.save();
  await post.populate('comments.user', 'name avatar');
  success(res, 201, 'Comment added', post);
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');
  if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this post');
  }
  await post.deleteOne();
  success(res, 200, 'Post deleted');
});
