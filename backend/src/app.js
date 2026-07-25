import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';

import env from './config/env.js';
import { swaggerSpec } from './utils/swagger.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'https://ai-farmer-disease-predictor.vercel.app',
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      // Local development
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel deployments
      if (
        origin.startsWith('https://') &&
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      console.error(`CORS blocked: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
  })
);

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api', apiLimiter);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Farmer API is healthy',
    env: env.NODE_ENV,
    timestamp: new Date(),
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/predictions', predictionRoutes);
app.use('/api/v1/diseases', diseaseRoutes);
app.use('/api/v1/medicines', medicineRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;