import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { adminApi } from '../../api/adminApi';
import { 
  FaSearch, 
  FaFilter, 
  FaHandshake, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEye,
  FaUser,
  FaBox,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExchangeAlt,
  FaRandom,
  FaChartLine,
  FaSpinner,
  FaExclamationTriangle,
  FaCheck,
  FaBan,
  FaHeart,
  FaUserCircle,
  FaBuilding,
  FaClock,
  FaTruck,
  FaFlagCheckered
} from 'react-icons/fa';

const ManageMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showManualMatchModal, setShowManualMatchModal] = useState(false);
  const [showInterestMatchModal, setShowInterestMatchModal] = useState(false);
  const [approvedDonations, setApprovedDonations] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [approvedInterests, setApprovedInterests] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    executed: 0,
    completed: 0
  });

  const statusOptions = [
    { value: 'all', label: 'All Matches', color: 'gray', icon: FaHandshake },
    { value: 'approved', label: 'Approved', color: 'indigo', icon: FaCheckCircle },
    { value: 'executed', label: 'Executed', color: 'blue', icon: FaTruck },
    { value: 'completed', label: 'Completed', color: 'emerald', icon: FaFlagCheckered },
  ];

  useEffect(() => {
    fetchMatches();
  }, [statusFilter]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch(statusFilter) {
        case 'approved':
          response = await adminApi.getApprovedMatches();
          break;
        case 'executed':
          response = await adminApi.getExecutedMatches();
          break;
        case 'completed':
          response = await adminApi.getCompletedMatches();
          break;
        default:
          response = await adminApi.getAllMatches();
      }
      
      const matchesData = response.data.matches || [];
      setMatches(matchesData);
      
      // Calculate stats
      const allMatches = await adminApi.getAllMatches();
      const allData = allMatches.data.matches || [];
      
      setStats({
        total: allData.length,
        approved: allData.filter(m => m.status === 'approved').length,
        executed: allData.filter(m => m.status === 'executed').length,
        completed: allData.filter(m => m.status === 'completed').length
      });
      
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to load matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchingData = async () => {
    try {
      setModalLoading(true);
      const [donationsRes, requestsRes, interestsRes] = await Promise.all([
        adminApi.getApprovedDonations(),
        adminApi.getApprovedRequests(),
        adminApi.getApprovedInterests()
      ]);
      
      setApprovedDonations(donationsRes.data.donations || []);
      setApprovedRequests(requestsRes.data.requests || []);
      setApprovedInterests(interestsRes.data.interests || []);
    } catch (error) {
      console.error('Error fetching matching data:', error);
      alert('Failed to load matching data');
    } finally {
      setModalLoading(false);
    }
  };

  const handleManualMatch = async () => {
    if (!selectedDonation || !selectedRequest) {
      alert('Please select both a donation and a request');
      return;
    }

    try {
      setModalLoading(true);
      const response = await adminApi.manualMatch({
        donationId: selectedDonation.donationId,
        requestId: selectedRequest.requestId
      });
      
      alert('Match created successfully!');
      setShowManualMatchModal(false);
      setSelectedDonation(null);
      setSelectedRequest(null);
      fetchMatches(); // Refresh the list
    } catch (error) {
      console.error('Error creating manual match:', error);
      alert(error.response?.data?.message || 'Failed to create match');
    } finally {
      setModalLoading(false);
    }
  };

  const handleInterestMatch = async () => {
    if (!selectedInterest) {
      alert('Please select an interest');
      return;
    }

    try {
      setModalLoading(true);
      const response = await adminApi.matchByInterest(selectedInterest.interestId);
      
      alert('Match created successfully using interest!');
      setShowInterestMatchModal(false);
      setSelectedInterest(null);
      fetchMatches(); // Refresh the list
    } catch (error) {
      console.error('Error creating interest match:', error);
      alert(error.response?.data?.message || 'Failed to create match');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    const donationName = match.donation?.itemName || '';
    const requestName = match.request?.itemName || '';
    const donorName = match.donation?.donor?.user?.name || match.interest?.donor?.user?.name || '';
    const receiverName = match.request?.receiver?.user?.name || '';
    
    const matchesSearch = 
      donationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receiverName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved':
        return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Approved', icon: FaCheckCircle };
      case 'executed':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Executed', icon: FaTruck };
      case 'completed':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completed', icon: FaFlagCheckered };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status, icon: FaHandshake };
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

  if (loading && matches.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading matches...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Matches</h1>
          <p className="text-gray-600">Match donations with requests and track progress</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
            <button 
              onClick={fetchMatches}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Matches</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <FaHandshake className="text-teal-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-gray-800">{stats.approved}</p>
              </div>
              <FaCheckCircle className="text-indigo-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Executed</p>
                <p className="text-3xl font-bold text-gray-800">{stats.executed}</p>
              </div>
              <FaTruck className="text-blue-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
              </div>
              <FaFlagCheckered className="text-emerald-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Matching Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-teal-50 to-indigo-50 rounded-xl p-6 border border-teal-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaHeart className="text-red-500 mr-2" />
              Interest-Based Matching
            </h2>
            <p className="text-gray-600 mb-4">Create matches from approved donor interests</p>
            <button
              onClick={() => {
                setShowInterestMatchModal(true);
                fetchMatchingData();
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <FaRandom className="mr-2" />
              Match Using Interests
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaHandshake className="text-indigo-600 mr-2" />
              Manual Matching
            </h2>
            <p className="text-gray-600 mb-4">Manually match approved donations with approved requests</p>
            <button
              onClick={() => {
                setShowManualMatchModal(true);
                fetchMatchingData();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <FaExchangeAlt className="mr-2" />
              Create Manual Match
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2 text-gray-400" />
                Search Matches
              </label>
              <input
                type="text"
                placeholder="Search by donation, request, donor or receiver..."
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

        {/* Matches List */}
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredMatches.map((match) => {
              const status = getStatusColor(match.status);
              const StatusIcon = status.icon;
              const donation = match.donation;
              const request = match.request;
              const interest = match.interest;
              
              const donorName = donation?.donor?.user?.name || interest?.donor?.user?.name || 'Unknown Donor';
              const receiverName = request?.receiver?.user?.name || 'Unknown Receiver';
              const donationItem = donation?.itemName || 'No donation';
              const requestItem = request?.itemName || 'No request';
              const matchType = interest ? 'Interest-based' : 'Manual';
              
              return (
                <div key={match.matchId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                  {/* Match Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${status.bg} mr-3`}>
                          <StatusIcon className={status.text} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">Match #{match.matchId}</h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {formatDate(match.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text} flex items-center`}>
                          <StatusIcon className="mr-1" />
                          {status.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {matchType}
                        </p>
                      </div>
                    </div>
                  </div>


                  {/* Match Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Donation/Interest Info */}
                      <div className="bg-teal-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          {match.matchType === 'interest' ? (
                            <>
                              <FaHeart className="text-red-500 mr-2" />
                              <span className="font-medium text-gray-800">Interest</span>
                            </>
                          ) : (
                            <>
                              <FaBox className="text-teal-600 mr-2" />
                              <span className="font-medium text-gray-800">Donation</span>
                            </>
                          )}
                        </div>
                        
                        {match.matchType === 'interest' && match.interest ? (
                          <>
                            <div className="text-sm text-gray-700 font-medium">
                              Interest from: {match.interest?.donor?.user?.name || 'Unknown Donor'}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              For: {match.request?.itemName || 'Unknown Item'}
                            </div>
                            <div className="text-xs text-gray-500 mt-2 flex items-center">
                              <FaHeart className="mr-1 text-red-400" />
                              Interest-based match
                            </div>
                          </>
                        ) : match.donation ? (
                          <>
                            <div className="text-sm text-gray-700 font-medium">{match.donation.itemName}</div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <FaUser className="mr-1" /> {match.donation?.donor?.user?.name || 'Unknown Donor'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Qty: {match.donation.quantity}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500 italic">No donation information</div>
                        )}
                      </div>
                      
                      {/* Request Info */}
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaHandshake className="text-indigo-600 mr-2" />
                          <span className="font-medium text-gray-800">Request</span>
                        </div>
                        <div className="text-sm text-gray-700 font-medium">{match.request?.itemName || 'Unknown Item'}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <FaUser className="mr-1" /> {match.request?.receiver?.user?.name || 'Unknown Receiver'}
                        </div>
                        {match.request && (
                          <div className="text-xs text-gray-500 mt-1">
                            Qty: {match.request.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Match Type Badge */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        match.matchType === 'interest' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {match.matchType === 'interest' ? '🎯 Interest-Based Match' : '🤝 Manual Match'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                        <FaEye className="mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-gray-400 text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Matches Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first match using the options above'}
            </p>
          </div>
        )}

        {/* Manual Match Modal */}
        {showManualMatchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Create Manual Match</h2>
                <p className="text-gray-600 mt-1">Select an approved donation and request to match</p>
              </div>
              
              <div className="p-6">
                {modalLoading ? (
                  <div className="flex justify-center py-12">
                    <FaSpinner className="animate-spin text-4xl text-teal-600" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Donations List */}
                    <div>
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <FaBox className="mr-2 text-teal-600" />
                        Approved Donations ({approvedDonations.length})
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {approvedDonations.map(donation => (
                          <div
                            key={donation.donationId}
                            onClick={() => setSelectedDonation(donation)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedDonation?.donationId === donation.donationId
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-300'
                            }`}
                          >
                            <div className="font-medium text-gray-800">{donation.itemName}</div>
                            <div className="text-sm text-gray-600">Donor: {donation.donor?.user?.name}</div>
                            <div className="text-sm text-gray-500">Quantity: {donation.quantity}</div>
                          </div>
                        ))}
                        {approvedDonations.length === 0 && (
                          <p className="text-center text-gray-500 py-8">No approved donations available</p>
                        )}
                      </div>
                    </div>

                    {/* Requests List */}
                    <div>
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <FaHandshake className="mr-2 text-indigo-600" />
                        Approved Requests ({approvedRequests.length})
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {approvedRequests.map(request => (
                          <div
                            key={request.requestId}
                            onClick={() => setSelectedRequest(request)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedRequest?.requestId === request.requestId
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            <div className="font-medium text-gray-800">{request.itemName}</div>
                            <div className="text-sm text-gray-600">Receiver: {request.receiver?.user?.name}</div>
                            <div className="text-sm text-gray-500">Quantity: {request.quantity}</div>
                          </div>
                        ))}
                        {approvedRequests.length === 0 && (
                          <p className="text-center text-gray-500 py-8">No approved requests available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowManualMatchModal(false);
                    setSelectedDonation(null);
                    setSelectedRequest(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualMatch}
                  disabled={!selectedDonation || !selectedRequest || modalLoading}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {modalLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaHandshake className="mr-2" />}
                  Create Match
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interest Match Modal */}
        {showInterestMatchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Match Using Interests</h2>
                <p className="text-gray-600 mt-1">Select an approved interest to create a match</p>
              </div>
              
              <div className="p-6">
                {modalLoading ? (
                  <div className="flex justify-center py-12">
                    <FaSpinner className="animate-spin text-4xl text-teal-600" />
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {approvedInterests.map(interest => (
                      <div
                        key={interest.interestId}
                        onClick={() => setSelectedInterest(interest)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedInterest?.interestId === interest.interestId
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-800">
                              Donor: {interest.donor?.user?.name}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Interested in: <span className="font-medium">{interest.request?.itemName}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Receiver: {interest.request?.receiver?.user?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Quantity: {interest.request?.quantity}
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                            Interest
                          </span>
                        </div>
                      </div>
                    ))}
                    {approvedInterests.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No approved interests available</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowInterestMatchModal(false);
                    setSelectedInterest(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInterestMatch}
                  disabled={!selectedInterest || modalLoading}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {modalLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaHeart className="mr-2" />}
                  Create Match
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageMatches;