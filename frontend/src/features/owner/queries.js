import { useQuery } from '@tanstack/react-query';
import { getDashboardStatsFn } from './api';

export const useGetDashboardStatsQuery = (options = {}) => {
  return useQuery({
    queryKey: ['ownerStats'],
    queryFn: getDashboardStatsFn,
    ...options,
  });
};
