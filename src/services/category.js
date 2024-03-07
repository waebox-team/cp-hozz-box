import { useMutation, useQuery } from '@tanstack/react-query';
import { ROOT_API } from 'constants/common';
import { request } from 'utils/request';

export const getListCategory = (params) => request.get(ROOT_API + '/api/v1/categories/', { params });
export const createCategory = data => request.post(ROOT_API + '/api/v1/categories/create', data);
export const updateCategory = data => request.post(ROOT_API + '/api/v1/categories/update', data,);
export const deleteCategory = data => request.post(ROOT_API + '/api/v1/categories/delete', data);
export const setBestCategory = data => request.post(ROOT_API + '/api/v1/categories/set-best', data);

export const updateThumnail = async (data) => {
  return await request.post(ROOT_API + '/api/v1/common/upload-thumbnail', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Mutation
export const useCreateCategoryMutation = () => useMutation({ mutationFn: createCategory });
export const useUpdateCategoryMutation = () => useMutation({ mutationFn: updateCategory });
export const useDeleteCategoryMutation = () => useMutation({ mutationFn: deleteCategory });
export const useUpdateThumnailMutation = () => useMutation({ mutationFn: updateThumnail });
export const useSetBestCategoryMutation = () => useMutation({ mutationFn: setBestCategory });


// Query
export const useQueryGetListCategory = (params = {}, options = {}) => useQuery({ queryKey: ['getListCategory', params], queryFn: () => getListCategory(params), ...options });




