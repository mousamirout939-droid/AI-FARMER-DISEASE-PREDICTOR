import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';

// In production this would call a live mandi/MSP price API.
// Demo data structure kept realistic and clearly labeled.
const DEMO_PRICES = [
  { crop: 'Rice', mandi: 'Karnal', state: 'Haryana', minPrice: 1900, maxPrice: 2150, modalPrice: 2040, unit: 'per quintal' },
  { crop: 'Wheat', mandi: 'Indore', state: 'Madhya Pradesh', minPrice: 2100, maxPrice: 2350, modalPrice: 2250, unit: 'per quintal' },
  { crop: 'Cotton', mandi: 'Rajkot', state: 'Gujarat', minPrice: 6800, maxPrice: 7200, modalPrice: 7000, unit: 'per quintal' },
  { crop: 'Tomato', mandi: 'Kolar', state: 'Karnataka', minPrice: 800, maxPrice: 1400, modalPrice: 1100, unit: 'per quintal' },
  { crop: 'Onion', mandi: 'Lasalgaon', state: 'Maharashtra', minPrice: 1200, maxPrice: 1800, modalPrice: 1500, unit: 'per quintal' },
];

export const getMarketPrices = asyncHandler(async (req, res) => {
  const { crop } = req.query;
  const data = crop
    ? DEMO_PRICES.filter((p) => p.crop.toLowerCase() === crop.toLowerCase())
    : DEMO_PRICES;
  success(res, 200, 'Market prices fetched (demo data - integrate Agmarknet/eNAM API for production)', data);
});

export const getGovernmentSchemes = asyncHandler(async (req, res) => {
  const schemes = [
    {
      name: 'PM-KISAN',
      description: 'Income support of Rs. 6000/year to eligible farmer families.',
      eligibility: 'Small and marginal farmer families',
      link: 'https://pmkisan.gov.in',
    },
    {
      name: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance scheme protecting against yield loss due to natural calamities.',
      eligibility: 'All farmers growing notified crops',
      link: 'https://pmfby.gov.in',
    },
    {
      name: 'Soil Health Card Scheme',
      description: 'Provides soil nutrient status and fertilizer recommendations.',
      eligibility: 'All farmers',
      link: 'https://soilhealth.dac.gov.in',
    },
  ];
  success(res, 200, 'Government schemes fetched (demo data)', schemes);
});
