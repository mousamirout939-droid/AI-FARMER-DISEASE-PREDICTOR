import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    crop: { type: String, required: true, index: true },
    classLabel: { type: String, required: true, unique: true }, // maps to AI model output label
    isHealthy: { type: Boolean, default: false },
    description: { type: String, default: '' },
    symptoms: [{ type: String }],
    causes: [{ type: String }],
    preventiveMeasures: [{ type: String }],
    organicTreatment: [{ type: String }],
    chemicalTreatment: [{ type: String }],
    recommendedMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
    severityLevels: {
      mild: { type: String, default: '' },
      moderate: { type: String, default: '' },
      severe: { type: String, default: '' },
    },
    estimatedRecoveryDays: { type: Number, default: 0 },
    sprayIntervalDays: { type: Number, default: 0 },
    images: [{ type: String }],
  },
  { timestamps: true }
);

diseaseSchema.index({ name: 'text', crop: 'text' });

export default mongoose.model('Disease', diseaseSchema);
