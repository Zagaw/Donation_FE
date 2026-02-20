// src/api/requestApi.js
import api from './axios';

export const requestApi = {
  // Create a request (NRC fields are REQUIRED)
  create: (requestData) => {
    // Using FormData for file upload
    return api.post('/receiver/requests', requestData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get user's requests
  getMyRequests: () => {
    return api.get('/receiver/requests');
  },

  // For detailed requests page (wrapped object)
  getMyRequestsWithDetails: () => {
    return api.get('/receiver/requests/details');
  },

  // Delete request
  delete: (id) => {
    return api.delete(`/receiver/requests/${id}`);
  },

  requestExecution: (matchId) => {
    return api.post(`/receiver/matches/${matchId}/request-execution`);
  },

  // Update request
  /*update: (id, requestData) => {
    return api.put(`/receiver/requests/${id}`, requestData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }*/

    // Get my matches (for receiver)
  getMyMatches: () => {
    return api.get('/receiver/matches');
  },

  // Get single match details (for receiver)
  getMatchDetails: (id) => {
    return api.get(`/receiver/matches/${id}`);
  },

     // Get approved requests (for donors)
  getApprovedRequests: () => {
    return api.get('/donor/requests/approved');
  },
};