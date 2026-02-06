import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
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
  FaChartLine
} from 'react-icons/fa';

const ManageMatches = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const matches = [
    {
      id: 1,
      donation: 'Rice & Cooking Oil',
      donor: 'John Smith',
      request: 'Food supplies for family',
      requester: 'Sarah Johnson',
      date: '2024-01-15',
      status: 'completed',
      location: 'Downtown',
      value: '$150'
    },
    {
      id: 2,
      donation: 'Winter Blankets',
      donor: 'Community Center',
      request: 'Blankets for homeless shelter',
      requester: 'Community Shelter',
      date: '2024-01-14',
      status: 'in_progress',
      location: 'North Area',
      value: '$200'
    },
    {
      id: 3,
      donation: 'School Supplies',
      donor: 'Sarah Johnson',
      request: 'Educational materials',
      requester: 'Local School',
      date: '2024-01-13',
      status: 'pending',
      location: 'East Side',
      value: '$120'
    },
    {
      id: 4,
      donation: 'First Aid Kits',
      donor: 'City Hospital',
      request: 'Medical supplies for clinic',
      requester: 'Community Clinic',
      date: '2024-01-12',
      status: 'completed',
      location: 'Medical District',
      value: '$75'
    },
    {
      id: 5,
      donation: 'Baby Formula',
      donor: 'Supermarket Chain',
      request: 'Infant formula needed',
      requester: 'Single Mother Support',
      date: '2024-01-11',
      status: 'cancelled',
      location: 'Central Market',
      value: '$180'
    },
    {
      id: 6,
      donation: 'Warm Clothing',
      donor: 'Local Charity',
      request: 'Winter clothing for seniors',
      requester: 'Elderly Care Center',
      date: '2024-01-10',
      status: 'in_progress',
      location: 'West District',
      value: '$300'
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Matches', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'amber' },
    { value: 'in_progress', label: 'In Progress', color: 'indigo' },
    { value: 'completed', label: 'Completed', color: 'emerald' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'failed', label: 'Failed', color: 'gray' },
  ];

  const filteredMatches = matches.filter(match => {
    const matchesFilter = filter === 'all' || match.status === filter;
    const matchesSearch = match.donation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.request.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (id) => {
    alert(`Match ${id} approved`);
    // Implement approval logic
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this match?')) {
      alert(`Match ${id} cancelled`);
      // Implement cancellation logic
    }
  };

  const handleView = (id) => {
    alert(`View details for match ${id}`);
    // Implement view logic
  };

  const handleAutoMatch = () => {
    alert('Running auto-matching algorithm...');
    // Implement auto-matching logic
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' };
      case 'in_progress': return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'In Progress' };
      case 'completed': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completed' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' };
      case 'failed': return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Failed' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getMatchScore = (match) => {
    // Calculate match score based on various factors
    const baseScore = 85;
    const randomVariation = Math.floor(Math.random() * 15);
    return baseScore + randomVariation;
  };

  return (
    <AdminLayout activePage="manage matches">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Matches</h1>
        <p className="text-gray-600">Match donations with requests and track progress</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Matches</p>
              <p className="text-3xl font-bold text-gray-800">{matches.length}</p>
            </div>
            <FaHandshake className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Successful</p>
              <p className="text-3xl font-bold text-gray-800">{matches.filter(m => m.status === 'completed').length}</p>
            </div>
            <FaCheckCircle className="text-emerald-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-800">{matches.filter(m => m.status === 'in_progress').length}</p>
            </div>
            <FaExchangeAlt className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-800">83%</p>
            </div>
            <FaChartLine className="text-amber-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Auto-Matching Section */}
      <div className="bg-gradient-to-r from-teal-50 to-indigo-50 rounded-xl p-6 mb-8 border border-teal-200">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Auto-Matching System</h2>
            <p className="text-gray-600">Automatically match donations with suitable requests</p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-4">
            <button
              onClick={handleAutoMatch}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <FaRandom className="mr-2" />
              Run Auto-Match
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors border border-gray-300">
              View Algorithm
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-500">Available Donations</div>
            <div className="text-2xl font-bold text-teal-600">42</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-500">Pending Requests</div>
            <div className="text-2xl font-bold text-indigo-600">28</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-500">Potential Matches</div>
            <div className="text-2xl font-bold text-amber-600">18</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2 text-gray-400" />
              Search Matches
            </label>
            <input
              type="text"
              placeholder="Search by donation or request..."
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bulk Actions
            </label>
            <div className="flex space-x-2">
              <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Update Status
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredMatches.map((match) => {
          const status = getStatusColor(match.status);
          const matchScore = getMatchScore(match);
          return (
            <div key={match.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              {/* Match Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${status.bg} mr-3`}>
                      <FaHandshake className={status.text} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Match #{match.id}</h3>
                      <p className="text-sm text-gray-500">{match.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${status.text}`}>{matchScore}%</div>
                    <div className="text-sm text-gray-500">Match Score</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>

              {/* Match Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaBox className="text-teal-600 mr-2" />
                      <span className="font-medium text-gray-800">Donation</span>
                    </div>
                    <div className="text-sm text-gray-700">{match.donation}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <FaUser className="mr-1" /> {match.donor}
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaHandshake className="text-indigo-600 mr-2" />
                      <span className="font-medium text-gray-800">Request</span>
                    </div>
                    <div className="text-sm text-gray-700">{match.request}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <FaUser className="mr-1" /> {match.requester}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-teal-600" />
                    <span className="text-sm">{match.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2 text-indigo-600" />
                    <span className="text-sm">Value: {match.value}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(match.id)}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <FaEye className="mr-2" />
                    View Details
                  </button>
                  {match.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(match.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <FaCheckCircle className="mr-2" />
                      Approve
                    </button>
                  )}
                  {match.status !== 'completed' && match.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(match.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <FaTimesCircle className="mr-2" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredMatches.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-gray-400 text-5xl mb-4">🤝</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Matches Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Matching Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Matching Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Match Time</span>
              <span className="font-bold text-teal-600">2.4 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-bold text-indigo-600">83%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Match Score</span>
              <span className="font-bold text-emerald-600">87%</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <FaCheckCircle className="text-emerald-600 mr-2" />
              <span className="text-gray-700">3 matches completed today</span>
            </div>
            <div className="flex items-center">
              <FaExchangeAlt className="text-indigo-600 mr-2" />
              <span className="text-gray-700">8 matches in progress</span>
            </div>
            <div className="flex items-center">
              <FaHandshake className="text-amber-600 mr-2" />
              <span className="text-gray-700">5 new matches pending</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/manage-donations" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all text-center">
              View Donations
            </a>
            <a href="/admin/manage-requests" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all text-center">
              View Requests
            </a>
            <a href="/admin/reports" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all text-center">
              Generate Report
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageMatches;