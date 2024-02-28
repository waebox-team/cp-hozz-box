import { useQuery } from '@tanstack/react-query';
import { ROOT_API } from 'constants/common';
import { request } from 'utils/request';

export const getStatisticsWebsite = (params) => request.get(ROOT_API + '/api/v1/publisher/statistics-website', { params });

// Mutation

// Query
export const useQueryGetStatisticsWebsite = (params = {}, options = {}) => useQuery({ queryKey: ['getStatisticsWebsite', params], queryFn: () => getStatisticsWebsite(params), ...options });
