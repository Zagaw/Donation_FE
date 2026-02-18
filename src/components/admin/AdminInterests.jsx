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
  FaEye,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaUserCircle,
  FaTag,
  FaClipboardList
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

  // Details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'amber', bg: 'bg-amber-500', lightBg: 'bg-amber-50', text: 'text-amber-600', icon: FaClock },
    { value: 'approved', label: 'Approved', color: 'emerald', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', text: 'text-emerald-600', icon: FaCheckCircle },
    { value: 'rejected', label: 'Rejected', color: 'red', bg: 'bg-red-500', lightBg: 'bg-red-50', text: 'text-red-600', icon: FaTimesCircle },
    { value: 'completed', label: 'Completed', color: 'blue', bg: 'bg-blue-500', lightBg: 'bg-blue-50', text: 'text-blue-600', icon: FaCheckCircle },
    { value: 'all', label: 'All Interests', color: 'gray', bg: 'bg-gray-500', lightBg: 'bg-gray-50', text: 'text-gray-600', icon: FaHeart }
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
      fetchInterests();
      fetchStatusCounts();
      if (selectedInterest?.interestId === interestId) {
        setSelectedInterest(null);
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error approving interest:', error);
      alert('Failed to approve interest. Please try again.');
    }
  };

  const handleReject = async (interestId) => {
    if (!window.confirm('Are you sure you want to reject this interest?')) return;
    
    try {
      await adminApi.rejectInterest(interestId);
      fetchInterests();
      fetchStatusCounts();
      if (selectedInterest?.interestId === interestId) {
        setSelectedInterest(null);
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error rejecting interest:', error);
      alert('Failed to reject interest. Please try again.');
    }
  };

  const handleViewDetails = async (interest) => {
    try {
      setLoadingDetails(true);
      // You can fetch more details if needed, or just use the passed interest
      setSelectedInterest(interest);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching interest details:', error);
      alert('Failed to load interest details.');
    } finally {
      setLoadingDetails(false);
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

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

        {/* Status Summary Cards - Improved with better colors and hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statusOptions.map(option => {
            if (option.value === 'all') return null;
            const Icon = option.icon;
            const count = statusCounts[option.value] || 0;
            const isActive = statusFilter === option.value;
            
            return (
              <div 
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`relative overflow-hidden rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 transform ${
                  isActive 
                    ? `scale-105 shadow-lg ring-2 ring-offset-2 ring-${option.color}-500` 
                    : 'hover:scale-102 hover:shadow-lg'
                }`}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${option.color === 'amber' ? '#fbbf24' : option.color === 'emerald' ? '#10b981' : option.color === 'red' ? '#ef4444' : '#3b82f6'}15, white)`
                    : 'white'
                }}
              >
                {/* Decorative element */}
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${option.lightBg} opacity-50`}></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className={`text-sm font-medium ${option.text} mb-1`}>{option.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{count}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${option.lightBg} ${option.text} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="text-2xl" />
                  </div>
                </div>
                
                {/* Hover indicator */}
                <div className={`absolute bottom-0 left-0 w-full h-1 ${option.bg} transform scale-x-0 transition-transform duration-300 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></div>
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
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                        statusFilter === option.value
                          ? `${option.bg} text-white shadow-md transform scale-105`
                          : `${option.lightBg} ${option.text} hover:shadow-md hover:scale-102`
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
                      <tr key={interest.interestId} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                              {interest.donor?.user?.name?.charAt(0) || 'D'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {interest.donor?.user?.name || 'Unknown Donor'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: #{interest.donor?.donorId || interest.donor?.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaBox className="text-gray-400 mr-2 group-hover:text-teal-600 transition-colors" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {interest.request?.itemName || 'Unknown Item'}
                              </div>
                              <div className="text-sm text-gray-500">
                                Qty: {interest.request?.quantity || 'N/A'} | {interest.request?.category || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUser className="text-gray-400 mr-2 group-hover:text-indigo-600 transition-colors" />
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
                            <FaCalendarAlt className="mr-2 text-gray-400 group-hover:text-teal-600 transition-colors" />
                            {formatDateOnly(interest.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {interest.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(interest.interestId)}
                                  className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 hover:scale-110 transition-all duration-200"
                                  title="Approve Interest"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() => handleReject(interest.interestId)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:scale-110 transition-all duration-200"
                                  title="Reject Interest"
                                >
                                  <FaBan />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleViewDetails(interest)}
                              className="p-2 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 hover:scale-110 transition-all duration-200"
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

        {/* Interest Details Modal */}
        {showDetailsModal && selectedInterest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-teal-50 to-indigo-50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaHeart className="text-red-500 mr-2" />
                    Interest #{selectedInterest.interestId} Details
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Created on {formatDate(selectedInterest.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-600 text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {loadingDetails ? (
                  <div className="flex justify-center py-12">
                    <FaSpinner className="animate-spin text-4xl text-teal-600" />
                  </div>
                ) : (
                  <>
                    {/* Interest Status */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          selectedInterest.status === 'pending' ? 'bg-amber-100' :
                          selectedInterest.status === 'approved' ? 'bg-emerald-100' :
                          selectedInterest.status === 'rejected' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          {selectedInterest.status === 'pending' && <FaClock className="text-amber-600 text-2xl" />}
                          {selectedInterest.status === 'approved' && <FaCheckCircle className="text-emerald-600 text-2xl" />}
                          {selectedInterest.status === 'rejected' && <FaTimesCircle className="text-red-600 text-2xl" />}
                          {selectedInterest.status === 'completed' && <FaCheckCircle className="text-blue-600 text-2xl" />}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Current Status</p>
                          <p className="text-xl font-bold text-gray-800 capitalize">{selectedInterest.status}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedInterest.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        selectedInterest.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        selectedInterest.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {selectedInterest.status.charAt(0).toUpperCase() + selectedInterest.status.slice(1)}
                      </span>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Donor Information */}
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                          <FaUser className="text-teal-600 mr-2" />
                          Donor Information
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                              {selectedInterest.donor?.user?.name?.charAt(0) || 'D'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{selectedInterest.donor?.user?.name || 'N/A'}</p>
                              <p className="text-sm text-gray-500">Donor ID: #{selectedInterest.donor?.donorId || selectedInterest.donor?.id}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <FaEnvelope className="mr-2 text-teal-600 w-4" />
                              <span className="text-sm">{selectedInterest.donor?.user?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaPhone className="mr-2 text-teal-600 w-4" />
                              <span className="text-sm">{selectedInterest.donor?.user?.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaMapMarkerAlt className="mr-2 text-teal-600 w-4" />
                              <span className="text-sm">{selectedInterest.donor?.user?.address || 'N/A'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaTag className="mr-2 text-teal-600 w-4" />
                              <span className="text-sm">Donor Type: {selectedInterest.donor?.donorType === 'organization' ? 'Organization' : 'Personal'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Request Information */}
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                          <FaBox className="text-indigo-600 mr-2" />
                          Request Information
                        </h3>
                        
                        {selectedInterest.request ? (
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                {selectedInterest.request.receiver?.user?.name?.charAt(0) || 'R'}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{selectedInterest.request.receiver?.user?.name || 'N/A'}</p>
                                <p className="text-sm text-gray-500">Receiver ID: #{selectedInterest.request.receiverId}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">Item Name</p>
                                <p className="font-medium text-gray-800">{selectedInterest.request.itemName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Category</p>
                                <p className="font-medium text-gray-800">{selectedInterest.request.category || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Quantity</p>
                                <p className="font-medium text-gray-800">{selectedInterest.request.quantity}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="font-medium text-gray-800 capitalize">{selectedInterest.request.status}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Description</p>
                              <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                                {selectedInterest.request.description || 'No description provided'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No request information available</p>
                        )}
                      </div>
                    </div>

                    {/* Receiver Information (if not shown above) */}
                    {selectedInterest.request?.receiver && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                          <FaUserCircle className="text-purple-600 mr-2" />
                          Receiver Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Name</p>
                            <p className="font-medium text-gray-800">{selectedInterest.request.receiver.user?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Email</p>
                            <p className="font-medium text-gray-800 flex items-center">
                              <FaEnvelope className="mr-1 text-purple-600 text-xs" />
                              {selectedInterest.request.receiver.user?.email || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Phone</p>
                            <p className="font-medium text-gray-800 flex items-center">
                              <FaPhone className="mr-1 text-purple-600 text-xs" />
                              {selectedInterest.request.receiver.user?.phone || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Type</p>
                            <p className="font-medium text-gray-800">
                              {selectedInterest.request.receiver.receiverType === 'organization' ? 'Organization' : 'Individual'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interest Timeline */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <FaClock className="text-gray-600 mr-2" />
                        Interest Timeline
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <FaHeart className="text-teal-600 text-sm" />
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-800">Interest Created</p>
                            <p className="text-sm text-gray-500">{formatDate(selectedInterest.created_at)}</p>
                          </div>
                        </div>
                        
                        {(selectedInterest.status === 'approved' || selectedInterest.status === 'rejected') && (
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 w-8 h-8 ${
                              selectedInterest.status === 'approved' ? 'bg-emerald-100' : 'bg-red-100'
                            } rounded-full flex items-center justify-center`}>
                              {selectedInterest.status === 'approved' ? 
                                <FaCheckCircle className="text-emerald-600 text-sm" /> : 
                                <FaTimesCircle className="text-red-600 text-sm" />
                              }
                            </div>
                            <div className="ml-4">
                              <p className="font-medium text-gray-800">
                                Interest {selectedInterest.status === 'approved' ? 'Approved' : 'Rejected'}
                              </p>
                              <p className="text-sm text-gray-500">{formatDate(selectedInterest.updated_at)}</p>
                            </div>
                          </div>
                        )}

                        {selectedInterest.status === 'completed' && (
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaCheckCircle className="text-blue-600 text-sm" />
                            </div>
                            <div className="ml-4">
                              <p className="font-medium text-gray-800">Interest Completed</p>
                              <p className="text-sm text-gray-500">{formatDate(selectedInterest.updated_at)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                {selectedInterest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedInterest.interestId)}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                    >
                      <FaCheck className="mr-2" />
                      Approve Interest
                    </button>
                    <button
                      onClick={() => handleReject(selectedInterest.interestId)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <FaBan className="mr-2" />
                      Reject Interest
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInterests;