import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, index: true },
    lat: Number,
    lng: Number,
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    rainProbability: Number,
    uvIndex: Number,
    condition: String,
    diseaseRisk: {
      level: { type: String, enum: ['low', 'moderate', 'high'], default: 'low' },
      reason: { type: String, default: '' },
    },
    forecast: [
      {
        date: String,
        tempMin: Number,
        tempMax: Number,
        condition: String,
        rainProbability: Number,
      },
    ],
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Weather', weatherSchema);
