import { useMutation, useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getListCategory = params => request.get('/api/v1/categories/', { params });
export const createCategory = data => request.post('/api/v1/categories/create', data);
export const updateCategory = data => request.post('/api/v1/categories/update', data);
export const deleteCategory = data => request.post('/api/v1/categories/delete', data);
export const setBestCategory = data => request.post('/api/v1/categories/set-best', data);
export const exportTemplate = (data) => request.post('/api/v1/categories/export-template', data, { responseType: 'arraybuffer' })
export const importFile = (data, config) =>
  request.post('/api/v1/categories/import', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });

export const updateThumbnail = async data => {
  return await request.post('/api/v1/common/upload-thumbnail', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Mutation
export const useCreateCategoryMutation = () => useMutation({ mutationFn: createCategory });
export const useUpdateCategoryMutation = () => useMutation({ mutationFn: updateCategory });
export const useDeleteCategoryMutation = () => useMutation({ mutationFn: deleteCategory });
export const useUpdateThumbnailMutation = () => useMutation({ mutationFn: updateThumbnail });
export const useSetBestCategoryMutation = () => useMutation({ mutationFn: setBestCategory });
export const useExportTemplateMutation = () => useMutation({ mutationFn: exportTemplate });

// Query
export const useQueryGetListCategory = (params = {}, options = {}) =>
  useQuery({ queryKey: ['getListCategory', params], queryFn: () => getListCategory(params), ...options });
