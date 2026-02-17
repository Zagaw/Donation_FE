import React, { useState, useEffect } from 'react';
import DonorLayout from './DonorLayout';
import { donationApi } from '../../api/donationApi';
import { interestApi } from '../../api/interestApi';
import { 
  FaFilter, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaUser, 
  FaHeart,
  FaClock,
  FaExclamationTriangle,
  FaHandHoldingHeart,
  FaSpinner,
  FaBox,
  FaBuilding,
  FaUserCircle
} from 'react-icons/fa';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [interestedIds, setInterestedIds] = useState([]);
  const [showInterestLoading, setShowInterestLoading] = useState(false);

  useEffect(() => {
    fetchApprovedRequests();
    fetchMyInterests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await donationApi.getApprovedRequests();
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError(error.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyInterests = async () => {
    try {
      const response = await interestApi.getMyInterests();
      // Assuming the API returns interests with requestId
      const interested = response.data.interests?.map(i => i.requestId) || [];
      setInterestedIds(interested);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  const handleShowInterest = async (requestId) => {
    try {
      setShowInterestLoading(true);
      await interestApi.create( requestId );
      // Update local state
      setInterestedIds(prev => [...prev, requestId]);
      alert('Your interest has been recorded! The admin will review and match you with this request.');
    } catch (error) {
      console.error('Error showing interest:', error);
      alert(error.response?.data?.message || 'Failed to show interest. Please try again.');
    } finally {
      setShowInterestLoading(false);
    }
  };

  // Calculate category counts from actual data
  const categories = [
    { id: 'all', label: 'All Requests', color: 'gray' },
    { id: 'food', label: 'Food', color: 'teal' },
    { id: 'clothing', label: 'Clothing', color: 'indigo' },
    { id: 'medical', label: 'Medical', color: 'emerald' },
    { id: 'educational', label: 'Educational', color: 'amber' },
    { id: 'other', label: 'Other', color: 'blue' },
  ];

  // Add counts to categories
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: cat.id === 'all' 
      ? requests.length 
      : requests.filter(r => r.category === cat.id).length
  }));

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.category === filter;
    const matchesSearch = 
      (request.itemName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.receiver?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    switch(category?.toLowerCase()) {
      case 'food': return 'bg-teal-100 text-teal-700';
      case 'clothing': return 'bg-indigo-100 text-indigo-700';
      case 'medical': return 'bg-emerald-100 text-emerald-700';
      case 'educational': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Calculate statistics from real data
  const totalRequests = requests.length;

  if (loading) {
    return (
      <DonorLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading requests...</p>
          </div>
        </div>
      </DonorLayout>
    );
  }

  return (
    <DonorLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Community Requests</h1>
        <p className="text-gray-600">Browse approved requests from community members in need</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={fetchApprovedRequests}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2 text-gray-400" />
              Search Requests
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by item, description or requester..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-2 text-gray-400" />
              Filter by Category
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {categoriesWithCounts.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categoriesWithCounts.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === cat.id
                ? `bg-${cat.color}-600 text-white`
                : `bg-${cat.color}-100 text-${cat.color}-700 hover:bg-${cat.color}-200`
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map(request => {
            const isInterested = interestedIds.includes(request.requestId);
            
            return (
              <div
                key={request.requestId}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                {/* Header */}
                <div className="p-6 rounded-t-xl bg-gradient-to-r from-teal-50 to-indigo-50 border-l-4 border-teal-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{request.itemName}</h3>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(request.category)}`}>
                          {request.category?.charAt(0).toUpperCase() + request.category?.slice(1)}
                        </span>
                        <span className="flex items-center text-sm text-gray-600">
                          <FaClock className="mr-1" />
                          {getTimeAgo(request.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{request.quantity}</div>
                      <div className="text-sm text-gray-500">Items Needed</div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{request.description}</p>
                  
                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      {request.receiver?.receiverType === 'organization' ? (
                        <FaBuilding className="mr-2 text-amber-600" />
                      ) : (
                        <FaUserCircle className="mr-2 text-teal-600" />
                      )}
                      <span className="truncate" title={request.receiver?.name}>
                        {request.receiver?.name || 'Anonymous'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendar className="mr-2 text-amber-600" />
                      <span>Posted {getTimeAgo(request.created_at)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaBox className="mr-2 text-indigo-600" />
                      <span>Status: {request.status}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleShowInterest(request.requestId)}
                      disabled={isInterested || showInterestLoading}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all transform hover:-translate-y-1 flex items-center justify-center ${
                        isInterested
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      {showInterestLoading ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaHandHoldingHeart className="mr-2" />
                      )}
                      {isInterested ? 'Interest Already Shown' : 'Show Interest'}
                    </button>
                    <button className={`p-3 border border-gray-300 rounded-lg transition-colors ${
                      isInterested ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
                    }`}>
                      <FaHeart className={isInterested ? 'text-red-600' : 'text-gray-600'} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Requests Found</h3>
          <p className="text-gray-600">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'There are no approved requests at the moment'}
          </p>
        </div>
      )}

      {/* Stats Summary */}
      {requests.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-800">{totalRequests}</p>
              </div>
              <FaHandHoldingHeart className="text-teal-600 text-2xl" />
            </div>
          </div>
        </div>
      )}
    </DonorLayout>
  );
};

export default RequestList;