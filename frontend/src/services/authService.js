import api from './api';

export const register = async (username, email, password) => {
  const { data } = await api.post('/auth/register', { username, email, password });
  return data;
};

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};