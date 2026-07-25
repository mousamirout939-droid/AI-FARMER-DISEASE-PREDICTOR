import mongoose from 'mongoose';

const expertProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, default: '' },
    availability: [
      {
        day: String,
        slots: [String],
      },
    ],
    consultationFee: { type: Number, default: 0 },
    languagesSpoken: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('ExpertProfile', expertProfileSchema);
