import { useMutation, useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getOrders = params => request.get('/api/v1/orders-admin', { params });
export const cancelOrder = data => request.post('/api/v1/orders/cancel-by-admin', data)

// Query
export const useQueryGetOrders = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_ORDERS', params], queryFn: () => getOrders({
      pageSize: params.pageSize,
      pageIndex: params.pageIndex,
      searchKeyword: params?.searchKeyword || '',
      status: params.status?.value || '',
    }), ...options
  });

// Mutation
export const useMutationCancelOrderByAdmin = () => useMutation({ mutationFn: cancelOrder });