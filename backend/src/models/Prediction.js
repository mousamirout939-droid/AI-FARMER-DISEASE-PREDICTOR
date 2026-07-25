import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    crop: { type: String, default: 'unknown' },
    predictedClass: { type: String, required: true },
    disease: { type: mongoose.Schema.Types.ObjectId, ref: 'Disease' },
    confidence: { type: Number, required: true },
    severityScore: { type: Number, default: 0 },
    boundingBoxes: [
      {
        x: Number,
        y: Number,
        width: Number,
        height: Number,
        label: String,
        confidence: Number,
      },
    ],
    heatmapUrl: { type: String, default: '' },
    allProbabilities: [{ label: String, probability: Number }],
    weatherContext: {
      temperature: Number,
      humidity: Number,
      rainProbability: Number,
    },
    status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'completed' },
    reportUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Prediction', predictionSchema);
