import { useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getListTransaction = data => request.get('/api/v1/transactions-history-admin', data);

// Query
export const useQueryGetListTransaction = (params = {}, options = {}) =>
  useQuery({ queryKey: ['getListTransaction', params], queryFn: () => getListTransaction(params), ...options });
