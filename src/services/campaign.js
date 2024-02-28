import { useQuery } from '@tanstack/react-query';
import { ROOT_API } from 'constants/common';
import { request } from 'utils/request';

export const getCountry = (params) => request.get(ROOT_API + '/api/v1/countries', { params });


// Mutation

// Query
export const useQueryGetCountry = (params = {}, options = {}) => useQuery({ queryKey: ['getCountry ', params], queryFn: () => getCountry(params), ...options });
