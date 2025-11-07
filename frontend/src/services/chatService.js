import { createApiClient } from './apiClient.js';

export const fetchChat = async (projectId, token) => {
  const client = createApiClient(token);
  const { data } = await client.get(`/chat/${projectId}`);
  return data;
};

export const postChatMessage = async (projectId, message, token) => {
  const client = createApiClient(token);
  const { data } = await client.post(`/chat/${projectId}`, { message });
  return data;
};

