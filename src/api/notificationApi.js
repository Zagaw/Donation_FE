// src/api/notificationApi.js
import api from './axios';

export const notificationApi = {
  // Get all notifications
  getNotifications: (page = 1, perPage = 20) => {
    return api.get(`/notifications?page=${page}&per_page=${perPage}`);
  },

  // Get unread count
  getUnreadCount: () => {
    return api.get('/notifications/unread-count');
  },

  // Mark notification as read
  markAsRead: (id) => {
    return api.post(`/notifications/${id}/mark-as-read`);
  },

  // Mark all as read
  markAllAsRead: () => {
    return api.post('/notifications/mark-all-as-read');
  },

  deleteNotification: (id) => {
    return api.delete(`/notifications/${id}`);
  },

  clearAll: () => {
    return api.delete('/notifications/clear-all');
  },

  // Get match details for notification click
  getMatchDetails: (id) => {
    return api.get(`/matches/${id}`);
  }
};