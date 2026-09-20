import axiosClient from '../../api/axiosClient';

export const getItemsByShopFn = async (shopId, params = {}) => {
  return await axiosClient.get(`/items/shop/${shopId}`, { params });
};

export const getItemByIdFn = async (itemId) => {
  return await axiosClient.get(`/items/${itemId}`);
};

export const createItemFn = async (itemData) => {
  // itemData should be FormData since it contains an image
  return await axiosClient.post('/items', itemData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateItemFn = async ({ itemId, itemData }) => {
  // itemData should be FormData since it may contain an image
  return await axiosClient.put(`/items/${itemId}`, itemData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteItemFn = async (itemId) => {
  return await axiosClient.delete(`/items/${itemId}`);
};
