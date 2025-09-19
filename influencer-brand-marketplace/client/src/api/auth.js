import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/signup', userData),
  verifyToken: (token) => {
    // This would typically call a verify endpoint
    // For simplicity, we'll decode the token and return the user data
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Promise.resolve({
        id: payload.id,
        email: payload.email,
        role: payload.role,
        name: payload.name
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export const influencerAPI = {
  createProfile: (profileData) => api.post('/influencer/onboard', profileData),
  getProfile: (id) => api.get(`/influencer/profile/${id}`),
  updateProfile: (id, updates) => api.put(`/influencer/update/${id}`, updates),
  getInstagramStats: (id) => api.get(`/influencer/${id}/instagram-stats`),
};

export const brandAPI = {
  createProfile: (profileData) => api.post('/brand/onboard', profileData),
  getProfile: (id) => api.get(`/brand/profile/${id}`),
};

export const campaignsAPI = {
  create: (campaignData) => api.post('/campaigns/create', campaignData),
  getAll: () => api.get('/campaigns'),
  get: (id) => api.get(`/campaigns/${id}`),
  update: (id, updates) => api.put(`/campaigns/${id}`, updates),
  apply: (campaignId, proposal) => api.post(`/campaigns/${campaignId}/apply`, proposal),
  updateProposal: (campaignId, proposalId, status) => api.put(`/campaigns/${campaignId}/proposals/${proposalId}`, { status }),
};

export const chatAPI = {
  getChats: () => api.get('/chat'),
  getMessages: (chatId) => api.get(`/chat/${chatId}`),
  sendMessage: (chatId, message) => api.post(`/chat/${chatId}/send`, { message }),
};

export default api;