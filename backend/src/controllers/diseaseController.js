import Disease from '../models/Disease.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';

export const listDiseases = asyncHandler(async (req, res) => {
  const { crop, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (crop) filter.crop = crop;
  if (search) filter.$text = { $search: search };

  const items = await Disease.find(filter)
    .sort({ name: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Disease.countDocuments(filter);

  success(res, 200, 'Diseases fetched', items, { page: Number(page), limit: Number(limit), total });
});

export const getDisease = asyncHandler(async (req, res) => {
  const disease = await Disease.findById(req.params.id).populate('recommendedMedicines');
  if (!disease) throw new ApiError(404, 'Disease not found');
  success(res, 200, 'Disease fetched', disease);
});

export const createDisease = asyncHandler(async (req, res) => {
  const disease = await Disease.create(req.body);
  success(res, 201, 'Disease created', disease);
});

export const updateDisease = asyncHandler(async (req, res) => {
  const disease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!disease) throw new ApiError(404, 'Disease not found');
  success(res, 200, 'Disease updated', disease);
});

export const deleteDisease = asyncHandler(async (req, res) => {
  const disease = await Disease.findByIdAndDelete(req.params.id);
  if (!disease) throw new ApiError(404, 'Disease not found');
  success(res, 200, 'Disease deleted');
});
