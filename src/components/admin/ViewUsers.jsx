import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { adminApi } from '../../api/adminApi';
import { 
  FaSearch, 
  FaFilter, 
  FaUser, 
  FaUserCheck, 
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSpinner,
  FaExclamationTriangle,
  FaBuilding,
  FaUserCircle,
  FaUsers
} from 'react-icons/fa';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching users from API...');
      const response = await adminApi.getAllUsers();
      console.log('API Response:', response);
      
      // Handle different response structures
      const usersData = response.data.users || response.data || [];
      setUsers(usersData);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Admin', icon: '👑' };
      case 'donor': return { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Donor', icon: '🎁' };
      case 'receiver': return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Receiver', icon: '🤝' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: role || 'User', icon: '👤' };
    }
  };

  const getUserTypeIcon = (user) => {
    if (user.role === 'donor') {
      return user.donor?.donorType === 'organization' 
        ? <FaBuilding className="text-amber-600" title="Organization Donor" /> 
        : <FaUserCircle className="text-teal-600" title="Personal Donor" />;
    }
    if (user.role === 'receiver') {
      return user.receiver?.receiverType === 'organization'
        ? <FaBuilding className="text-amber-600" title="Organization Receiver" />
        : <FaUserCircle className="text-indigo-600" title="Individual Receiver" />;
    }
    return <FaUserCircle className="text-purple-600" title="Administrator" />;
  };

  const getUserTypeText = (user) => {
    if (user.role === 'donor') {
      return user.donor?.donorType === 'organization' ? 'Organization Donor' : 'Personal Donor';
    }
    if (user.role === 'receiver') {
      return user.receiver?.receiverType === 'organization' ? 'Organization Receiver' : 'Individual Receiver';
    }
    return 'Administrator';
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'No phone';
    return phone;
  };

  const formatAddress = (address) => {
    if (!address) return 'No address';
    return address.length > 30 ? address.substring(0, 30) + '...' : address;
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'all' || user.role?.toLowerCase() === roleFilter.toLowerCase();
    const matchesSearch = 
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.address?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Calculate statistics
  const totalUsers = users.length;
  const donorCount = users.filter(u => u.role?.toLowerCase() === 'donor').length;
  const receiverCount = users.filter(u => u.role?.toLowerCase() === 'receiver').length;
  const adminCount = users.filter(u => u.role?.toLowerCase() === 'admin').length;

  const personalDonors = users.filter(u => 
    u.role === 'donor' && u.donor?.donorType === 'personal'
  ).length;
  
  const orgDonors = users.filter(u => 
    u.role === 'donor' && u.donor?.donorType === 'organization'
  ).length;
  
  const personalReceivers = users.filter(u => 
    u.role === 'receiver' && u.receiver?.receiverType === 'personal'
  ).length;
  
  const orgReceivers = users.filter(u => 
    u.role === 'receiver' && u.receiver?.receiverType === 'organization'
  ).length;

  const usersWithPhone = users.filter(u => u.phone).length;
  const usersWithAddress = users.filter(u => u.address).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
          <p className="text-gray-600">View and manage all users in the system</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
            <button 
              onClick={fetchUsers}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats Summary */}
        {!error && users.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
                  </div>
                  <FaUsers className="text-teal-600 text-2xl" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Donors</p>
                    <p className="text-3xl font-bold text-gray-800">{donorCount}</p>
                  </div>
                  <FaUser className="text-teal-600 text-2xl" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Receivers</p>
                    <p className="text-3xl font-bold text-gray-800">{receiverCount}</p>
                  </div>
                  <FaUser className="text-indigo-600 text-2xl" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Admins</p>
                    <p className="text-3xl font-bold text-gray-800">{adminCount}</p>
                  </div>
                  <FaUserCheck className="text-purple-600 text-2xl" />
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaSearch className="inline mr-2 text-gray-400" />
                    Search Users
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, email, phone or address..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaFilter className="inline mr-2 text-gray-400" />
                    Filter by Role
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="admin">Admins</option>
                    <option value="donor">Donors</option>
                    <option value="receiver">Receivers</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const role = getRoleColor(user.role);
                        
                        return (
                          <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name || 'No name'}</div>
                                  <div className="text-sm text-gray-500">ID: #{user.userId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900 mb-1">
                                <FaEnvelope className="mr-2 text-gray-400" />
                                {user.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <FaPhone className="mr-2 text-gray-400" />
                                {formatPhoneNumber(user.phone)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-600" title={user.address || ''}>
                                <FaMapMarkerAlt className="mr-2 text-gray-400 flex-shrink-0" />
                                <span className="truncate max-w-[150px]">
                                  {formatAddress(user.address)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${role.bg} ${role.text}`}>
                                {role.icon} {role.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getUserTypeIcon(user)}
                                <span className="ml-2 text-sm text-gray-600">{getUserTypeText(user)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <FaCalendarAlt className="mr-2 text-gray-400" />
                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-teal-600 hover:text-teal-900 transition-colors">
                                <FaEdit className="text-lg" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          <div className="text-gray-400 text-5xl mb-4">👤</div>
                          <p className="text-lg">No users found</p>
                          <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-teal-600" />
                  Donors Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Donors</span>
                    <span className="font-bold text-teal-600 text-xl">{donorCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Personal Donors</span>
                    <span className="font-medium text-teal-600">{personalDonors}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Organization Donors</span>
                    <span className="font-medium text-amber-600">{orgDonors}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-indigo-600" />
                  Receivers Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Receivers</span>
                    <span className="font-bold text-indigo-600 text-xl">{receiverCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Individual Receivers</span>
                    <span className="font-medium text-indigo-600">{personalReceivers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Organization Receivers</span>
                    <span className="font-medium text-amber-600">{orgReceivers}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-4">System Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Administrators</span>
                    <span className="font-bold text-purple-600">{adminCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-bold text-teal-600">{totalUsers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">With Phone</span>
                    <span className="font-medium text-emerald-600">{usersWithPhone}/{totalUsers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">With Address</span>
                    <span className="font-medium text-amber-600">{usersWithAddress}/{totalUsers}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* No Users in Database */}
        {!error && users.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-gray-400 text-5xl mb-4">👥</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Users Found</h3>
            <p className="text-gray-600">There are no users in the system yet.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ViewUsers;