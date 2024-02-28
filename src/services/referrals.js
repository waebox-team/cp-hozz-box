import { useQuery } from '@tanstack/react-query';
import { ROOT_API } from 'constants/common';
import { request } from 'utils/request';

export const getAppSetting = (params) => request.get(ROOT_API + '/api/v1/settings', { params });


// Mutation

// Query
export const useQueryGetAppSetting = (params = {}, options = {}) => useQuery({ queryKey: ['getAppSetting ', params], queryFn: () => getAppSetting(params), ...options });
