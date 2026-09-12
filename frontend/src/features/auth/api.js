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
