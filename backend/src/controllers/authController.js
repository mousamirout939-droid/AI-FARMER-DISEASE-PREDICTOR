import User from '../models/User.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/apiResponse.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateOtp,
} from '../utils/jwt.js';
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

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    accessToken,
    refreshToken,
    user: user.toSafeObject(),
  };
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: ['farmer', 'expert', 'admin'].includes(role) ? role : 'farmer',
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

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  const payload = await buildAuthResponse(res, user);

  success(res, 200, 'Login successful', payload);
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { email, name, avatarUrl } = req.body;

  if (!email) {
    throw new ApiError(400, 'Google profile email is required');
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: crypto.randomBytes(16).toString('hex'),
      isGoogleAccount: true,
      isVerified: true,
      avatar: {
        url: avatarUrl || '',
      },
    });
  }

  const payload = await buildAuthResponse(res, user);

  success(res, 200, 'Google login successful', payload);
});

export const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'No account found with this email');
  }

  const otp = generateOtp();

  user.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    attempts: 0,
  };

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

  const user = await User.findOne({ email }).select(
    '+otp.code +otp.expiresAt +otp.attempts'
  );

  if (!user || !user.otp?.code) {
    throw new ApiError(400, 'No OTP requested for this account');
  }

  if (user.otp.expiresAt < new Date()) {
    throw new ApiError(400, 'OTP has expired');
  }

  if ((user.otp.attempts || 0) >= 5) {
    user.otp = undefined;
    await user.save();
    throw new ApiError(429, 'Too many incorrect attempts. Please request a new OTP');
  }

  const providedOtp = String(otp || '');
  const storedOtp = String(user.otp.code);

  const buffersMatch =
    providedOtp.length === storedOtp.length &&
    crypto.timingSafeEqual(Buffer.from(providedOtp), Buffer.from(storedOtp));

  if (!buffersMatch) {
    user.otp.attempts = (user.otp.attempts || 0) + 1;
    await user.save();
    throw new ApiError(400, 'Invalid OTP');
  }

  user.otp = undefined;
  user.isVerified = true;

  await user.save();

  const payload = await buildAuthResponse(res, user);

  success(res, 200, 'OTP verified, logged in', payload);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'No account found with this email');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

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
    passwordResetExpires: {
      $gt: new Date(),
    },
  }).select('+passwordResetToken +passwordResetExpires +refreshTokens');

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // Invalidate all existing sessions on password reset
  user.refreshTokens = [];

  await user.save();

  success(res, 200, 'Password reset successful. Please log in.');
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, 'Refresh token required');
  }

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
  const newRefreshToken = signRefreshToken(user._id);

  // Rotate: remove the used token, add the new one
  user.refreshTokens = [
    ...user.refreshTokens.filter((t) => t !== token),
    newRefreshToken,
  ].slice(-5);

  await user.save();

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  success(res, 200, 'Token refreshed', {
    accessToken,
    refreshToken: newRefreshToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;

  if (token) {
    let decoded;

    try {
      decoded = verifyRefreshToken(token);
    } catch {
      decoded = null;
    }

    if (decoded?.id) {
      await User.findByIdAndUpdate(decoded.id, {
        $pull: { refreshTokens: token },
      });
    }
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  success(res, 200, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  success(res, 200, 'Current user fetched', req.user.toSafeObject());
});