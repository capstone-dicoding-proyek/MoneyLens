import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTransaction,
  deleteTransaction,
  getTransactionDashboard,
  getTransactionHistory,
  postTransactionUpload,
} from '../api/transaction';
import { putUserName } from '../api/user';
import { QUERY_KEYS } from '../api/query-keys';

export function useDashboardQuery(params = '', options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard(params),
    queryFn: () => getTransactionDashboard(params),
    ...options,
  });
}

export function useHistoryQuery(params = '', options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.history(params),
    queryFn: () => getTransactionHistory(params),
    ...options,
  });
}

export function useCreateTransactionMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useDeleteTransactionMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useUploadTransactionMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTransactionUpload,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useUpdateProfileMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putUserName,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

