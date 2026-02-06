import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEye, 
  FaEdit,
  FaTrash,
  FaBox,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaClock,
} from 'react-icons/fa';

const ManageDonations = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const donations = [
    {
      id: 1,
      item: 'Rice & Cooking Oil',
      category: 'food',
      donor: 'John Smith',
      quantity: '25 kg',
      location: 'Downtown',
      posted: '2024-01-15',
      status: 'pending',
      condition: 'New',
      estimatedValue: '$150'
    },
    {
      id: 2,
      item: 'Winter Blankets',
      category: 'shelter',
      donor: 'Community Center',
      quantity: '10 pieces',
      location: 'North Area',
      posted: '2024-01-14',
      status: 'approved',
      condition: 'Like New',
      estimatedValue: '$200'
    },
    {
      id: 3,
      item: 'School Supplies',
      category: 'educational',
      donor: 'Sarah Johnson',
      quantity: '15 sets',
      location: 'East Side',
      posted: '2024-01-13',
      status: 'rejected',
      condition: 'New',
      estimatedValue: '$120'
    },
    {
      id: 4,
      item: 'First Aid Kits',
      category: 'medical',
      donor: 'City Hospital',
      quantity: '5 kits',
      location: 'Medical District',
      posted: '2024-01-12',
      status: 'approved',
      condition: 'New',
      estimatedValue: '$75'
    },
    {
      id: 5,
      item: 'Baby Formula',
      category: 'food',
      donor: 'Supermarket Chain',
      quantity: '12 cans',
      location: 'Central Market',
      posted: '2024-01-11',
      status: 'pending',
      condition: 'New',
      estimatedValue: '$180'
    },
    {
      id: 6,
      item: 'Warm Clothing',
      category: 'clothing',
      donor: 'Local Charity',
      quantity: '20 pieces',
      location: 'West District',
      posted: '2024-01-10',
      status: 'approved',
      condition: 'Good',
      estimatedValue: '$300'
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'amber' },
    { value: 'approved', label: 'Approved', color: 'emerald' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'matched', label: 'Matched', color: 'indigo' },
  ];

  const filteredDonations = donations.filter(donation => {
    const matchesFilter = filter === 'all' || donation.status === filter;
    const matchesSearch = donation.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (id) => {
    alert(`Donation ${id} approved`);
    // Implement approval logic
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this donation?')) {
      alert(`Donation ${id} rejected`);
      // Implement rejection logic
    }
  };

  const handleView = (id) => {
    alert(`View details for donation ${id}`);
    // Implement view logic
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' };
      case 'approved': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved' };
      case 'rejected': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' };
      case 'matched': return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Matched' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'food': return { bg: 'bg-teal-100', text: 'text-teal-700' };
      case 'clothing': return { bg: 'bg-indigo-100', text: 'text-indigo-700' };
      case 'medical': return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
      case 'educational': return { bg: 'bg-amber-100', text: 'text-amber-700' };
      case 'shelter': return { bg: 'bg-blue-100', text: 'text-blue-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  return (
    <AdminLayout activePage="manage donations">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Donations</h1>
        <p className="text-gray-600">Review, approve, or reject donations from donors</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Donations</p>
              <p className="text-3xl font-bold text-gray-800">{donations.length}</p>
            </div>
            <FaBox className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-gray-800">{donations.filter(d => d.status === 'pending').length}</p>
            </div>
            <FaClock className="text-amber-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-gray-800">{donations.filter(d => d.status === 'approved').length}</p>
            </div>
            <FaCheckCircle className="text-emerald-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Estimated Value</p>
              <p className="text-3xl font-bold text-gray-800">$1,025</p>
            </div>
            <FaTag className="text-indigo-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2 text-gray-400" />
              Search Donations
            </label>
            <input
              type="text"
              placeholder="Search by item or donor..."
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
                Approve Selected
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === option.value
                ? `bg-${option.color}-600 text-white`
                : `bg-${option.color}-100 text-${option.color}-700 hover:bg-${option.color}-200`
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => {
                const status = getStatusColor(donation.status);
                const category = getCategoryColor(donation.category);
                return (
                  <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${category.bg} mr-3`}>
                          <FaBox className={category.text} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{donation.item}</div>
                          <div className="text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${category.bg} ${category.text}`}>
                              {donation.category}
                            </span>
                            <span className="ml-2">Qty: {donation.quantity}</span>
                            <span className="ml-2">• ${donation.estimatedValue}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{donation.donor}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {donation.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(donation.id)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {donation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(donation.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() => handleReject(donation.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                          <FaEdit />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Delete">
                          <FaTrash />
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

      {/* No Results */}
      {filteredDonations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-gray-400 text-5xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Donations Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Approval Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Approval Rate</span>
              <span className="font-bold text-teal-600">85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Response Time</span>
              <span className="font-bold text-indigo-600">6.2 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Top Category</span>
              <span className="font-bold text-emerald-600">Food</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Recent Actions</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <FaCheckCircle className="text-emerald-600 mr-2" />
              <span className="text-gray-700">5 donations approved today</span>
            </div>
            <div className="flex items-center">
              <FaTimesCircle className="text-red-600 mr-2" />
              <span className="text-gray-700">2 donations rejected</span>
            </div>
            <div className="flex items-center">
              <FaClock className="text-amber-600 mr-2" />
              <span className="text-gray-700">8 pending review</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
          <div className="space-y-3">
            <a href="/admin/manage-matches" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all">
              Match Donations
            </a>
            <a href="/admin/certificates" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all">
              Generate Certificates
            </a>
            <a href="/admin/reports" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all">
              View Reports
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageDonations;