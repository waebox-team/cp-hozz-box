import { useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getListTransaction = params => request.get('/api/v1/transactions-history-admin', { params });

// Query
export const useQueryGetListTransaction = (params = {}, options = {}) =>
  useQuery({ queryKey: ['getListTransaction', params], queryFn: () => getListTransaction(params), ...options });
