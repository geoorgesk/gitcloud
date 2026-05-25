import api from './api';

export const uploadPhoto = async (file, albumId = null) => {
  const formData = new FormData();
  formData.append('photo', file);
  if (albumId) formData.append('albumId', albumId);
  const { data } = await api.post('/photos/upload', formData);
  return data;
};

export const getPhotos = async (params = {}) => {
  const { data } = await api.get('/photos', { params });
  return data;
};

export const deletePhoto = async (id) => {
  const { data } = await api.delete(`/photos/${id}`);
  return data;
};

export const toggleFavorite = async (id) => {
  const { data } = await api.patch(`/photos/${id}/favorite`);
  return data;
};

export const getStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};

export const getAlbums = async () => {
  const { data } = await api.get('/albums');
  return data;
};

export const createAlbum = async (name) => {
  const { data } = await api.post('/albums', { name });
  return data;
};

export const deleteAlbum = async (id) => {
  const { data } = await api.delete(`/albums/${id}`);
  return data;
};

export const assignToAlbum = async (photoId, albumId) => {
  const { data } = await api.patch(`/photos/${photoId}/album`, { albumId });
  return data;
};