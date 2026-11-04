import axiosClient from './axiosClient';

export const authApi = {
  register: (body) => axiosClient.post('/auth/register', body),
  verifyEmail: (body) => axiosClient.post('/auth/verify-email', body),
  resendOtp: (body) => axiosClient.post('/auth/resend-otp', body),
  login: (body) => axiosClient.post('/auth/login', body),
  logout: (refreshToken) => axiosClient.post('/auth/logout', { refreshToken }),
  forgotPassword: (body) => axiosClient.post('/auth/forgot-password', body),
  resetPassword: (body) => axiosClient.post('/auth/reset-password', body),
  changePassword: (body) => axiosClient.post('/auth/change-password', body),
  getMe: () => axiosClient.get('/auth/me'),
};
