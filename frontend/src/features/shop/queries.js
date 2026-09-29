import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShopsFn, getShopByIdFn, createShopFn, updateShopFn, deleteShopFn } from './api';

export const useGetShopsQuery = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['shops', params],
    queryFn: () => getShopsFn(params),
    ...options,
  });
};

export const useGetShopByIdQuery = (shopId, options = {}) => {
  return useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => getShopByIdFn(shopId),
    enabled: !!shopId,
    ...options,
  });
};

export const useCreateShopMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShopFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
};

export const useUpdateShopMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShopFn,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop', variables.shopId] });
    },
  });
};

export const useDeleteShopMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShopFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
};
