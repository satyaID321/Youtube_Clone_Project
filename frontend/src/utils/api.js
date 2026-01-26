import axios from 'axios';

const API_BASE_URL = '/api';

export const videoAPI = {
  getAll: (params) => axios.get(`${API_BASE_URL}/videos`, { params }),
  getById: (id) => axios.get(`${API_BASE_URL}/videos/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/videos`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/videos/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/videos/${id}`),
  like: (id) => axios.post(`${API_BASE_URL}/videos/${id}/like`),
  dislike: (id) => axios.post(`${API_BASE_URL}/videos/${id}/dislike`)
};

export const channelAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/channels`),
  getById: (id) => axios.get(`${API_BASE_URL}/channels/${id}`),
  getByOwner: (userId) => axios.get(`${API_BASE_URL}/channels/owner/${userId}`),
  create: (data) => axios.post(`${API_BASE_URL}/channels`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/channels/${id}`, data)
};

export const commentAPI = {
  getByVideo: (videoId) => axios.get(`${API_BASE_URL}/comments/video/${videoId}`),
  create: (data) => axios.post(`${API_BASE_URL}/comments`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/comments/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/comments/${id}`)
};
