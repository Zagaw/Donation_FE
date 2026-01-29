import React, { useState } from 'react';
import ReceiverLayout from './ReceiverLayout';
import { 
  FaFilter, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaUser, 
  FaHeart,
  FaShoppingCart,
  FaClock
} from 'react-icons/fa';

const DonationList = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const donations = [
    {
      id: 1,
      title: 'Rice & Pulses',
      category: 'food',
      quantity: '50 kg',
      donor: 'John Smith',
      location: 'Downtown',
      posted: '2 hours ago',
      status: 'available',
      priority: 'high',
      description: 'Fresh rice and pulses from local store'
    },
    {
      id: 2,
      title: 'Winter Jackets',
      category: 'clothing',
      quantity: '10 pieces',
      donor: 'Community Center',
      location: 'North Area',
      posted: '1 day ago',
      status: 'available',
      priority: 'medium',
      description: 'Good condition winter jackets for adults'
    },
    {
      id: 3,
      title: 'Medical Kit',
      category: 'medical',
      quantity: '5 kits',
      donor: 'City Hospital',
      location: 'Medical District',
      posted: '2 days ago',
      status: 'available',
      priority: 'urgent',
      description: 'Basic first aid medical kits'
    },
    {
      id: 4,
      title: 'School Books',
      category: 'educational',
      quantity: '30 books',
      donor: 'Sarah Johnson',
      location: 'East Side',
      posted: '3 days ago',
      status: 'reserved',
      priority: 'medium',
      description: 'Primary school textbooks and notebooks'
    },
    {
      id: 5,
      title: 'Blankets',
      category: 'shelter',
      quantity: '15 pieces',
      donor: 'Warm Hearts Org',
      location: 'West District',
      posted: '4 days ago',
      status: 'available',
      priority: 'high',
      description: 'New blankets for winter season'
    },
    {
      id: 6,
      title: 'Baby Formula',
      category: 'food',
      quantity: '20 cans',
      donor: 'Local Supermarket',
      location: 'Central Market',
      posted: '5 days ago',
      status: 'available',
      priority: 'urgent',
      description: 'Infant formula milk for babies'
    },
  ];

  const categories = [
    { id: 'all', label: 'All Categories', color: 'gray', count: donations.length },
    { id: 'food', label: 'Food', color: 'teal', count: donations.filter(d => d.category === 'food').length },
    { id: 'clothing', label: 'Clothing', color: 'indigo', count: donations.filter(d => d.category === 'clothing').length },
    { id: 'medical', label: 'Medical', color: 'emerald', count: donations.filter(d => d.category === 'medical').length },
    { id: 'educational', label: 'Educational', color: 'amber', count: donations.filter(d => d.category === 'educational').length },
    { id: 'shelter', label: 'Shelter', color: 'blue', count: donations.filter(d => d.category === 'shelter').length },
  ];

  const filteredDonations = donations.filter(donation => {
    const matchesFilter = filter === 'all' || donation.category === filter;
    const matchesSearch = donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRequestDonation = (id) => {
    alert(`Request sent for donation ID: ${id}`);
    // Implement request logic here
  };

  return (
    <ReceiverLayout activePage="donation lists">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Donations</h1>
        <p className="text-gray-600">Browse and request donations from generous donors</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2 text-gray-400" />
              Search Donations
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by item name or description..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          {/* Filter */}
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

      {/* Donations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDonations.map(donation => (
          <div
            key={donation.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            {/* Header */}
            <div className={`p-6 rounded-t-xl ${
              donation.priority === 'urgent' ? 'bg-red-50 border-l-4 border-red-500' :
              donation.priority === 'high' ? 'bg-amber-50 border-l-4 border-amber-500' :
              'bg-teal-50 border-l-4 border-teal-500'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{donation.title}</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      donation.category === 'food' ? 'bg-teal-100 text-teal-700' :
                      donation.category === 'clothing' ? 'bg-indigo-100 text-indigo-700' :
                      donation.category === 'medical' ? 'bg-emerald-100 text-emerald-700' :
                      donation.category === 'educational' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {donation.category.charAt(0).toUpperCase() + donation.category.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      donation.status === 'available' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {donation.status === 'available' ? 'Available' : 'Reserved'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{donation.quantity}</div>
                  <div className="text-sm text-gray-500">Quantity</div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">{donation.description}</p>
              
              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-2 text-teal-600" />
                  <span>{donation.donor}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-indigo-600" />
                  <span>{donation.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendar className="mr-2 text-amber-600" />
                  <span>Posted {donation.posted}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2 text-gray-600" />
                  <span>{donation.priority.charAt(0).toUpperCase() + donation.priority.slice(1)} Priority</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleRequestDonation(donation.id)}
                  disabled={donation.status !== 'available'}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                    donation.status === 'available'
                      ? 'bg-teal-600 hover:bg-teal-700 text-white transform hover:-translate-y-1'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaShoppingCart className="mr-2" />
                  {donation.status === 'available' ? 'Request Donation' : 'Already Reserved'}
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
      {filteredDonations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Donations Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Available</p>
              <p className="text-3xl font-bold text-gray-800">12</p>
            </div>
            <FaShoppingCart className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Your Requests</p>
              <p className="text-3xl font-bold text-gray-800">5</p>
            </div>
            <FaHeart className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Urgent Needs</p>
              <p className="text-3xl font-bold text-gray-800">3</p>
            </div>
            <FaClock className="text-amber-600 text-2xl" />
          </div>
        </div>
      </div>
    </ReceiverLayout>
  );
};

export default DonationList;