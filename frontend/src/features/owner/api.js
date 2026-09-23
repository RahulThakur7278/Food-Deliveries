import axiosClient from '../../api/axiosClient';

export const getDashboardStatsFn = async () => {
  return await axiosClient.get('/owner/stats');
};
