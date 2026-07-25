import axiosClient from './axiosClient.js';

export const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload),
  login: (payload) => axiosClient.post('/auth/login', payload),
  logout: () => axiosClient.post('/auth/logout'),
  me: () => axiosClient.get('/auth/me'),
  requestOtp: (email) => axiosClient.post('/auth/otp/request', { email }),
  verifyOtp: (payload) => axiosClient.post('/auth/otp/verify', payload),
  forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
  resetPassword: (payload) => axiosClient.post('/auth/reset-password', payload),
};

export const predictionApi = {
  create: (formData) =>
    axiosClient.post('/predictions', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  history: (params) => axiosClient.get('/predictions', { params }),
  getById: (id) => axiosClient.get(`/predictions/${id}`),
  report: (id) => axiosClient.get(`/predictions/${id}/report`, { responseType: 'blob' }),
  remove: (id) => axiosClient.delete(`/predictions/${id}`),
};

export const diseaseApi = {
  list: (params) => axiosClient.get('/diseases', { params }),
  getById: (id) => axiosClient.get(`/diseases/${id}`),
};

export const weatherApi = {
  get: (params) => axiosClient.get('/weather', { params }),
};

export const marketApi = {
  prices: (params) => axiosClient.get('/market/prices', { params }),
  schemes: () => axiosClient.get('/market/schemes'),
};

export const chatbotApi = {
  send: (payload) => axiosClient.post('/chatbot', payload),
};

export const communityApi = {
  list: (params) => axiosClient.get('/community', { params }),
  create: (payload) => axiosClient.post('/community', payload),
  like: (id) => axiosClient.post(`/community/${id}/like`),
  comment: (id, text) => axiosClient.post(`/community/${id}/comments`, { text }),
};

export const adminApi = {
  stats: () => axiosClient.get('/admin/stats'),
  users: (params) => axiosClient.get('/admin/users', { params }),
  updateUserStatus: (id, isActive) => axiosClient.patch(`/admin/users/${id}/status`, { isActive }),
};
