import User from '../models/User.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, generateOtp } from '../utils/jwt.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

const buildAuthResponse = async (res, user) => {
  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);

  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), refreshToken];
  await user.save();

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000,
  });

  return { accessToken, refreshToken, user: user.toSafeObject() };
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: ['farmer', 'expert','admin'].includes(role) ? role : 'farmer',
  });

  const payload = await buildAuthResponse(res, user);
  success(res, 201, 'Account created successfully', payload);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'This account has been deactivated');

  const payload = await buildAuthResponse(res, user);
  success(res, 200, 'Login successful', payload);
});

export const googleLogin = asyncHandler(async (req, res) => {
  // Expects front-end to verify Google ID token and pass decoded profile.
  const { email, name, avatarUrl } = req.body;
  if (!email) throw new ApiError(400, 'Google profile email is required');

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: crypto.randomBytes(16).toString('hex'),
      isGoogleAccount: true,
      isVerified: true,
      avatar: { url: avatarUrl || '' },
    });
  }

  const payload = await buildAuthResponse(res, user);
  success(res, 200, 'Google login successful', payload);
});

export const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'No account found with this email');

  const otp = generateOtp();
  user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
  await user.save();

  await sendEmail({
    to: email,
    subject: 'Your AI Farmer OTP Code',
    html: `<p>Your OTP code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });

  success(res, 200, 'OTP sent to your email');
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt');

  if (!user || !user.otp?.code) throw new ApiError(400, 'No OTP requested for this account');
  if (user.otp.code !== otp) throw new ApiError(400, 'Invalid OTP');
  if (user.otp.expiresAt < new Date()) throw new ApiError(400, 'OTP has expired');

  user.otp = undefined;
  user.isVerified = true;
  await user.save();

  const payload = await buildAuthResponse(res, user);
  success(res, 200, 'OTP verified, logged in', payload);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'No account found with this email');

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: email,
    subject: 'Reset your AI Farmer password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
  });

  success(res, 200, 'Password reset link sent to your email');
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  success(res, 200, 'Password reset successful. Please log in.');
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token required');

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user || !user.refreshTokens.includes(token)) {
    throw new ApiError(401, 'Refresh token not recognized');
  }

  const accessToken = signAccessToken(user._id, user.role);
  success(res, 200, 'Token refreshed', { accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (token && req.user) {
    req.user.refreshTokens = (req.user.refreshTokens || []).filter((t) => t !== token);
    await req.user.save();
  }
  res.clearCookie('accessToken');
  success(res, 200, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  success(res, 200, 'Current user fetched', req.user.toSafeObject());
});
