import axiosClient from '../../api/axiosClient';

export const registerFn = async (userData) => {
  return await axiosClient.post('/auth/register', userData);
};

export const loginFn = async (credentials) => {
  return await axiosClient.post('/auth/login', credentials);
};

export const logoutFn = async (data) => {
  return await axiosClient.post('/auth/logout', data);
};

export const logoutAllFn = async (data) => {
  return await axiosClient.post('/auth/logout-all', data);
};

export const sendOtpFn = async (data) => {
  return await axiosClient.post('/auth/send-otp', data);
};

export const verifyOtpFn = async (data) => {
  return await axiosClient.post('/auth/verify-otp', data);
};

export const resetPasswordFn = async (data) => {
  return await axiosClient.post('/auth/reset-password', data);
};

export const googleSignUpFn = async (data) => {
  return await axiosClient.post('/auth/google-signup', data);
};

export const googleSignInFn = async (data) => {
  return await axiosClient.post('/auth/google-signin', data);
};
