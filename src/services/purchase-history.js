import { useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getListTransaction = params => request.get('/api/v1/transactions-history-admin', { params });
export const getListMember = params => request.get('/api/v1/member/members', { params });
export const getOrderByTransactionId = id => request.get(`/api/v1/transactions/order/${id}`)

// Query
export const useQueryGetListTransaction = (params = {}, options = {}) =>
  useQuery({ queryKey: ['getListTransaction', params], queryFn: () => getListTransaction(params), ...options });
export const useQueryGetListMember = (params = {}, options = {}) =>
  useQuery({ queryKey: ['getListMember', params], queryFn: () => getListMember(params), ...options });
export const useQueryGetOrderByTransaction = (params = {}, options = {}) =>
  useQuery({ queryKey: ['GET_ORDER_BY_TRANSACTION_ID', params], queryFn: () => getOrderByTransactionId(params), ...options });