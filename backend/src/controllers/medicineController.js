import Medicine from '../models/Medicine.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';

export const listMedicines = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = {};
  if (type) filter.type = type;
  const items = await Medicine.find(filter).sort({ name: 1 });
  success(res, 200, 'Medicines fetched', items);
});

export const createMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.create(req.body);
  success(res, 201, 'Medicine created', medicine);
});

export const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!medicine) throw new ApiError(404, 'Medicine not found');
  success(res, 200, 'Medicine updated', medicine);
});

export const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findByIdAndDelete(req.params.id);
  if (!medicine) throw new ApiError(404, 'Medicine not found');
  success(res, 200, 'Medicine deleted');
});
