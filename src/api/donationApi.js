// src/api/donationApi.js
import api from './axios';

export const donationApi = {
  // Create a donation
  create: (donationData) => {
    // Note: Using FormData for file upload
    return api.post('/donor/donations', donationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get user's donations
  getMyDonations: () => {
    return api.get('/donor/donations');
  },

  // Delete donation
  delete: (id) => {
    return api.delete(`/donor/donations/${id}`);
  },

  // Get all donations (admin)
  getAll: () => {
    return api.get('/admin/donations');
  },

  // Get approved requests for donors
  getApprovedRequests: () => {
    return api.get('/donor/requests/approved');
  },

  // Update donation status (admin)
  /*updateStatus: (id, status) => {
    return api.put(`/admin/donations/${id}/status`, { status });
  }*/
};