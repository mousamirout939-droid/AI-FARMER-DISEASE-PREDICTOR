import dotenv from 'dotenv';
dotenv.config();

const required = (key, fallback = undefined) => {
  const value = process.env[key] ?? fallback;
  return value;
};

export const env = {
  NODE_ENV: required('NODE_ENV', 'development'),
  PORT: parseInt(required('PORT', '5000'), 10),

  MONGO_URI: required('MONGO_URI', 'mongodb://localhost:27017/ai_farmer'),

  JWT_SECRET: required('JWT_SECRET', 'change_me_dev_secret'),
  JWT_EXPIRES_IN: required('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET', 'change_me_dev_refresh_secret'),
  JWT_REFRESH_EXPIRES_IN: required('JWT_REFRESH_EXPIRES_IN', '7d'),

  CLIENT_URL: required('CLIENT_URL', 'http://localhost:5173'),
  AI_SERVICE_URL: required('AI_SERVICE_URL', 'http://localhost:8000'),

  CLOUDINARY_CLOUD_NAME: required('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: required('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: required('CLOUDINARY_API_SECRET', ''),

  SMTP_HOST: required('SMTP_HOST', ''),
  SMTP_PORT: parseInt(required('SMTP_PORT', '587'), 10),
  SMTP_USER: required('SMTP_USER', ''),
  SMTP_PASS: required('SMTP_PASS', ''),
  SMTP_FROM: required('SMTP_FROM', 'noreply@aifarmer.app'),

  WEATHER_API_KEY: required('WEATHER_API_KEY', ''),
  GEMINI_API_KEY: required('GEMINI_API_KEY', ''),

  RATE_LIMIT_WINDOW_MS: parseInt(required('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX: parseInt(required('RATE_LIMIT_MAX', '300'), 10),
};

export default env;
