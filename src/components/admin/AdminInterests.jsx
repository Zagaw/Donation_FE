import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { adminApi } from '../../api/adminApi';
import { 
  FaHeart, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaSearch,
  FaUser,
  FaBox,
  FaCalendarAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaCheck,
  FaBan,
  FaEye
} from 'react-icons/fa';

const AdminInterests = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'amber', icon: FaClock },
    { value: 'approved', label: 'Approved', color: 'emerald', icon: FaCheckCircle },
    { value: 'rejected', label: 'Rejected', color: 'red', icon: FaTimesCircle },
    { value: 'completed', label: 'Completed', color: 'blue', icon: FaCheckCircle },
    { value: 'all', label: 'All Interests', color: 'gray', icon: FaHeart }
  ];

  useEffect(() => {
    fetchInterests();
    fetchStatusCounts();
  }, [statusFilter]);

  const fetchInterests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch(statusFilter) {
        case 'pending':
          response = await adminApi.getPendingInterests();
          break;
        case 'approved':
          response = await adminApi.getApprovedInterests();
          break;
        case 'rejected':
          response = await adminApi.getRejectedInterests();
          break;
        case 'completed':
          response = await adminApi.getCompletedInterests();
          break;
        default:
          response = await adminApi.getAllInterests();
      }
      
      setInterests(response.data.interests || []);
    } catch (error) {
      console.error('Error fetching interests:', error);
      setError('Failed to load interests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const response = await adminApi.getStatusCounts();
      setStatusCounts(response.data.interests || {
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0
      });
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  const handleApprove = async (interestId) => {
    if (!window.confirm('Are you sure you want to approve this interest?')) return;
    
    try {
      await adminApi.approveInterest(interestId);
      // Refresh the list
      fetchInterests();
      fetchStatusCounts();
    } catch (error) {
      console.error('Error approving interest:', error);
      alert('Failed to approve interest. Please try again.');
    }
  };

  const handleReject = async (interestId) => {
    if (!window.confirm('Are you sure you want to reject this interest?')) return;
    
    try {
      await adminApi.rejectInterest(interestId);
      // Refresh the list
      fetchInterests();
      fetchStatusCounts();
    } catch (error) {
      console.error('Error rejecting interest:', error);
      alert('Failed to reject interest. Please try again.');
    }
  };

  const filteredInterests = interests.filter(interest => {
    const matchesSearch = 
      (interest.donor?.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (interest.request?.itemName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (interest.request?.receiver?.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending', icon: FaClock };
      case 'approved':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved', icon: FaCheckCircle };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: FaTimesCircle };
      case 'completed':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed', icon: FaCheckCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status, icon: FaHeart };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && interests.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading interests...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Interest Management</h1>
          <p className="text-gray-600">Manage donor interests in community requests</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
            <button 
              onClick={fetchInterests}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statusOptions.map(option => {
            if (option.value === 'all') return null;
            const Icon = option.icon;
            const count = statusCounts[option.value] || 0;
            
            return (
              <div 
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-${option.color}-500 cursor-pointer transition-all hover:shadow-lg ${
                  statusFilter === option.value ? 'ring-2 ring-offset-2 ring-' + option.color + '-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-${option.color}-600 text-sm font-medium`}>{option.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{count}</p>
                  </div>
                  <Icon className={`text-${option.color}-500 text-3xl`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2 text-gray-400" />
                Search Interests
              </label>
              <input
                type="text"
                placeholder="Search by donor, item or receiver..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline mr-2 text-gray-400" />
                Status Filter
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setStatusFilter(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                        statusFilter === option.value
                          ? `bg-${option.color}-600 text-white`
                          : `bg-${option.color}-100 text-${option.color}-700 hover:bg-${option.color}-200`
                      }`}
                    >
                      <Icon className="mr-2" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Interests Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInterests.length > 0 ? (
                  filteredInterests.map((interest) => {
                    const status = getStatusBadge(interest.status);
                    const StatusIcon = status.icon;
                    
                    return (
                      <tr key={interest.interestId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                              {interest.donor?.user?.name?.charAt(0) || 'D'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {interest.donor?.user?.name || 'Unknown Donor'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: #{interest.donor?.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaBox className="text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {interest.request?.itemName || 'Unknown Item'}
                              </div>
                              <div className="text-sm text-gray-500">
                                Qty: {interest.request?.quantity} | {interest.request?.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUser className="text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">
                                {interest.request?.receiver?.user?.name || 'Unknown Receiver'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: #{interest.request?.receiverId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} flex items-center w-fit`}>
                            <StatusIcon className="mr-1" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            {formatDate(interest.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {interest.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(interest.interestId)}
                                  className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                                  title="Approve Interest"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() => handleReject(interest.interestId)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                  title="Reject Interest"
                                >
                                  <FaBan />
                                </button>
                              </>
                            )}
                            <button
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="text-gray-400 text-5xl mb-4">❤️</div>
                      <p className="text-lg">No interests found</p>
                      <p className="text-sm mt-2">
                        {searchTerm ? 'Try adjusting your search' : `No ${statusFilter} interests at the moment`}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {interests.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-teal-50 to-indigo-50 p-4 rounded-lg">
            <p className="text-gray-600">
              Showing <span className="font-medium text-teal-600">{filteredInterests.length}</span> of{' '}
              <span className="font-medium text-gray-800">{interests.length}</span> interests
              {statusFilter !== 'all' && ` with status "${statusFilter}"`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInterests;