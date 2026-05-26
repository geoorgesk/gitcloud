import api from './api';

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};