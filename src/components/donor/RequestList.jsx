import React, { useState } from 'react';
import DonorLayout from './DonorLayout';
import { 
  FaFilter, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaUser, 
  FaHeart,
  FaClock,
  FaExclamationTriangle,
  FaHandHoldingHeart
} from 'react-icons/fa';

const RequestList = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const requests = [
    {
      id: 1,
      title: 'Rice & Cooking Oil',
      category: 'food',
      quantity: '25 kg',
      requester: 'Sarah Johnson',
      location: 'Downtown',
      posted: '2 hours ago',
      urgency: 'urgent',
      description: 'Family of 5 needs basic food supplies'
    },
    {
      id: 2,
      title: 'Winter Blankets',
      category: 'shelter',
      quantity: '10 pieces',
      requester: 'Community Shelter',
      location: 'North Area',
      posted: '1 day ago',
      urgency: 'high',
      description: 'For homeless shelter residents'
    },
    {
      id: 3,
      title: 'School Supplies',
      category: 'educational',
      quantity: '15 sets',
      requester: 'Local School',
      location: 'East Side',
      posted: '2 days ago',
      urgency: 'medium',
      description: 'For underprivileged students'
    },
    {
      id: 4,
      title: 'First Aid Kits',
      category: 'medical',
      quantity: '5 kits',
      requester: 'Community Clinic',
      location: 'Medical District',
      posted: '3 days ago',
      urgency: 'high',
      description: 'Basic medical supplies for clinic'
    },
    {
      id: 5,
      title: 'Baby Formula',
      category: 'food',
      quantity: '12 cans',
      requester: 'Single Mother Support',
      location: 'West District',
      posted: '4 days ago',
      urgency: 'urgent',
      description: 'Infant formula for babies in need'
    },
    {
      id: 6,
      title: 'Warm Clothing',
      category: 'clothing',
      quantity: '20 pieces',
      requester: 'Elderly Care Center',
      location: 'Central Area',
      posted: '5 days ago',
      urgency: 'medium',
      description: 'Winter clothing for seniors'
    },
  ];

  const categories = [
    { id: 'all', label: 'All Requests', color: 'gray', count: requests.length },
    { id: 'food', label: 'Food', color: 'teal', count: requests.filter(r => r.category === 'food').length },
    { id: 'clothing', label: 'Clothing', color: 'indigo', count: requests.filter(r => r.category === 'clothing').length },
    { id: 'medical', label: 'Medical', color: 'emerald', count: requests.filter(r => r.category === 'medical').length },
    { id: 'educational', label: 'Educational', color: 'amber', count: requests.filter(r => r.category === 'educational').length },
    { id: 'shelter', label: 'Shelter', color: 'blue', count: requests.filter(r => r.category === 'shelter').length },
  ];

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.category === filter;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDonate = (id) => {
    alert(`You've chosen to donate to request ID: ${id}`);
    // Implement donation logic here
  };

  return (
    <DonorLayout activePage="request lists">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Community Requests</h1>
        <p className="text-gray-600">Browse requests from community members in need</p>
      </div>

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
                placeholder="Search by item or description..."
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
              {categories.map(cat => (
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
        {categories.map(cat => (
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map(request => (
          <div
            key={request.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            {/* Header */}
            <div className={`p-6 rounded-t-xl ${
              request.urgency === 'urgent' ? 'bg-red-50 border-l-4 border-red-500' :
              request.urgency === 'high' ? 'bg-amber-50 border-l-4 border-amber-500' :
              'bg-teal-50 border-l-4 border-teal-500'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{request.title}</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.category === 'food' ? 'bg-teal-100 text-teal-700' :
                      request.category === 'clothing' ? 'bg-indigo-100 text-indigo-700' :
                      request.category === 'medical' ? 'bg-emerald-100 text-emerald-700' :
                      request.category === 'educational' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
                    </span>
                    <span className="flex items-center text-sm">
                      <FaClock className="mr-1" />
                      {request.posted}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{request.quantity}</div>
                  <div className="text-sm text-gray-500">Needed</div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">{request.description}</p>
              
              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-2 text-teal-600" />
                  <span>{request.requester}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-indigo-600" />
                  <span>{request.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendar className="mr-2 text-amber-600" />
                  <span>Posted {request.posted}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaExclamationTriangle className={
                    request.urgency === 'urgent' ? 'text-red-600 mr-2' :
                    request.urgency === 'high' ? 'text-amber-600 mr-2' :
                    'text-teal-600 mr-2'
                  } />
                  <span className={
                    request.urgency === 'urgent' ? 'text-red-600' :
                    request.urgency === 'high' ? 'text-amber-600' :
                    'text-teal-600'
                  }>
                    {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDonate(request.id)}
                  className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <FaHandHoldingHeart className="mr-2" />
                  Donate to This Request
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaHeart className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Requests Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-800">42</p>
            </div>
            <FaHandHoldingHeart className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Urgent Needs</p>
              <p className="text-3xl font-bold text-gray-800">8</p>
            </div>
            <FaExclamationTriangle className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Your Matches</p>
              <p className="text-3xl font-bold text-gray-800">5</p>
            </div>
            <FaHeart className="text-amber-600 text-2xl" />
          </div>
        </div>
      </div>
    </DonorLayout>
  );
};

export default RequestList;