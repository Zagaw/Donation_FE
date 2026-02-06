import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { 
  FaSearch, 
  FaFilter, 
  FaUser, 
  FaUserCheck, 
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
} from 'react-icons/fa';

const ViewUsers = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      type: 'donor',
      status: 'active',
      joinDate: '2024-01-15',
      donations: 12,
      requests: 0,
      trustScore: 4.8
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 234-5678',
      type: 'receiver',
      status: 'active',
      joinDate: '2024-01-10',
      donations: 0,
      requests: 8,
      trustScore: 4.5
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 345-6789',
      type: 'donor',
      status: 'pending',
      joinDate: '2024-01-08',
      donations: 5,
      requests: 0,
      trustScore: 4.2
    },
    {
      id: 4,
      name: 'Community Center',
      email: 'info@communitycenter.org',
      phone: '+1 (555) 456-7890',
      type: 'organization',
      status: 'active',
      joinDate: '2024-01-05',
      donations: 25,
      requests: 3,
      trustScore: 4.9
    },
    {
      id: 5,
      name: 'Lisa Park',
      email: 'lisa.park@example.com',
      phone: '+1 (555) 567-8901',
      type: 'receiver',
      status: 'suspended',
      joinDate: '2024-01-02',
      donations: 0,
      requests: 12,
      trustScore: 3.2
    },
    {
      id: 6,
      name: 'Robert Wilson',
      email: 'robert.w@example.com',
      phone: '+1 (555) 678-9012',
      type: 'donor',
      status: 'active',
      joinDate: '2023-12-28',
      donations: 18,
      requests: 0,
      trustScore: 4.7
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Users', color: 'gray' },
    { value: 'active', label: 'Active', color: 'emerald' },
    { value: 'pending', label: 'Pending', color: 'amber' },
    { value: 'suspended', label: 'Suspended', color: 'red' },
    { value: 'inactive', label: 'Inactive', color: 'gray' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types', color: 'gray' },
    { value: 'donor', label: 'Donors', color: 'teal' },
    { value: 'receiver', label: 'Receivers', color: 'indigo' },
    { value: 'organization', label: 'Organizations', color: 'amber' },
    { value: 'admin', label: 'Admins', color: 'purple' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesStatus = filter === 'all' || user.status === filter || user.type === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (id) => {
    alert(`User ${id} approved`);
    // Implement approval logic
  };

  const handleSuspend = (id) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      alert(`User ${id} suspended`);
      // Implement suspension logic
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      alert(`User ${id} deleted`);
      // Implement deletion logic
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' };
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' };
      case 'suspended': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Suspended' };
      case 'inactive': return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inactive' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'donor': return { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Donor' };
      case 'receiver': return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Receiver' };
      case 'organization': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Organization' };
      case 'admin': return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Admin' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: type };
    }
  };

  return (
    <AdminLayout activePage="view users">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all users in the system</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{users.length}</p>
            </div>
            <FaUser className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-800">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <FaUserCheck className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Pending Verification</p>
              <p className="text-3xl font-bold text-gray-800">{users.filter(u => u.status === 'pending').length}</p>
            </div>
            <FaClock className="text-amber-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Avg. Trust Score</p>
              <p className="text-3xl font-bold text-gray-800">4.5/5</p>
            </div>
            <FaChartLine className="text-emerald-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2 text-gray-400" />
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
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
              Filter by Type
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              onChange={(e) => setFilter(e.target.value)}
            >
              {typeOptions.map(option => (
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
                Export Users
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredUsers.map((user) => {
          const status = getStatusColor(user.status);
          const type = getTypeColor(user.type);
          return (
            <div key={user.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              {/* User Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${type.bg} ${type.text}`}>
                      {type.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="mr-2 text-teal-600" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2 text-indigo-600" />
                    <span className="text-sm">Joined {user.joinDate}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaChartLine className="mr-2 text-amber-600" />
                    <span className="text-sm">Score: {user.trustScore}/5</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUser className="mr-2 text-emerald-600" />
                    <span className="text-sm">
                      {user.donations} donations, {user.requests} requests
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {user.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <FaCheckCircle className="mr-2" />
                      Approve
                    </button>
                  )}
                  {user.status === 'active' && (
                    <button
                      onClick={() => handleSuspend(user.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <FaBan className="mr-2" />
                      Suspend
                    </button>
                  )}
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaEdit className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaTrash className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-gray-400 text-5xl mb-4">👤</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Users Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">User Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Donors</span>
              <span className="font-bold text-teal-600">{users.filter(u => u.type === 'donor').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Receivers</span>
              <span className="font-bold text-indigo-600">{users.filter(u => u.type === 'receiver').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Organizations</span>
              <span className="font-bold text-amber-600">{users.filter(u => u.type === 'organization').length}</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Status Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Users</span>
              <span className="font-bold text-emerald-600">{users.filter(u => u.status === 'active').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Verification</span>
              <span className="font-bold text-amber-600">{users.filter(u => u.status === 'pending').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Suspended Users</span>
              <span className="font-bold text-red-600">{users.filter(u => u.status === 'suspended').length}</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-white rounded-lg hover:shadow-md transition-all text-left">
              <FaUserCheck className="inline mr-2 text-teal-600" />
              Verify Pending Users
            </button>
            <button className="w-full p-3 bg-white rounded-lg hover:shadow-md transition-all text-left">
              <FaEnvelope className="inline mr-2 text-indigo-600" />
              Send Announcement
            </button>
            <button className="w-full p-3 bg-white rounded-lg hover:shadow-md transition-all text-left">
              <FaExclamationTriangle className="inline mr-2 text-amber-600" />
              Review Suspensions
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewUsers;