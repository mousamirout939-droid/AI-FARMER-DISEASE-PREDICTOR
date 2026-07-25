import axios from 'axios';
import Weather from '../models/Weather.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';
import env from '../config/env.js';

const computeDiseaseRisk = ({ humidity, temperature, rainProbability }) => {
  let score = 0;
  if (humidity > 80) score += 2;
  else if (humidity > 60) score += 1;
  if (temperature >= 20 && temperature <= 30) score += 1;
  if (rainProbability > 60) score += 2;

  if (score >= 4) return { level: 'high', reason: 'High humidity, warm temperatures and rain favor fungal disease spread.' };
  if (score >= 2) return { level: 'moderate', reason: 'Conditions are moderately favorable for disease development.' };
  return { level: 'low', reason: 'Current conditions are unfavorable for most crop diseases.' };
};

export const getWeatherByLocation = asyncHandler(async (req, res) => {
  const { lat, lng, location } = req.query;
  if (!lat && !location) throw new ApiError(400, 'lat/lng or location query param is required');

  if (!env.WEATHER_API_KEY) {
    // Graceful fallback with clearly-labeled demo data when no API key is configured.
    const demo = {
      location: location || `${lat},${lng}`,
      temperature: 28,
      humidity: 72,
      windSpeed: 12,
      rainProbability: 40,
      uvIndex: 6,
      condition: 'Partly Cloudy (demo data - configure WEATHER_API_KEY for live data)',
      diseaseRisk: computeDiseaseRisk({ humidity: 72, temperature: 28, rainProbability: 40 }),
      forecast: [],
    };
    return success(res, 200, 'Weather fetched (demo mode)', demo);
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?${
    lat ? `lat=${lat}&lon=${lng}` : `q=${encodeURIComponent(location)}`
  }&units=metric&appid=${env.WEATHER_API_KEY}`;

  const { data } = await axios.get(url);

  const parsed = {
    location: data.name,
    lat: data.coord?.lat,
    lng: data.coord?.lon,
    temperature: data.main?.temp,
    humidity: data.main?.humidity,
    windSpeed: data.wind?.speed,
    rainProbability: data.rain ? 80 : 20,
    uvIndex: 0,
    condition: data.weather?.[0]?.description,
  };
  parsed.diseaseRisk = computeDiseaseRisk(parsed);

  const saved = await Weather.create(parsed);
  success(res, 200, 'Weather fetched', saved);
});
