import { useMutation, useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getCountries = () => request.get('/api/v1/countries');
export const getStateByCountryCode = params => request.get(`/api/v1/countries/states`, { params })

// Query
export const useQueryGetCountries = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_COUNTRIES', params], queryFn: () => getCountries(), ...options
  });
export const useQueryGetStayeByCountryCode = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_STATE_BY_COUNTRY_CODE', params], queryFn: () => getStateByCountryCode({
      pageSize: params.pageSize,
      pageIndex: params.pageIndex,
      code: params?.country?.value || '',
      searchKeyword: params.searchKeyword
    }), ...options
  });

