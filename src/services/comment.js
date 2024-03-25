import { useMutation, useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getCommentByAdmin = params => request.get('/api/v1/comments', { params });
export const deleteCommentByAdmin = data => request.post('/api/v1/comment/delete', data)

// Query
export const useQueryGetCommentByAdmin = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_COMMENT_BY_ADMIN', params], queryFn: () => getCommentByAdmin({
      pageSize: params.pageSize,
      pageIndex: params.pageIndex,
      memberId: params?.member?.value || '',
      productId: params.product?.value || '',
      endTime: params.endTime,
      startTime: params.startTime
    }), ...options
  });

// Mutation
export const useMutationDeleteCommentByAdmin = () => useMutation({ mutationFn: deleteCommentByAdmin });