import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prediction: { type: mongoose.Schema.Types.ObjectId, ref: 'Prediction', required: true },
    pdfUrl: { type: String, default: '' },
    qrCodeUrl: { type: String, default: '' },
    emailedTo: [{ type: String }],
    sharedVia: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
