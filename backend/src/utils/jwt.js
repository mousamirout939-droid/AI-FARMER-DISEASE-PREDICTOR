import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const signAccessToken = (userId, role) =>
  jwt.sign({ id: userId, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

export const signRefreshToken = (userId) =>
  jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

export const verifyRefreshToken = (token) => jwt.verify(token, env.JWT_REFRESH_SECRET);

export const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));
