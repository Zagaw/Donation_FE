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

  // Delete request
  delete: (id) => {
    return api.delete(`/receiver/requests/${id}`);
  },

  // Update request
  /*update: (id, requestData) => {
    return api.put(`/receiver/requests/${id}`, requestData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }*/

     // Get approved requests (for donors)
  getApprovedRequests: () => {
    return api.get('/donor/requests/approved');
  }
};