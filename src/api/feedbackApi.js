// src/api/feedbackApi.js
import api from './axios';

export const feedbackApi = {
  // User feedback methods
  getMyFeedback: () => {
    return api.get('/feedback/my-feedback');
  },

  getEligibleMatchesForFeedback: () => {
    return api.get('/feedback/eligible-matches');
  },

  submitFeedback: (data) => {
    return api.post('/feedback', data);
  },

  updateFeedback: (id, data) => {
    return api.put(`/feedback/${id}`, data);
  },

  deleteFeedback: (id) => {
    return api.delete(`/feedback/${id}`);
  },

  // Admin feedback methods
  getAllFeedback: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/admin/feedback${params ? `?${params}` : ''}`);
  },

  getFeedbackStatistics: () => {
    return api.get('/admin/feedback/statistics');
  },

  getFeedbackDetails: (id) => {
    return api.get(`/admin/feedback/${id}`);
  },

  approveFeedback: (id) => {
    return api.post(`/admin/feedback/${id}/approve`);
  },

  rejectFeedback: (id, admin_response) => {
    return api.post(`/admin/feedback/${id}/reject`, { admin_response });
  },

  featureFeedback: (id) => {
    return api.post(`/admin/feedback/${id}/feature`);
  },

  respondToFeedback: (id, admin_response) => {
    return api.post(`/admin/feedback/${id}/respond`, { admin_response });
  },

  deleteFeedbackAdmin: (id) => {
    return api.delete(`/admin/feedback/${id}`);
  }
};