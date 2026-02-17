import api from './axios';

export const adminApi = {
  // Dashboard
  getDashboard: () => {
    return api.get('/admin/dashboard');
  },

  // Users
  getAllUsers: () => {
    return api.get('/admin/users');
  },

  // Status Counts
  getStatusCounts: () => {
    return api.get('/admin/status-counts');
  },

  // Donations
  getAllDonations: () => {
    return api.get('/admin/donations');
  },

  getDonationDetails: (id) => {
    return api.get(`/admin/donations/${id}`);
  },

  getDonationsByStatus: (status) => {
    return api.get(`/admin/donations/${status}`);
  },

  approveDonation: (id) => {
    return api.post(`/admin/donations/${id}/approve`);
  },

  rejectDonation: (id) => {
    return api.post(`/admin/donations/${id}/reject`);
  },

  // Requests
  getAllRequests: () => {
    return api.get('/admin/requests');
  },

  getRequestDetails: (id) => {
    return api.get(`/admin/requests/${id}`);
  },

  getRequestsByStatus: (status) => {
    return api.get(`/admin/requests/${status}`);
  },

  approveRequest: (id) => {
    return api.post(`/admin/requests/${id}/approve`);
  },

  rejectRequest: (id) => {
    return api.post(`/admin/requests/${id}/reject`);
  },

  // Interests
  getPendingInterests: () => {
    return api.get('/admin/interests/pending');
  },

  getApprovedInterests: () => {
    // You'll need to add this route in your backend
    return api.get('/admin/interests/approved');
  },

  getRejectedInterests: () => {
    // You'll need to add this route in your backend
    return api.get('/admin/interests/rejected');
  },

  getCompletedInterests: () => {
    // You'll need to add this route in your backend
    return api.get('/admin/interests/completed');
  },

  getAllInterests: () => {
    // You'll need to add this route in your backend
    return api.get('/admin/interests');
  },

  approveInterest: (id) => {
    return api.post(`/admin/interests/${id}/approve`);
  },

  rejectInterest: (id) => {
    return api.post(`/admin/interests/${id}/reject`);
  },

  // Matches
  getAllMatches: () => {
    return api.get('/admin/matches');
  },

  getApprovedMatches: () => {
    return api.get('/admin/matches/approved');
  },

  getExecutedMatches: () => {
    return api.get('/admin/matches/executed');
  },

  getCompletedMatches: () => {
    return api.get('/admin/matches/completed');
  },

  getMatchDetails: (id) => {
    return api.get(`/admin/matches/${id}`);
  },

  // Matching data
  getApprovedDonations: () => {
    return api.get('/admin/matching/approved-donations');
  },

  getApprovedRequests: () => {
    return api.get('/admin/matching/approved-requests');
  },

  getMatchedInterests: () => {
    return api.get('/admin/matching/matched-interests');
  },

  getApprovedInterests: () => {
    return api.get('/admin/matching/approved-interests');
  },

  // Matching
  matchByInterest: (interestId) => {
    return api.post(`/admin/match/interest/${interestId}`);
  },

  manualMatch: (matchData) => {
    return api.post('/admin/match/manual', matchData);
  },

  // Execution
  executeDonation: (matchId) => {
    return api.post(`/admin/matches/${matchId}/execute`);
  },

  completeMatch: (matchId) => {
    return api.post(`/admin/matches/${matchId}/complete`);
  }
};