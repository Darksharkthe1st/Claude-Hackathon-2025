import { createApiClient } from './apiClient.js';

const client = createApiClient();

export const registerRequest = async (payload) => {
  const { data } = await client.post('/auth/register', payload);
  return data;
};

export const loginRequest = async (payload) => {
  const { data } = await client.post('/auth/login', payload);
  return data;
};

export const getProfile = async (token) => {
  const authedClient = createApiClient(token);
  const { data } = await authedClient.get('/auth/me');
  return data;
};

