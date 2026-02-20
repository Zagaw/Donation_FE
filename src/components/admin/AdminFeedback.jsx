// src/components/admin/AdminFeedback.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { feedbackApi } from '../../api/feedbackApi';
import { 
  FaStar,
  FaRegStar,
  FaComment,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaSpinner,
  FaTrash,
  FaEye,
  FaFilter,
  FaSearch,
  FaUser,
  FaUserSecret,
  FaChartBar,
  FaThumbsUp,
  FaThumbsDown,
  FaStarHalfAlt
} from 'react-icons/fa';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    rating: 'all',
    category: 'all',
    userRole: 'all',
    search: ''
  });
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');

  useEffect(() => {
    fetchFeedback();
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [filters]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackApi.getAllFeedback(filters);
      setFeedback(response.data.feedback || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await feedbackApi.getFeedbackStatistics();
      setStats(response.data.statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await feedbackApi.approveFeedback(id);
      await fetchFeedback();
      await fetchStatistics();
    } catch (error) {
      console.error('Error approving feedback:', error);
      alert('Failed to approve feedback');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!adminResponse.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      await feedbackApi.rejectFeedback(selectedFeedback.feedbackId, adminResponse);
      setShowResponseModal(false);
      setAdminResponse('');
      await fetchFeedback();
      await fetchStatistics();
    } catch (error) {
      console.error('Error rejecting feedback:', error);
      alert('Failed to reject feedback');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeature = async (id) => {
    try {
      setActionLoading(true);
      await feedbackApi.featureFeedback(id);
      await fetchFeedback();
      await fetchStatistics();
    } catch (error) {
      console.error('Error featuring feedback:', error);
      alert('Failed to feature feedback');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      setActionLoading(true);
      await feedbackApi.deleteFeedbackAdmin(id);
      await fetchFeedback();
      await fetchStatistics();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending', icon: FaClock };
      case 'approved':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved', icon: FaCheckCircle };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: FaTimesCircle };
      case 'featured':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Featured', icon: FaStar };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      donation_experience: 'Donation Experience',
      request_experience: 'Request Experience',
      matching_process: 'Matching Process',
      communication: 'Communication',
      platform_usability: 'Platform Usability',
      other: 'Other'
    };
    return categories[category] || category;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-amber-400">
            {star <= rating ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
      </div>
    );
  };

  if (loading && !feedback.length) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-teal-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Feedback Management</h1>
          <p className="text-gray-600">Manage and respond to user feedback</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Feedback</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total_feedback}</p>
                </div>
                <FaComment className="text-teal-600 text-2xl" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.average_rating}</p>
                </div>
                <FaStar className="text-indigo-600 text-2xl" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Pending Reviews</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.status_breakdown.pending}</p>
                </div>
                <FaClock className="text-amber-600 text-2xl" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.status_breakdown.approved}</p>
                </div>
                <FaCheckCircle className="text-emerald-600 text-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FaFilter className="mr-2 text-teal-600" />
            Filter Feedback
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="featured">Featured</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={filters.rating}
                onChange={(e) => setFilters({...filters, rating: e.target.value})}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all">All Categories</option>
                <option value="donation_experience">Donation Experience</option>
                <option value="request_experience">Request Experience</option>
                <option value="matching_process">Matching Process</option>
                <option value="communication">Communication</option>
                <option value="platform_usability">Platform Usability</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={filters.userRole}
                onChange={(e) => setFilters({...filters, userRole: e.target.value})}
              >
                <option value="all">All Users</option>
                <option value="donor">Donors</option>
                <option value="receiver">Receivers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search comments or users..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedback.length > 0 ? (
                  feedback.map((item) => {
                    const status = getStatusBadge(item.status);
                    const StatusIcon = status.icon;
                    
                    return (
                      <tr key={item.feedbackId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                              {item.is_anonymous ? (
                                <FaUserSecret />
                              ) : (
                                item.user?.name?.charAt(0) || 'U'
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.is_anonymous ? 'Anonymous' : item.user?.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.userRole} {item.is_anonymous && '(hidden)'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStars(item.rating)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {getCategoryLabel(item.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                            {item.comment || 'No comment'}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} flex items-center w-fit`}>
                            <StatusIcon className="mr-1" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedFeedback(item);
                                setShowDetailsModal(true);
                              }}
                              className="p-2 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            
                            {item.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(item.feedbackId)}
                                  disabled={actionLoading}
                                  className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                                  title="Approve"
                                >
                                  <FaThumbsUp />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedFeedback(item);
                                    setShowResponseModal(true);
                                  }}
                                  disabled={actionLoading}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                  title="Reject"
                                >
                                  <FaThumbsDown />
                                </button>
                              </>
                            )}
                            
                            {item.status === 'approved' && (
                              <button
                                onClick={() => handleFeature(item.feedbackId)}
                                disabled={actionLoading}
                                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                                title="Feature"
                              >
                                <FaStar />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDelete(item.feedbackId)}
                              disabled={actionLoading}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <FaComment className="text-gray-300 text-5xl mx-auto mb-4" />
                      <p>No feedback found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Feedback Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">User:</span> {selectedFeedback.is_anonymous ? 'Anonymous' : selectedFeedback.user?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Role:</span> {selectedFeedback.userRole}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {getCategoryLabel(selectedFeedback.category)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Rating:</span> {renderStars(selectedFeedback.rating)}
                  </p>
                </div>

                {selectedFeedback.comment && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Comment:</h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {selectedFeedback.comment}
                    </p>
                  </div>
                )}

                {selectedFeedback.match && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Related Match:</h3>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Match ID:</span> #{selectedFeedback.match.matchId}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Item:</span> {selectedFeedback.match.donation?.itemName || selectedFeedback.match.request?.itemName}
                      </p>
                    </div>
                  </div>
                )}

                {selectedFeedback.admin_response && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Admin Response:</h3>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-gray-600">{selectedFeedback.admin_response}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Responded on {new Date(selectedFeedback.responded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Reject Feedback</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Please provide a reason for rejecting this feedback. This will be visible to the user.
                </p>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Reason for rejection..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                />
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setAdminResponse('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {actionLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaTimesCircle className="mr-2" />}
                  Reject Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;