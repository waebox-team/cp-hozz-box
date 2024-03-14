import { useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getListTransaction = params => request.get('/api/v1/transactions-history-admin', { params });
export const getListMember = params => request.get('/api/v1/member/members', { params });

// Query
export const useQueryGetListTransaction = (params = {}, options = {}) =>
  useQuery({ queryKey: ['getListTransaction', params], queryFn: () => getListTransaction(params), ...options });
export const useQueryGetListMember = (params = {}, options = {}) =>
  useQuery({ queryKey: ['getListMember', params], queryFn: () => getListMember(params), ...options });
