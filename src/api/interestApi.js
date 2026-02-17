import api from './axios';

export const interestApi = {
  /**
   * Show interest in a request (for donors)
   * POST /donor/requests/{id}/interest
   */
  create: (requestId) => {
    return api.post(`/donor/requests/${requestId}/interest`);
  },

  /**
   * Get my interests (for donors)
   * GET /donor/interests
   */
  getMyInterests: () => {
    return api.get('/donor/interests');
  },

  /**
   * Withdraw interest (for donors)
   * DELETE /donor/interests/{id}
   */
  delete: (interestId) => {
    return api.delete(`/donor/interests/${interestId}`);
  },
}