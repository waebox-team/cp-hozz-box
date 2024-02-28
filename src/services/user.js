import { useMutation, useQuery } from '@tanstack/react-query';
import { ROOT_API } from 'constants/common';
import { request } from 'utils/request';

export const getProfile = () => request.get(ROOT_API + '/api/v1/publisher/profile');
export const updateProfile = async (data) => {
    return await request.post(ROOT_API + '/api/v1/publisher/change-information', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
export const register = data => request.post(ROOT_API + '/api/v1/publisher/register', data);
export const changePassword = data => request.post(ROOT_API + '/api/v1/publisher/change-password', data);
export const login = data => request.post(ROOT_API + '/api/v1/publisher/login', data);

// Mutation
export const useRegisterMutation = () => useMutation({ mutationFn: register });
export const useLoginMutation = () => useMutation({ mutationFn: login });
export const useChangePasswordMutation = () => useMutation({ mutationFn: changePassword });
export const useUpdateProfileMutation = () => useMutation({ mutationFn: updateProfile });

// Query
export const useQueryUserProfile = (options = {}) => useQuery({ queryKey: ['getUserProfile'], queryFn: () => getProfile(), ...options });
