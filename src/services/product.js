import { useMutation, useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getCatForProduct = params => request.get('/api/v1/categories', { params });
export const getSizeForProduct = data => request.get('/api/v1/sizes', { params: { categoryId: data.categoryId } });
export const getColorForProduct = data => request.get('/api/v1/colors', { params: { categoryId: data.categoryId } });
export const createProduct = data => request.post('/api/v1/products/create', data);
export const updateProduct = data => request.post('/api/v1/products/update', data);
export const deleteProduct = data => request.post('/api/v1/products/delete', data);
export const uploadPhotoProduct = (data, config) =>
  request.post('/api/v1/products/upload-thumbnail', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
export const getProducts = params => request.get('/api/v1/products', { params });
export const getProductDetail = id => request.get(`/api/v1/products/${id}`);
export const changeStatusProduct = data => request.post('/api/v1/products/change-status', data);
export const setNewProduct = data => request.post('/api/v1/products/set-is-new', data);
export const setHotProduct = data => request.post('/api/v1/products/set-is-best', data);
export const exportTemplateProduct = data => request.post('/api/v1/products/export-template', data, { responseType: 'arraybuffer' });
export const importProduct = (data, config) =>
  request.post('/api/v1/products/import', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });

// Mutation
export const useGetSizeForProdMutation = () => useMutation({ mutationFn: getSizeForProduct });
export const useGetColorForProdMutation = () => useMutation({ mutationFn: getColorForProduct });
export const useCreateProductMutation = () => useMutation({ mutationFn: createProduct });
export const useUpdateProductMutation = () => useMutation({ mutationFn: updateProduct });
export const useDeleteProductMutation = () => useMutation({ mutationFn: deleteProduct });
export const useChangeStatusProductMutation = () => useMutation({ mutationFn: changeStatusProduct });
export const useSetNewProductMutation = () => useMutation({ mutationFn: setNewProduct });
export const useSetHotProductMutation = () => useMutation({ mutationFn: setHotProduct });
export const useExportTemplateProductMutation = () => useMutation({ mutationFn: exportTemplateProduct });

// Query
export const useQueryGetCatForProduct = (params = {}, options = {}) =>
  useQuery({ queryKey: ['GET_CATE_FOR_PRODUCT', params], queryFn: () => getCatForProduct(params), ...options });
export const useQueryGetProducts = (params = {}, options = {}) =>
  useQuery({ queryKey: ['GET_PRODUCTS', params], queryFn: () => getProducts(params), ...options });
export const useQueryGetProductDetail = (id, options = {}) =>
  useQuery({ queryKey: ['GET_PRODUCT_DETAIL', id], queryFn: () => getProductDetail(id), ...options });
