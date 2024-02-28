import { useMutation, useQuery } from '@tanstack/react-query';
import { ROOT_API } from 'constants/common';
import { request } from 'utils/request';

export const getMyWebsites = (params) => request.get(ROOT_API + '/api/v1/websites/my-websites', { params });
export const getMyWebsiteAdUnits = (websiteId, params) => request.get(ROOT_API + `/api/v1/websites/my-ad-units/${websiteId}`, { params });
export const createAddAdUnit = (data) => request.post(ROOT_API + '/api/v1/websites/add-ad-unit', data)
export const getMyDirectLinks = (params) => request.get(ROOT_API + '/api/v1/direct-links/my-links', { params });
export const getCategoryWebsite = () => request.get(ROOT_API + '/api/v1/categories');
export const createWebsite = (data) => request.post(ROOT_API + '/api/v1/websites/create', data)
export const updateWebsite = (data) => request.post(ROOT_API + '/api/v1/websites/update', data)
export const deleteWebsite = (data) => request.post(ROOT_API + '/api/v1/websites/delete', data)
export const createDirectLink = (data) => request.post(ROOT_API + '/api/v1/direct-links/create', data)
export const updateDirectLink = (data) => request.post(ROOT_API + '/api/v1/direct-links/update', data)
export const saveNativeBanner = (data) => request.post(ROOT_API + '/api/v1/websites/save-native-banner', data)


// Mutation
export const useCreateWebsiteMutation = () => useMutation({ mutationFn: createWebsite });
export const useUpdateWebsiteMutation = () => useMutation({ mutationFn: updateWebsite });
export const useDeleteWebsiteMutation = () => useMutation({ mutationFn: deleteWebsite });
export const useCreateDirectLinkMutation = () => useMutation({ mutationFn: createDirectLink });
export const useUpdateDirectLinkMutation = () => useMutation({ mutationFn: updateDirectLink });
export const useCreateAddAdUnitMutation = () => useMutation({ mutationFn: createAddAdUnit });
export const useSaveNativeBannerMutation = () => useMutation({ mutationFn: saveNativeBanner });

// Query
export const useQueryGetMyWebsites = (params = {}, options = {}) => useQuery({ queryKey: ['getMyWebsites ', params], queryFn: () => getMyWebsites(params), ...options });
export const useQueryGetMyDirectLinks = (params = {}, options = {}) => useQuery({ queryKey: ['getMyDirectLinks ', params], queryFn: () => getMyDirectLinks(params), ...options });
export const useQueryGetCategoryWebsite = (options = {}) => useQuery({ queryKey: ['getCategoryWebsite '], queryFn: () => getCategoryWebsite(), ...options });
export const useQueryGetMyWebsiteAdUnits = (websiteId, params = {}, options = {}) => useQuery({ queryKey: ['getMyWebsiteAdUnits', params], queryFn: () => getMyWebsiteAdUnits(websiteId, params), ...options });
