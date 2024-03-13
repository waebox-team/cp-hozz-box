import { useMutation, useQuery } from '@tanstack/react-query';
import { request } from 'utils/request';

export const getProfile = () => request.get('/api/v1/user/profile');
export const updateProfile = async data => {
  return await request.post('/api/v1/user/change-information', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const register = data => request.post('/api/v1/user/register', data);
export const changePassword = data => request.post('/api/v1/user/change-password', data);
export const login = data => request.post('/api/v1/user/login', data);

// Mutation
export const useRegisterMutation = () => useMutation({ mutationFn: register });
export const useLoginMutation = () => useMutation({ mutationFn: login });
export const useChangePasswordMutation = () => useMutation({ mutationFn: changePassword });
export const useUpdateProfileMutation = () => useMutation({ mutationFn: updateProfile });

// Query
export const useQueryUserProfile = (options = {}) => useQuery({ queryKey: ['getUserProfile'], queryFn: () => getProfile(), ...options });
