import React, { useState } from 'react';
import ReceiverLayout from './ReceiverLayout';
import { 
  FaCheckCircle, 
  FaTruck, 
  FaStar, 
  FaCalendarAlt, 
  FaBox, 
  FaUser,
  FaDownload,
  FaShare,
  FaCalendarCheck
} from 'react-icons/fa';

const ReceivedDonations = () => {
  const [filter, setFilter] = useState('all');

  const receivedDonations = [
    {
      id: 1,
      item: 'Rice & Cooking Oil',
      category: 'food',
      donor: 'John Smith',
      dateReceived: '2024-01-15',
      quantity: '25 kg',
      status: 'received',
      rating: 5,
      feedback: 'Excellent quality, very helpful donor',
      deliveryType: 'Pickup'
    },
    {
      id: 2,
      item: 'Winter Blankets',
      category: 'shelter',
      donor: 'Community Center',
      dateReceived: '2024-01-10',
      quantity: '10 pieces',
      status: 'received',
      rating: 4,
      feedback: 'Warm and in good condition',
      deliveryType: 'Delivery'
    },
    {
      id: 3,
      item: 'School Supplies',
      category: 'educational',
      donor: 'Sarah Johnson',
      dateReceived: '2024-01-05',
      quantity: '15 sets',
      status: 'received',
      rating: 5,
      feedback: 'Perfect for children, very grateful',
      deliveryType: 'Pickup'
    },
    {
      id: 4,
      item: 'First Aid Kits',
      category: 'medical',
      donor: 'City Hospital',
      dateReceived: '2023-12-20',
      quantity: '5 kits',
      status: 'received',
      rating: 4,
      feedback: 'Complete medical supplies, very useful',
      deliveryType: 'Delivery'
    },
    {
      id: 5,
      item: 'Clothing Set',
      category: 'clothing',
      donor: 'Local Charity',
      dateReceived: '2023-12-15',
      quantity: '20 pieces',
      status: 'received',
      rating: 3,
      feedback: 'Good condition, slightly used',
      deliveryType: 'Pickup'
    },
    {
      id: 6,
      item: 'Baby Formula',
      category: 'food',
      donor: 'Supermarket Chain',
      dateReceived: '2023-12-10',
      quantity: '12 cans',
      status: 'received',
      rating: 5,
      feedback: 'Very helpful for infants, great quality',
      deliveryType: 'Delivery'
    },
  ];

  const stats = {
    totalReceived: receivedDonations.length,
    totalValue: '$2,450',
    averageRating: 4.3,
    topCategory: 'Food'
  };

  const filteredDonations = filter === 'all' 
    ? receivedDonations 
    : receivedDonations.filter(d => d.category === filter);

  return (
    <ReceiverLayout activePage="received donations">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Received Donations</h1>
        <p className="text-gray-600">Track and manage donations you have received</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Received</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalReceived}</p>
            </div>
            <FaBox className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Estimated Value</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalValue}</p>
            </div>
            <FaCheckCircle className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-800">{stats.averageRating}</p>
            </div>
            <FaStar className="text-amber-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Top Category</p>
              <p className="text-3xl font-bold text-gray-800">{stats.topCategory}</p>
            </div>
            <FaCalendarCheck className="text-emerald-600 text-2xl" />
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
          All Items
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
        <button
          onClick={() => setFilter('educational')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'educational' 
              ? 'bg-amber-600 text-white' 
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          Educational
        </button>
      </div>

      {/* Donations Table/List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Received</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
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
                        <div className="text-sm text-gray-500">{donation.category.charAt(0).toUpperCase() + donation.category.slice(1)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <span className="text-gray-900">{donation.donor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      <span className="text-gray-900">{donation.dateReceived}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {donation.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                        <FaDownload />
                      </button>
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <FaShare />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Section */}
      <div className="mt-8 bg-gradient-to-r from-teal-50 to-indigo-50 rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Donation Certificates</h3>
            <p className="text-gray-600">Download certificates for your received donations</p>
          </div>
          <button className="mt-4 md:mt-0 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-1 flex items-center">
            <FaDownload className="mr-2" />
            Download All Certificates
          </button>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Impact Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Total Families Helped</span>
              <span className="font-bold text-teal-600">8 families</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Total Individuals</span>
              <span className="font-bold text-indigo-600">32 people</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Communities Reached</span>
              <span className="font-bold text-emerald-600">3 communities</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Months Active</span>
              <span className="font-bold text-amber-600">6 months</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {receivedDonations.slice(0, 2).map((donation) => (
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
                <p className="text-gray-600 text-sm">{donation.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReceiverLayout>
  );
};

export default ReceivedDonations;