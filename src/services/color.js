import { useMutation, useQuery } from '@tanstack/react-query';
import { ROOT_API } from 'constants/common';
import { request } from 'utils/request';

export const getColorForCat = params => request.get('/api/v1/colors', { params });
export const createColorForCat = data => request.post('/api/v1/colors/create', data);
export const updateColorForCat = data => request.post('/api/v1/colors/update', data);
export const deleteColorForCat = data => request.post('/api/v1/colors/delete', data);

// Mutation
export const useCreateColorMutation = () => useMutation({ mutationFn: createColorForCat });
export const useUpdateColorMutation = () => useMutation({ mutationFn: updateColorForCat });
export const useDeleteColorMutation = () => useMutation({ mutationFn: deleteColorForCat });

// Query
export const useQueryGetColors = (params = {}, options = {}) =>
  useQuery({ queryKey: ['GET_COLORS_FOR_CAT', params], queryFn: () => getColorForCat(params), ...options });
