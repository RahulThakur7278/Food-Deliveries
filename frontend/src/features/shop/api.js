import axiosClient from '../../api/axiosClient';

export const getShopsFn = async (params = {}) => {
  return await axiosClient.get('/shops', { params });
};

export const getShopByIdFn = async (shopId) => {
  return await axiosClient.get(`/shops/${shopId}`);
};

export const createShopFn = async (shopData) => {
  // shopData should be FormData since it contains an image (logo)
  return await axiosClient.post('/shops', shopData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateShopFn = async ({ shopId, shopData }) => {
  // shopData should be FormData since it may contain an image (logo)
  return await axiosClient.put(`/shops/${shopId}`, shopData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteShopFn = async (shopId) => {
  return await axiosClient.delete(`/shops/${shopId}`);
};
