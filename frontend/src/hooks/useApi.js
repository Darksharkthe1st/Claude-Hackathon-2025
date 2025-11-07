import { useMemo } from 'react';
import { useAuth } from './useAuth.js';
import { createApiClient } from '../services/apiClient.js';

export const useApi = () => {
  const { token } = useAuth();

  return useMemo(() => createApiClient(token), [token]);
};

