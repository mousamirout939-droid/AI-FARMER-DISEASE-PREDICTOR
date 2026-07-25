import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['organic', 'chemical', 'fertilizer'], required: true },
    activeIngredient: { type: String, default: '' },
    applicableDiseases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Disease' }],
    dosage: { type: String, default: '' },
    applicationMethod: { type: String, default: '' },
    price: { type: Number, default: 0 },
    manufacturer: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Medicine', medicineSchema);
