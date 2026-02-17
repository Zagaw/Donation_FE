import React, { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaBox, 
  FaUser, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaImage,
  FaIdCard,
  FaSpinner
} from 'react-icons/fa';
import api from '../../api/api';

const DonationDetailsModal = ({ donationId, onClose, onApprove, onReject }) => {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'nrc'

  useEffect(() => {
    fetchDonationDetails();
  }, [donationId]);

  const fetchDonationDetails = async () => {
    setLoading(true);
    try {
      // Using your existing showDonation endpoint
      const response = await api.admin.getDonationDetails(donationId);
      setDonation(response.data.donation);
    } catch (err) {
      console.error('Error fetching donation details:', err);
      setError(err.response?.data?.message || 'Failed to load donation details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' };
      case 'approved': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved' };
      case 'rejected': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading donation details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full">
          <div className="text-center">
            <FaTimesCircle className="text-4xl text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error || 'Donation not found'}</p>
            <button
              onClick={onClose}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = getStatusColor(donation.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Donation Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="px-6 pt-4">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>

        {/* Tab Navigation - Only show if NRC images exist */}
        {(donation.nrc_front_url || donation.nrc_back_url) && (
          <div className="px-6 pt-4 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'details'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaBox className="inline mr-2" />
                Donation Details
              </button>
              <button
                onClick={() => setActiveTab('nrc')}
                className={`pb-2 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'nrc'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaIdCard className="inline mr-2" />
                NRC Documents
              </button>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        <div className="px-6 py-4">
          {activeTab === 'details' && (
            <>
              {/* Main Info Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Left Column - Item Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{donation.itemName}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaTag className="text-teal-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="text-gray-800 font-medium">{donation.category || 'General'}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaBox className="text-teal-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="text-gray-800 font-medium">{donation.quantity || 'N/A'}</p>
                      </div>
                    </div>

                    {donation.nrcNumber && (
                      <div className="flex items-start">
                        <FaIdCard className="text-teal-600 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">NRC Number</p>
                          <p className="text-gray-800 font-medium">{donation.nrcNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Donor Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Donor Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaUser className="text-teal-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-800 font-medium">{donation.donor?.user?.name || 'Unknown'}</p>
                      </div>
                    </div>

                    {donation.donor?.user?.email && (
                      <div className="flex items-start">
                        <FaUser className="text-teal-600 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-800 font-medium">{donation.donor.user.email}</p>
                        </div>
                      </div>
                    )}

                    {donation.donor?.user?.phone && (
                      <div className="flex items-start">
                        <FaUser className="text-teal-600 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-800 font-medium">{donation.donor.user.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-teal-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-800 font-medium">{donation.donor?.user?.address || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaCalendarAlt className="text-teal-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Posted Date</p>
                        <p className="text-gray-800 font-medium">{formatDate(donation.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {donation.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{donation.description}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FaClock className="text-gray-400 mr-2" />
                    <span className="text-gray-600">Created: {formatDate(donation.created_at)}</span>
                  </div>
                  {donation.updated_at && donation.updated_at !== donation.created_at && (
                    <div className="flex items-center text-sm">
                      <FaClock className="text-gray-400 mr-2" />
                      <span className="text-gray-600">Last Updated: {formatDate(donation.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* NRC Documents Tab */}
          {activeTab === 'nrc' && (
            <div className="py-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaIdCard className="mr-2 text-teal-600" />
                NRC Documents
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Front NRC */}
                {donation.nrc_front_url && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">NRC Front</h4>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <img 
                        src={donation.nrc_front_url} 
                        alt="NRC Front"
                        className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(donation.nrc_front_url, '_blank')}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Click image to view full size
                    </p>
                  </div>
                )}

                {/* Back NRC */}
                {donation.nrc_back_url && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">NRC Back</h4>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <img 
                        src={donation.nrc_back_url} 
                        alt="NRC Back"
                        className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(donation.nrc_back_url, '_blank')}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Click image to view full size
                    </p>
                  </div>
                )}
              </div>

              {/* NRC Number */}
              {donation.nrcNumber && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">NRC Number</p>
                  <p className="text-lg font-medium text-gray-800">{donation.nrcNumber}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          {donation.status === 'pending' && (
            <>
              <button
                onClick={() => {
                  if (onApprove) onApprove(donation.donationId);
                  onClose();
                }}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  if (onReject) onReject(donation.donationId);
                  onClose();
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationDetailsModal;