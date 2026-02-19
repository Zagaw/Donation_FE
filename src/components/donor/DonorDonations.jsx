// src/components/donor/DonorDonations.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorLayout from './DonorLayout';
import { donationApi } from '../../api/donationApi';
import { 
  FaBox, 
  FaCalendarAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaTrash,
  FaFilter,
  FaSearch,
  FaHeart,
  FaHandshake,
  FaTruck,
  FaFlagCheckered
} from 'react-icons/fa';

const DonorDonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('donations'); // 'donations' or 'matches'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [donationsRes, matchesRes] = await Promise.all([
        donationApi.getMyDonationsWithDetails(),
        donationApi.getMyMatches()
      ]);
      
      setDonations(donationsRes.data.donations || []);
      setMatches(matchesRes.data.matches || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    
    try {
      await donationApi.delete(id);
      setDonations(prev => prev.filter(d => d.donationId !== id));
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Failed to delete donation');
    }
  };

  const handleViewMatch = (matchId) => {
    navigate(`/donor/matches/${matchId}`);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending', icon: FaClock };
      case 'approved':
        return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Approved', icon: FaCheckCircle };
      case 'matched':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Matched', icon: FaHeart };
      case 'executed':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Executed', icon: FaTruck };
      case 'completed':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completed', icon: FaFlagCheckered };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: FaTimesCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status, icon: FaBox };
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    const matchesSearch = 
      (donation.itemName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (donation.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      (match.request?.itemName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (match.request?.receiver?.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DonorLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your donations...</p>
          </div>
        </div>
      </DonorLayout>
    );
  }

  return (
    <DonorLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Donations & Matches</h1>
          <p className="text-gray-600">Track your donations and view matched requests</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'donations'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Donations ({donations.length})
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'matches'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Matches ({matches.length})
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2 text-gray-400" />
                Search
              </label>
              <input
                type="text"
                placeholder={activeTab === 'donations' 
                  ? "Search by item name or description..." 
                  : "Search by item or receiver name..."}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === 'donations' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaFilter className="inline mr-2 text-gray-400" />
                  Filter by Status
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="matched">Matched</option>
                  <option value="executed">Executed</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'donations' ? (
          // Donations List
          filteredDonations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.map(donation => {
                const status = getStatusBadge(donation.status);
                const StatusIcon = status.icon;
                
                return (
                  <div key={donation.donationId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{donation.itemName}</h3>
                          <p className="text-sm text-gray-500">ID: #{donation.donationId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} flex items-center`}>
                          <StatusIcon className="mr-1" />
                          {status.label}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Quantity:</span> {donation.quantity}
                        </p>
                        {donation.category && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Category:</span> {donation.category}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {formatDate(donation.created_at)}
                        </p>
                      </div>

                      {donation.description && (
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {donation.description}
                        </p>
                      )}

                      {donation.status === 'pending' && (
                        <button
                          onClick={() => handleDeleteDonation(donation.donationId)}
                          className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <FaTrash className="mr-2" />
                          Delete Donation
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <FaBox className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Donations Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'You haven\'t made any donations yet'}
              </p>
              <a
                href="/donor/donate"
                className="inline-block mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Make a Donation
              </a>
            </div>
          )
        ) : (
          // Matches List
          filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map(match => {
                const status = getStatusBadge(match.status);
                const StatusIcon = status.icon;
                
                return (
                  <div key={match.matchId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {match.request?.itemName || 'Unknown Item'}
                          </h3>
                          <p className="text-sm text-gray-500">Match #{match.matchId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} flex items-center`}>
                          <StatusIcon className="mr-1" />
                          {status.label}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Receiver:</span> {match.request?.receiver?.user?.name || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Quantity:</span> {match.request?.quantity || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {formatDate(match.created_at)}
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          match.matchType === 'interest' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {match.matchType === 'interest' ? 'Interest-Based' : 'Manual Match'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleViewMatch(match.matchId)}
                        className="w-full mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                      >
                        <FaEye className="mr-2" />
                        View Match Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <FaHandshake className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Matches Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'You don\'t have any matches yet'}
              </p>
            </div>
          )
        )}
      </div>
    </DonorLayout>
  );
};

export default DonorDonations;