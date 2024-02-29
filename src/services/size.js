import { useMutation, useQuery } from '@tanstack/react-query';
import { ROOT_API } from 'constants/common';
import { request } from 'utils/request';

export const getSizeForCat = params => request.get(ROOT_API + '/api/v1/sizes', { params });
export const createSizeForCat = data => request.post(ROOT_API + '/api/v1/sizes/create', data);

// Mutation
export const useCreateSizeMutation = () => useMutation({ mutationFn: createSizeForCat });

// Query
export const useQueryGetSize = (params = {}, options = {}) =>
  useQuery({ queryKey: ['GET_SIZE_FOR_CAT', params], queryFn: () => getSizeForCat(params), ...options });
