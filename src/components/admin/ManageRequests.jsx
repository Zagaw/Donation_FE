import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEye, 
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaHandHoldingHeart,
  FaTag,
  FaSpinner,
  FaExclamationCircle
} from 'react-icons/fa';
import api from '../../api/api';
import RequestDetailsModal from './RequestDetailsModal';

const ManageRequests = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    matched: 0,
    executed: 0,
    completed: 0
  });
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'amber' },
    { value: 'approved', label: 'Approved', color: 'emerald' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'matched', label: 'Matched', color: 'indigo' },
    { value: 'executed', label: 'Executed', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'teal' }
  ];

  // Fetch requests based on filter
  useEffect(() => {
    fetchRequests();
    fetchStatusCounts();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (filter === 'all') {
        response = await api.admin.getAllRequests();
      } else {
        response = await api.admin.getRequestsByStatus(filter);
      }
      console.log('Requests response:', response.data);
      setRequests(response.data.requests || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.response?.data?.message || 'Failed to load requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const response = await api.admin.getStatusCounts();
      if (response.data && response.data.requests) {
        setStatusCounts(response.data.requests);
      }
    } catch (err) {
      console.error('Error fetching status counts:', err);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this request?')) {
      return;
    }
    
    setActionLoading(true);
    setProcessingId(id);
    try {
      await api.admin.approveRequest(id);
      await fetchRequests();
      await fetchStatusCounts();
      // Close modal if open
      if (selectedRequestId === id) {
        setSelectedRequestId(null);
      }
    } catch (err) {
      console.error('Error approving request:', err);
      alert(err.response?.data?.message || 'Failed to approve request');
    } finally {
      setActionLoading(false);
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this request?')) {
      return;
    }
    
    setActionLoading(true);
    setProcessingId(id);
    try {
      await api.admin.rejectRequest(id);
      await fetchRequests();
      await fetchStatusCounts();
      // Close modal if open
      if (selectedRequestId === id) {
        setSelectedRequestId(null);
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
      setProcessingId(null);
    }
  };

  const handleView = (id) => {
    console.log('Viewing request with ID:', id);
    setSelectedRequestId(id);
  };

  const handleCloseModal = () => {
    setSelectedRequestId(null);
  };

  const handleModalApprove = (id) => {
    handleApprove(id);
  };

  const handleModalReject = (id) => {
    handleReject(id);
  };

  const handleMatch = (id) => {
    window.location.href = `/admin/match/request/${id}`;
  };

  const handleBulkApprove = async () => {
    if (selectedRequests.length === 0) {
      alert('Please select at least one request');
      return;
    }

    if (!window.confirm(`Approve ${selectedRequests.length} request(s)?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await Promise.all(
        selectedRequests.map(id => 
          api.admin.approveRequest(id)
        )
      );
      setSelectedRequests([]);
      await fetchRequests();
      await fetchStatusCounts();
      alert(`Successfully approved ${selectedRequests.length} request(s)`);
    } catch (err) {
      console.error('Error bulk approving requests:', err);
      alert('Failed to approve some requests');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRequests(filteredRequests.map(r => r.requestId));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRequest = (id) => {
    setSelectedRequests(prev =>
      prev.includes(id)
        ? prev.filter(requestId => requestId !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' };
      case 'approved': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved' };
      case 'rejected': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' };
      case 'matched': return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Matched' };
      case 'executed': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Executed' };
      case 'completed': return { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Completed' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate total requests count (sum of all status counts)
  const totalRequestsCount = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  // Filter requests by search term
  const filteredRequests = requests.filter(request => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      request.itemName?.toLowerCase().includes(searchLower) ||
      request.description?.toLowerCase().includes(searchLower) ||
      request.receiver?.user?.name?.toLowerCase().includes(searchLower) ||
      request.category?.toLowerCase().includes(searchLower)
    );
  });

  if (loading && requests.length === 0) {
    return (
      <AdminLayout activePage="manage requests">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading requests...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="manage requests">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Requests</h1>
        <p className="text-gray-600">Review and process requests from community members</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-800">{totalRequestsCount}</p>
            </div>
            <FaHandHoldingHeart className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-gray-800">{statusCounts.pending || 0}</p>
            </div>
            <FaClock className="text-amber-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-gray-800">{statusCounts.approved || 0}</p>
            </div>
            <FaCheckCircle className="text-indigo-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg flex items-center">
          <FaExclamationCircle className="text-red-500 mr-3" />
          <span className="text-red-700">{error}</span>
          <button 
            onClick={fetchRequests}
            className="ml-auto bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2 text-gray-400" />
              Search Requests
            </label>
            <input
              type="text"
              placeholder="Search by item, description, or requester..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-2 text-gray-400" />
              Filter by Status
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Bulk Actions */}
        <div className="mt-4">
          <button
            onClick={handleBulkApprove}
            disabled={actionLoading || selectedRequests.length === 0}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading ? 'Processing...' : 'Approve Selected'}
          </button>
          {selectedRequests.length > 0 && (
            <span className="ml-3 text-sm text-gray-600">
              {selectedRequests.length} request(s) selected
            </span>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === option.value
                ? `bg-${option.color}-600 text-white`
                : `bg-${option.color}-100 text-${option.color}-700 hover:bg-${option.color}-200`
            }`}
          >
            {option.label}
            {option.value !== 'all' && statusCounts[option.value] > 0 && 
              ` (${statusCounts[option.value]})`
            }
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const status = getStatusColor(request.status);
                const isProcessing = processingId === request.requestId;
                
                return (
                  <tr key={request.requestId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        checked={selectedRequests.includes(request.requestId)}
                        onChange={() => handleSelectRequest(request.requestId)}
                        disabled={isProcessing}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-teal-100 mr-3">
                          <FaHandHoldingHeart className="text-teal-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {request.itemName || 'Unnamed Request'}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs">
                              {request.category || 'General'}
                            </span>
                            <span className="ml-2">Qty: {request.quantity || 'N/A'}</span>
                          </div>
                          {request.description && (
                            <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                              {request.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {request.receiver?.user?.name || 'Unknown Requester'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {request.receiver?.user?.address || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(request.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(request.requestId)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View Details"
                          disabled={isProcessing}
                        >
                          <FaEye />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.requestId)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve"
                              disabled={isProcessing || actionLoading}
                            >
                              {isProcessing ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                            </button>
                            <button
                              onClick={() => handleReject(request.requestId)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                              disabled={isProcessing || actionLoading}
                            >
                              {isProcessing ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />}
                            </button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <button
                            onClick={() => handleMatch(request.requestId)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Match to Donation"
                            disabled={isProcessing}
                          >
                            <FaTag />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {!loading && filteredRequests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Requests Found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'No requests match your search criteria'
              : filter !== 'all'
                ? `No ${filter} requests available`
                : 'No requests have been created yet'
            }
          </p>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequestId && (
        <RequestDetailsModal 
          requestId={selectedRequestId} 
          onClose={handleCloseModal}
          onApprove={handleModalApprove}
          onReject={handleModalReject}
        />
      )}
    </AdminLayout>
  );
};

export default ManageRequests;