import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEye, 
  FaEdit,
  FaBox,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaSpinner,
  FaExclamationCircle
} from 'react-icons/fa';
import api from '../../api/api';
import DonationDetailsModal from './DonationDetailsModal';

const ManageDonations = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    matched: 0,
    executed: 0,
    completed: 0
  });
  const [selectedDonations, setSelectedDonations] = useState([]);
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

  // Fetch donations based on filter
  useEffect(() => {
    fetchDonations();
    fetchStatusCounts();
  }, [filter]);

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (filter === 'all') {
        response = await api.admin.getAllDonations();
      } else {
        response = await api.admin.getDonationsByStatus(filter);
      }
      setDonations(response.data.donations || []);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError(err.response?.data?.message || 'Failed to load donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const response = await api.admin.getStatusCounts();
      if (response.data && response.data.donations) {
        setStatusCounts(response.data.donations);
      }
    } catch (err) {
      console.error('Error fetching status counts:', err);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this donation?')) {
      return;
    }
    
    setActionLoading(true);
    setProcessingId(id);
    try {
      await api.admin.approveDonation(id);
      await fetchDonations();
      await fetchStatusCounts();
      // Close modal if open
      if (selectedDonationId === id) {
        setSelectedDonationId(null);
      }
    } catch (err) {
      console.error('Error approving donation:', err);
      alert(err.response?.data?.message || 'Failed to approve donation');
    } finally {
      setActionLoading(false);
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this donation?')) {
      return;
    }
    
    setActionLoading(true);
    setProcessingId(id);
    try {
      await api.admin.rejectDonation(id);
      await fetchDonations();
      await fetchStatusCounts();
      // Close modal if open
      if (selectedDonationId === id) {
        setSelectedDonationId(null);
      }
    } catch (err) {
      console.error('Error rejecting donation:', err);
      alert(err.response?.data?.message || 'Failed to reject donation');
    } finally {
      setActionLoading(false);
      setProcessingId(null);
    }
  };

  const handleView = (id) => {
    setSelectedDonationId(id);
  };

  const handleCloseModal = () => {
    setSelectedDonationId(null);
  };

  const handleModalApprove = (id) => {
    handleApprove(id);
  };

  const handleModalReject = (id) => {
    handleReject(id);
  };

  const handleBulkApprove = async () => {
    if (selectedDonations.length === 0) {
      alert('Please select at least one donation');
      return;
    }

    if (!window.confirm(`Approve ${selectedDonations.length} donation(s)?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await Promise.all(
        selectedDonations.map(id => 
          api.admin.approveDonation(id)
        )
      );
      setSelectedDonations([]);
      await fetchDonations();
      await fetchStatusCounts();
      alert(`Successfully approved ${selectedDonations.length} donation(s)`);
    } catch (err) {
      console.error('Error bulk approving donations:', err);
      alert('Failed to approve some donations');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDonations(filteredDonations.map(d => d.donationId));
    } else {
      setSelectedDonations([]);
    }
  };

  const handleSelectDonation = (id) => {
    setSelectedDonations(prev =>
      prev.includes(id)
        ? prev.filter(donationId => donationId !== id)
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

  const getCategoryColor = (category) => {
    switch(category?.toLowerCase()) {
      case 'food': return { bg: 'bg-teal-100', text: 'text-teal-700' };
      case 'clothing': return { bg: 'bg-indigo-100', text: 'text-indigo-700' };
      case 'medical': return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
      case 'educational': return { bg: 'bg-amber-100', text: 'text-amber-700' };
      case 'shelter': return { bg: 'bg-blue-100', text: 'text-blue-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
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

  // Calculate total donations count (sum of all status counts)
  const totalDonationsCount = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  // Filter donations by search term
  const filteredDonations = donations.filter(donation => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      donation.title?.toLowerCase().includes(searchLower) ||
      donation.description?.toLowerCase().includes(searchLower) ||
      donation.donor?.user?.name?.toLowerCase().includes(searchLower) ||
      donation.category?.toLowerCase().includes(searchLower) ||
      donation.itemName?.toLowerCase().includes(searchLower)
    );
  });

  if (loading && donations.length === 0) {
    return (
      <AdminLayout activePage="manage donations">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading donations...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="manage donations">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Donations</h1>
        <p className="text-gray-600">Review, approve, or reject donations from donors</p>
      </div>

      {/* Stats Summary - Only 3 cards now */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Donations</p>
              <p className="text-3xl font-bold text-gray-800">{totalDonationsCount}</p>
            </div>
            <FaBox className="text-teal-600 text-2xl" />
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
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-gray-800">{statusCounts.approved || 0}</p>
            </div>
            <FaCheckCircle className="text-emerald-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg flex items-center">
          <FaExclamationCircle className="text-red-500 mr-3" />
          <span className="text-red-700">{error}</span>
          <button 
            onClick={fetchDonations}
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
              Search Donations
            </label>
            <input
              type="text"
              placeholder="Search by title, description, or donor..."
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
            disabled={actionLoading || selectedDonations.length === 0}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading ? 'Processing...' : 'Approve Selected'}
          </button>
          {selectedDonations.length > 0 && (
            <span className="ml-3 text-sm text-gray-600">
              {selectedDonations.length} donation(s) selected
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

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    checked={selectedDonations.length === filteredDonations.length && filteredDonations.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => {
                const status = getStatusColor(donation.status);
                const category = getCategoryColor(donation.category);
                const isProcessing = processingId === donation.donationId;
                
                return (
                  <tr key={donation.donationId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        checked={selectedDonations.includes(donation.donationId)}
                        onChange={() => handleSelectDonation(donation.donationId)}
                        disabled={isProcessing}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${category.bg} mr-3`}>
                          <FaBox className={category.text} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {donation.title || donation.itemName || 'Unnamed Item'}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${category.bg} ${category.text}`}>
                              {donation.category || 'General'}
                            </span>
                            <span className="ml-2">Qty: {donation.quantity || 'N/A'}</span>
                          </div>
                          {donation.description && (
                            <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                              {donation.description}
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
                            {donation.donor?.user?.name || 'Unknown Donor'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {donation.donor?.user?.address || 'N/A'}
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
                      {formatDate(donation.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(donation.donationId)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View Details"
                          disabled={isProcessing}
                        >
                          <FaEye />
                        </button>
                        {donation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(donation.donationId)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve"
                              disabled={isProcessing || actionLoading}
                            >
                              {isProcessing ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                            </button>
                            <button
                              onClick={() => handleReject(donation.donationId)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                              disabled={isProcessing || actionLoading}
                            >
                              {isProcessing ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />}
                            </button>
                          </>
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
      {!loading && filteredDonations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-gray-400 text-5xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Donations Found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'No donations match your search criteria'
              : filter !== 'all'
                ? `No ${filter} donations available`
                : 'No donations have been created yet'
            }
          </p>
        </div>
      )}

      {/* Donation Details Modal */}
      {selectedDonationId && (
        <DonationDetailsModal 
          donationId={selectedDonationId} 
          onClose={handleCloseModal}
          onApprove={handleModalApprove}
          onReject={handleModalReject}
        />
      )}
    </AdminLayout>
  );
};

export default ManageDonations;