import { useMutation, useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getCountry = data => request.get('/api/v1/country', data);
export const getCountryByCode = params => request.get(`/api/v1/countries/country-by-code/${params}`);
export const getStateByCountry = params => request.get(`/api/v1/countries/states/${params}`);
export const createShippingFee = params => request.post(`/api/v1/countries/fee-for-country`, params);
export const postStateTax = data => request.post('/api/v1/countries/tax-for-state', data);

// Mutation
export const useGetCountryByCodeMutation = () => useMutation({ mutationFn: getCountryByCode });
export const useGetStateByCountryMutation = () => useMutation({ mutationFn: getStateByCountry });
export const useCreateShippingFeeMutation = () => useMutation({ mutationFn: createShippingFee });
export const useStateTaxMutation = () => useMutation({ mutationFn: postStateTax });

// Query
export const useQueryGetCountry = (params = {}, options = {}) =>
  useQuery({ queryKey: ['getCountry', params], queryFn: () => getCountry(params), ...options });
