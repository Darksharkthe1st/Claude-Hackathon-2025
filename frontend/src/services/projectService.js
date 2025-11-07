import { createApiClient } from './apiClient.js';

const baseClient = createApiClient();

export const fetchProjects = async (params = {}, token) => {
  const client = token ? createApiClient(token) : baseClient;
  const { data } = await client.get('/projects', { params });
  return data;
};

export const fetchProject = async (id, token) => {
  const client = token ? createApiClient(token) : baseClient;
  const { data } = await client.get(`/projects/${id}`);
  return data;
};

export const createProject = async (payload, token) => {
  const client = createApiClient(token);
  const { data } = await client.post('/projects', payload);
  return data;
};

export const joinProject = async (id, token) => {
  const client = createApiClient(token);
  const { data } = await client.post(`/projects/${id}/volunteer`);
  return data;
};

