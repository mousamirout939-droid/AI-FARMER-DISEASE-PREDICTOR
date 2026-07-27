import axios from 'axios';
import Prediction from '../models/Prediction.js';
import Disease from '../models/Disease.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';
import { uploadBuffer } from '../config/cloudinary.js';
import { generatePredictionPdf, generateQrCode } from '../utils/reportGenerator.js';
import Report from '../models/Report.js';
import env from '../config/env.js';

// Calls the Python AI microservice for inference.
const callAiService = async (imageBuffer, filename) => {
  const FormData = (await import('form-data')).default;
  const form = new FormData();
  form.append('file', imageBuffer, filename);

  const response = await axios.post(`${env.AI_SERVICE_URL}/api/v1/predict`, form, {
    headers: form.getHeaders(),
    timeout: 30000,
  });
  return response.data;
};

export const createPrediction = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'An image file is required');

  let aiResult;
  try {
    aiResult = await callAiService(req.file.buffer, req.file.originalname);
  } catch (err) {
    throw new ApiError(
      502,
      'AI service is unavailable. Please make sure the AI microservice is running.',
      err.message
    );
  }

  let uploaded;
  try {
    uploaded = await uploadBuffer(req.file.buffer, 'ai-farmer/predictions');
  } catch (err) {
    throw new ApiError(502, 'Image upload failed', err.message);
  }

  const disease = await Disease.findOne({
  classLabel: aiResult.predicted_class,
}).catch(() => null);

 const prediction = await Prediction.create({
  user: req.user._id,
  imageUrl: uploaded?.secure_url || '',
  imagePublicId: uploaded?.public_id || '',
  crop: aiResult?.crop || 'Unknown',
  predictedClass: aiResult?.predicted_class || 'Unknown',
  disease: disease?._id || null,
  confidence: aiResult?.confidence || 0,
  severityScore: aiResult?.severity_score || 0,
  boundingBoxes: aiResult?.bounding_boxes || [],
  heatmapUrl: aiResult?.heatmap_url || '',
  allProbabilities: aiResult?.all_probabilities || [],
});

 await prediction.populate('disease').catch(() => {});
return success(res, 201, 'Prediction complete', prediction);
});

export const getMyPredictions = asyncHandler(async (req, res) => {
  const predictions = await Prediction.find({
    user: req.user._id,
  })
    .populate('disease')
    .sort({ createdAt: -1 });

  return success(res, 200, 'Prediction history fetched', predictions);
});
  

export const getPredictionById = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findById(req.params.id).populate('disease').populate('user', 'name email');
  if (!prediction) throw new ApiError(404, 'Prediction not found');

  if (String(prediction.user._id) !== String(req.user._id) && req.user.role === 'farmer') {
    throw new ApiError(403, 'Not authorized to view this prediction');
  }
  return success(res, 200, 'Prediction fetched', prediction);
});

export const generateReport = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findById(req.params.id).populate('disease').populate('user');
  if (!prediction) throw new ApiError(404, 'Prediction not found');

  const pdfBuffer = await generatePredictionPdf(prediction, prediction.user, prediction.disease);
  const uploaded = await uploadBuffer(pdfBuffer, 'ai-farmer/reports').catch(() => null);

  const shareUrl = `${env.CLIENT_URL}/reports/${prediction._id}`;
  const qrCodeUrl = await generateQrCode(shareUrl);

  const report = await Report.create({
    user: prediction.user._id,
    prediction: prediction._id,
    pdfUrl: uploaded?.secure_url || '',
    qrCodeUrl,
  });

  prediction.reportUrl = report.pdfUrl;
  await prediction.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=report-${prediction._id}.pdf`);
  res.send(pdfBuffer);
});

export const deletePrediction = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findById(req.params.id);
  if (!prediction) throw new ApiError(404, 'Prediction not found');
  if (String(prediction.user) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this prediction');
  }
  await prediction.deleteOne();
  return success(res, 200, 'Prediction deleted');
}); 