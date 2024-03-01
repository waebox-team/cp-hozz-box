import { useMutation, useQuery } from '@tanstack/react-query';
import { ROOT_API } from 'constants/common';
import { request } from 'utils/request';

export const getCatForProduct = params => request.get(ROOT_API + '/api/v1/categories', { params });
export const getSizeForProduct = data => request.get(ROOT_API + '/api/v1/sizes', { params: { categoryId: data.categoryId } });
export const getColorForProduct = data => request.get(ROOT_API + '/api/v1/colors', { params: { categoryId: data.categoryId } });
export const createProduct = data => request.post(ROOT_API + '/api/v1/products/create', data);
export const updateProduct = data => request.post(ROOT_API + '/api/v1/products/update', data);
export const uploadPhotoProduct = (data, config) =>
  request.post(ROOT_API + '/api/v1/products/upload-thumbnail', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
export const getProducts = params => request.get(ROOT_API + '/api/v1/products', { params });
export const getProductDetail = id => request.get(ROOT_API + `/api/v1/products/${id}`);

// Mutation
export const useGetSizeForProdMutation = () => useMutation({ mutationFn: getSizeForProduct });
export const useGetColorForProdMutation = () => useMutation({ mutationFn: getColorForProduct });
export const useCreateProductMutation = () => useMutation({ mutationFn: createProduct });
export const useUpdateProductMutation = () => useMutation({ mutationFn: updateProduct });

// Query
export const useQueryGetCatForProduct = (params = {}, options = {}) =>
  useQuery({ queryKey: ['GET_CATE_FOR_PRODUCT', params], queryFn: () => getCatForProduct(params), ...options });
export const useQueryGetProducts = (params = {}, options = {}) =>
  useQuery({ queryKey: ['GET_PRODUCTS', params], queryFn: () => getProducts(params), ...options });
export const useQueryGetProductDetail = (id, options = {}) =>
  useQuery({ queryKey: ['GET_PRODUCT_DETAIL', id], queryFn: () => getProductDetail(id), ...options });
