import React, { useState } from 'react';
import DonorLayout from './DonorLayout';
import { 
  FaCheckCircle, 
  FaTruck, 
  FaStar, 
  FaCalendarAlt, 
  FaBox, 
  FaUser,
  FaDownload,
  FaShare,
  FaChartLine,
  FaReceipt
} from 'react-icons/fa';

const DonationHistory = () => {
  const [filter, setFilter] = useState('all');

  const donationHistory = [
    {
      id: 1,
      item: 'Rice & Cooking Oil',
      category: 'food',
      receiver: 'Sarah Johnson',
      dateDonated: '2024-01-15',
      quantity: '25 kg',
      status: 'delivered',
      value: '$150',
      rating: 5,
      feedback: 'Receiver was very grateful, smooth process'
    },
    {
      id: 2,
      item: 'Winter Blankets',
      category: 'shelter',
      receiver: 'Community Shelter',
      dateDonated: '2024-01-10',
      quantity: '10 pieces',
      status: 'delivered',
      value: '$200',
      rating: 4,
      feedback: 'Shelter staff were very appreciative'
    },
    {
      id: 3,
      item: 'School Supplies',
      category: 'educational',
      receiver: 'Local School',
      dateDonated: '2024-01-05',
      quantity: '15 sets',
      status: 'delivered',
      value: '$120',
      rating: 5,
      feedback: 'Perfect for students, thank you note received'
    },
    {
      id: 4,
      item: 'First Aid Kits',
      category: 'medical',
      receiver: 'Community Clinic',
      dateDonated: '2023-12-20',
      quantity: '5 kits',
      status: 'in_transit',
      value: '$75',
      rating: null,
      feedback: ''
    },
    {
      id: 5,
      item: 'Baby Formula',
      category: 'food',
      receiver: 'Single Mother Support',
      dateDonated: '2023-12-15',
      quantity: '12 cans',
      status: 'pending',
      value: '$180',
      rating: null,
      feedback: ''
    },
    {
      id: 6,
      item: 'Warm Clothing',
      category: 'clothing',
      receiver: 'Elderly Care Center',
      dateDonated: '2023-12-10',
      quantity: '20 pieces',
      status: 'delivered',
      value: '$300',
      rating: 4,
      feedback: 'Seniors were very happy with the clothing'
    },
  ];

  const stats = {
    totalDonations: donationHistory.length,
    totalValue: '$1,025',
    averageRating: 4.5,
    peopleHelped: 42
  };

  const filteredDonations = filter === 'all' 
    ? donationHistory 
    : donationHistory.filter(d => d.category === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Delivered' };
      case 'in_transit': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Transit' };
      case 'pending': return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pending' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  return (
    <DonorLayout activePage="donation history">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Donation History</h1>
        <p className="text-gray-600">Track all your donations and their impact</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Donations</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalDonations}</p>
            </div>
            <FaBox className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalValue}</p>
            </div>
            <FaReceipt className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-800">{stats.averageRating}/5</p>
            </div>
            <FaStar className="text-amber-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">People Helped</p>
              <p className="text-3xl font-bold text-gray-800">{stats.peopleHelped}</p>
            </div>
            <FaChartLine className="text-emerald-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-teal-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Donations
        </button>
        <button
          onClick={() => setFilter('food')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'food' 
              ? 'bg-teal-600 text-white' 
              : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
          }`}
        >
          Food
        </button>
        <button
          onClick={() => setFilter('clothing')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'clothing' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
          }`}
        >
          Clothing
        </button>
        <button
          onClick={() => setFilter('medical')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'medical' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          }`}
        >
          Medical
        </button>
      </div>

      {/* Donations Table/List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Donated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => {
                const status = getStatusColor(donation.status);
                return (
                  <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                          donation.category === 'food' ? 'bg-teal-100' :
                          donation.category === 'clothing' ? 'bg-indigo-100' :
                          donation.category === 'medical' ? 'bg-emerald-100' :
                          'bg-amber-100'
                        }`}>
                          <FaBox className={
                            donation.category === 'food' ? 'text-teal-600' :
                            donation.category === 'clothing' ? 'text-indigo-600' :
                            donation.category === 'medical' ? 'text-emerald-600' :
                            'text-amber-600'
                          } />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{donation.item}</div>
                          <div className="text-sm text-gray-500">Value: {donation.value}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <span className="text-gray-900">{donation.receiver}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <span className="text-gray-900">{donation.dateDonated}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {donation.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {donation.rating ? (
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-sm ${
                                i < donation.rating ? 'text-amber-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-gray-600">({donation.rating})</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not rated yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {donation.status === 'delivered' && (
                          <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="Download Receipt">
                            <FaDownload />
                          </button>
                        )}
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Share">
                          <FaShare />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Yearly Impact</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Total Donations This Year</span>
              <span className="font-bold text-teal-600">18 items</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Total Value</span>
              <span className="font-bold text-indigo-600">$4,200</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Communities Reached</span>
              <span className="font-bold text-emerald-600">8 communities</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Response Time</span>
              <span className="font-bold text-amber-600">2.5 days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {donationHistory.filter(d => d.rating).slice(0, 2).map((donation) => (
              <div key={donation.id} className="pb-4 border-b border-gray-100 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{donation.item}</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < donation.rating ? 'text-amber-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"{donation.feedback}"</p>
                <p className="text-gray-500 text-sm mt-1">- {donation.receiver}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DonorLayout>
  );
};

export default DonationHistory;