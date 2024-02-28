import { useMutation, useQuery } from '@tanstack/react-query';
import { ROOT_API } from 'constants/common';
import { request } from 'utils/request';

export const getTickets = (params) => request.get(ROOT_API + '/api/v1/publisher/ticket', { params });
export const createTicket = data => request.post(ROOT_API + '/api/v1/publisher/ticket', data);

// Mutation
export const useCreateTicketMutation = () => useMutation({ mutationFn: createTicket });

// Query
export const useQueryGetTickets = (params = {}, options = {}) => useQuery({ queryKey: ['getTickets', params], queryFn: () => getTickets(params), ...options });
