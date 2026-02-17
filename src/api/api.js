// src/api/api.js
import { authApi } from './authApi';
import { donationApi } from './donationApi';
import { requestApi } from './requestApi';
import { adminApi } from './adminApi';

// Export all API methods
export const api = {
  auth: authApi,
  donations: donationApi,
  requests: requestApi,
  admin: adminApi,
  // We'll add more API modules here as we create them
  // donations: donationApi,
  // requests: requestApi,
  // admin: adminApi,
};

export default api;