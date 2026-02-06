import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEye, 
  FaEdit,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaClock,
  FaHandHoldingHeart,
  FaTag
} from 'react-icons/fa';

const ManageRequests = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const requests = [
    {
      id: 1,
      item: 'Rice & Cooking Oil',
      category: 'food',
      requester: 'Sarah Johnson',
      quantity: '25 kg',
      location: 'Downtown',
      posted: '2024-01-15',
      status: 'pending',
      urgency: 'high',
      description: 'Family of 5 needs basic food supplies'
    },
    {
      id: 2,
      item: 'Winter Blankets',
      category: 'shelter',
      requester: 'Community Shelter',
      quantity: '10 pieces',
      location: 'North Area',
      posted: '2024-01-14',
      status: 'approved',
      urgency: 'urgent',
      description: 'For homeless shelter residents'
    },
    {
      id: 3,
      item: 'School Supplies',
      category: 'educational',
      requester: 'Local School',
      quantity: '15 sets',
      location: 'East Side',
      posted: '2024-01-13',
      status: 'rejected',
      urgency: 'medium',
      description: 'For underprivileged students'
    },
    {
      id: 4,
      item: 'First Aid Kits',
      category: 'medical',
      requester: 'Community Clinic',
      quantity: '5 kits',
      location: 'Medical District',
      posted: '2024-01-12',
      status: 'approved',
      urgency: 'high',
      description: 'Basic medical supplies for clinic'
    },
    {
      id: 5,
      item: 'Baby Formula',
      category: 'food',
      requester: 'Single Mother Support',
      quantity: '12 cans',
      location: 'West District',
      posted: '2024-01-11',
      status: 'pending',
      urgency: 'urgent',
      description: 'Infant formula for babies in need'
    },
    {
      id: 6,
      item: 'Warm Clothing',
      category: 'clothing',
      requester: 'Elderly Care Center',
      quantity: '20 pieces',
      location: 'Central Area',
      posted: '2024-01-10',
      status: 'processing',
      urgency: 'medium',
      description: 'Winter clothing for seniors'
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'amber' },
    { value: 'approved', label: 'Approved', color: 'emerald' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'processing', label: 'Processing', color: 'indigo' },
    { value: 'fulfilled', label: 'Fulfilled', color: 'teal' },
  ];

  const urgencyOptions = [
    { value: 'all', label: 'All Urgency', color: 'gray' },
    { value: 'low', label: 'Low', color: 'teal' },
    { value: 'medium', label: 'Medium', color: 'amber' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'urgent', label: 'Urgent', color: 'red' },
  ];

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filter === 'all' || request.status === filter;
    const matchesSearch = request.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requester.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (id) => {
    alert(`Request ${id} approved`);
    // Implement approval logic
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      alert(`Request ${id} rejected`);
      // Implement rejection logic
    }
  };

  const handleView = (id) => {
    alert(`View details for request ${id}`);
    // Implement view logic
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' };
      case 'approved': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved' };
      case 'rejected': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' };
      case 'processing': return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Processing' };
      case 'fulfilled': return { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Fulfilled' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'low': return { bg: 'bg-teal-100', text: 'text-teal-700', icon: '🟢' };
      case 'medium': return { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🟡' };
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', icon: '🟠' };
      case 'urgent': return { bg: 'bg-red-100', text: 'text-red-700', icon: '🔴' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '⚪' };
    }
  };

  return (
    <AdminLayout activePage="manage requests">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Requests</h1>
        <p className="text-gray-600">Review and process requests from community members</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-800">{requests.length}</p>
            </div>
            <FaHandHoldingHeart className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-gray-800">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
            <FaClock className="text-amber-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Urgent Requests</p>
              <p className="text-3xl font-bold text-gray-800">{requests.filter(r => r.urgency === 'urgent').length}</p>
            </div>
            <FaExclamationTriangle className="text-red-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Fulfillment Rate</p>
              <p className="text-3xl font-bold text-gray-800">78%</p>
            </div>
            <FaCheckCircle className="text-indigo-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2 text-gray-400" />
              Search Requests
            </label>
            <input
              type="text"
              placeholder="Search by item or requester..."
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
              <FaExclamationTriangle className="inline mr-2 text-gray-400" />
              Filter by Urgency
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              onChange={(e) => setFilter(e.target.value)}
            >
              {urgencyOptions.map(option => (
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

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const status = getStatusColor(request.status);
                const urgency = getUrgencyColor(request.urgency);
                return (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg bg-teal-100 mr-3`}>
                          <FaHandHoldingHeart className="text-teal-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{request.item}</div>
                          <div className="text-sm text-gray-500">
                            <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs">
                              {request.category}
                            </span>
                            <span className="ml-2">Qty: {request.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{request.requester}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {request.location}
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
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${urgency.bg} ${urgency.text}`}>
                        {urgency.icon} {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(request.id)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Match">
                          <FaTag />
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
      {filteredRequests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Requests Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Quick Stats and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Request Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Response Time</span>
              <span className="font-bold text-teal-600">4.8 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Top Category</span>
              <span className="font-bold text-indigo-600">Food</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-bold text-emerald-600">78%</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Urgent Actions Needed</h3>
          <div className="space-y-3">
            {requests.filter(r => r.urgency === 'urgent').slice(0, 2).map(req => (
              <div key={req.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{req.item}</div>
                  <div className="text-sm text-gray-500">{req.requester}</div>
                </div>
                <button className="text-red-600 hover:text-red-800">
                  <FaExclamationTriangle />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/manage-matches" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all text-center">
              Match to Donations
            </a>
            <a href="/admin/reports" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all text-center">
              Generate Report
            </a>
            <a href="/admin/view-users" className="block p-3 bg-white rounded-lg hover:shadow-md transition-all text-center">
              View Requesters
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageRequests;