import { useQuery } from '@tanstack/react-query';
import { getCategoriesFn } from './api';

export const useGetCategoriesQuery = (options = {}) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesFn,
    ...options,
  });
};
