// src/pages/MatchDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notificationApi } from '../api/notificationApi';
import { 
  FaHandshake, 
  FaUser, 
  FaBox, 
  FaCalendarAlt,
  FaHeart,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft,
  FaCheckCircle,
  FaTruck,
  FaFlagCheckered,
  FaBuilding,
  FaUserCircle,
  FaClock
} from 'react-icons/fa';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchMatchDetails();
    fetchCurrentUser();
  }, [id]);

  const fetchCurrentUser = async () => {
    try {
      // You'll need to add this endpoint to your authApi
      const response = await api.get('/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationApi.getMatchDetails(id);
      setMatch(response.data.match);
    } catch (error) {
      console.error('Error fetching match details:', error);
      setError(error.response?.data?.message || 'Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-teal-600 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3 text-xl" />
              <p className="text-red-700">{error || 'Match not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const status = getStatusColor(match.status);
  const StatusIcon = status.icon;
  
  // Determine if current user is donor or receiver (you'll get this from the user state)
  const isDonor = user?.role === 'donor';
  const isReceiver = user?.role === 'receiver';

  // Get the appropriate contact based on user role
  const contactPerson = isDonor ? match.request?.receiver?.user : match.donation?.donor?.user || match.interest?.donor?.user;
  const contactType = isDonor ? 'Receiver' : 'Donor';
  const contactRole = isDonor ? 'receiver' : 'donor';
  
  // Get item details
  const itemName = match.donation?.itemName || match.request?.itemName || 'N/A';
  const itemQuantity = match.donation?.quantity || match.request?.quantity || 'N/A';
  const itemDescription = match.donation?.description || match.request?.description || 'No description';

  // Get donor/receiver type for display
  const getPersonType = () => {
    if (isDonor && match.request?.receiver?.receiverType) {
      return match.request.receiver.receiverType === 'organization' ? 'Organization' : 'Individual';
    }
    if (isReceiver) {
      if (match.donation?.donor?.donorType) {
        return match.donation.donor.donorType === 'organization' ? 'Organization' : 'Personal Donor';
      }
      if (match.interest?.donor?.donorType) {
        return match.interest.donor.donorType === 'organization' ? 'Organization' : 'Personal Donor';
      }
    }
    return 'Individual';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-teal-600 mb-4 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Match Details</h1>
          <p className="text-gray-600">View complete information about this match</p>
        </div>

        {/* Match Status Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-lg ${status.bg}`}>
                <StatusIcon className={`${status.text} text-3xl`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Match #{match.matchId}</p>
                <h2 className="text-2xl font-bold text-gray-800">{status.label}</h2>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              match.matchType === 'interest' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {match.matchType === 'interest' ? '🎯 Interest-Based Match' : '🤝 Manual Match'}
            </span>
          </div>
        </div>

        {/* Important: Contact Information Card */}
        <div className="bg-gradient-to-r from-teal-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-8 border-2 border-teal-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaUser className="text-teal-600 mr-3" />
            {contactType} Contact Information
            <span className="ml-3 px-3 py-1 text-sm bg-white rounded-full text-teal-600 border border-teal-300">
              {getPersonType()}
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                <FaUserCircle className="text-teal-600 mr-2" />
                Personal Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800 text-lg">{contactPerson?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-800 flex items-center break-all">
                    <FaEnvelope className="mr-2 text-teal-600 flex-shrink-0" />
                    <span>{contactPerson?.email || 'N/A'}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-800 flex items-center">
                    <FaPhone className="mr-2 text-teal-600 flex-shrink-0" />
                    <span>{contactPerson?.phone || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                <FaMapMarkerAlt className="text-teal-600 mr-2" />
                Address & Location
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Street Address</p>
                  <p className="font-medium text-gray-800">{contactPerson?.address || 'N/A'}</p>
                </div>
                {isDonor && match.request?.location && (
                  <div>
                    <p className="text-xs text-gray-500">Preferred Location</p>
                    <p className="font-medium text-gray-800">{match.request.location}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{contactType} Type</p>
                  <p className="font-medium text-gray-800">
                    {isDonor 
                      ? (match.request?.receiver?.receiverType === 'organization' ? 'Organization' : 'Individual')
                      : (match.donation?.donor?.donorType === 'organization' ? 'Organization' : 'Personal Donor')
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-teal-100 p-4 rounded-lg">
            <p className="text-teal-800">
              <span className="font-bold">📞 Next Steps:</span> Please contact the {contactType.toLowerCase()} using the information above to arrange the donation delivery. 
              Make sure to coordinate a convenient time and location for both parties.
            </p>
          </div>
        </div>

        {/* Additional Details - Two Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Donation/Interest Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              {match.matchType === 'interest' ? (
                <>
                  <FaHeart className="text-red-500 mr-2" />
                  Interest Details
                </>
              ) : (
                <>
                  <FaBox className="text-teal-600 mr-2" />
                  Donation Details
                </>
              )}
            </h3>
            
            {match.matchType === 'interest' && match.interest ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Donor Name</p>
                    <p className="font-medium text-gray-800">{match.interest.donor?.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Interest Date</p>
                    <p className="font-medium text-gray-800">{formatDate(match.interest.created_at)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Interested In</p>
                  <p className="font-medium text-gray-800">{match.request?.itemName || 'N/A'}</p>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium text-gray-800 capitalize">{match.interest.status}</p>
                </div>
              </div>
            ) : match.donation ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Item Name</p>
                    <p className="font-medium text-gray-800">{match.donation.itemName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="font-medium text-gray-800">{match.donation.quantity}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium text-gray-800">{match.donation.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-gray-600">{match.donation.description || 'No description'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Donation Date</p>
                  <p className="font-medium text-gray-800">{formatDate(match.donation.created_at)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No donation information available</p>
            )}
          </div>

          {/* Request Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <FaHandshake className="text-indigo-600 mr-2" />
              Request Details
            </h3>
            
            {match.request ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Item Name</p>
                    <p className="font-medium text-gray-800">{match.request.itemName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="font-medium text-gray-800">{match.request.quantity}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium text-gray-800">{match.request.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-gray-600">{match.request.description || 'No description'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Request Date</p>
                  <p className="font-medium text-gray-800">{formatDate(match.request.created_at)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No request information available</p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <FaClock className="text-gray-600 mr-2" />
            Match Timeline
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <FaHandshake className="text-teal-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-800">Match Created</p>
                <p className="text-sm text-gray-500">{formatDate(match.created_at)}</p>
              </div>
            </div>
            
            {(match.status === 'executed' || match.status === 'completed') && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaTruck className="text-blue-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium text-gray-800">Donation Executed</p>
                  <p className="text-sm text-gray-500">{formatDate(match.updated_at)}</p>
                </div>
              </div>
            )}

            {match.status === 'completed' && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FaFlagCheckered className="text-emerald-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium text-gray-800">Match Completed</p>
                  <p className="text-sm text-gray-500">{formatDate(match.updated_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Print Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;