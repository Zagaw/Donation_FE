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
  FaEye,
  FaSpinner,
  FaExclamationTriangle,
  FaBuilding,
  FaUserCircle,
  FaUsers,
  FaTimes,
  FaIdCard,
  FaTag,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
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

  const getStatusBadge = (status) => {
    if (!status) return { bg: 'bg-gray-100', text: 'text-gray-600', icon: FaUserCircle };
    
    switch(status.toLowerCase()) {
      case 'active':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: FaCheckCircle };
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-700', icon: FaClock };
      case 'inactive':
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: FaTimesCircle };
      case 'suspended':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: FaExclamationTriangle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: FaUserCircle };
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'No phone';
    return phone;
  };

  const formatAddress = (address) => {
    if (!address) return 'No address';
    return address;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
                  </div>
                  <FaUsers className="text-teal-600 text-2xl" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Donors</p>
                    <p className="text-3xl font-bold text-gray-800">{donorCount}</p>
                  </div>
                  <FaUser className="text-teal-600 text-2xl" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Receivers</p>
                    <p className="text-3xl font-bold text-gray-800">{receiverCount}</p>
                  </div>
                  <FaUser className="text-indigo-600 text-2xl" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
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
                          <tr key={user.userId} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
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
                                <FaEnvelope className="mr-2 text-gray-400 group-hover:text-teal-600 transition-colors" />
                                {user.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <FaPhone className="mr-2 text-gray-400 group-hover:text-teal-600 transition-colors" />
                                {formatPhoneNumber(user.phone)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-600" title={user.address || ''}>
                                <FaMapMarkerAlt className="mr-2 text-gray-400 group-hover:text-teal-600 transition-colors flex-shrink-0" />
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
                                <FaCalendarAlt className="mr-2 text-gray-400 group-hover:text-teal-600 transition-colors" />
                                {user.created_at ? formatDate(user.created_at) : 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewDetails(user)}
                                  className="p-2 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 hover:scale-110 transition-all duration-200"
                                  title="View Details"
                                >
                                  <FaEye />
                                </button>
                                <button className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 hover:scale-110 transition-all duration-200" title="Edit User">
                                  <FaEdit />
                                </button>
                              </div>
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
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
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
              
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
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
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
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

        {/* User Details Modal */}
        {showDetailsModal && selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Semi-transparent overlay - not black, but with opacity */}
            <div className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm transition-opacity"></div>
            
            {/* Modal container */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-teal-50 to-indigo-50 sticky top-0 z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <FaUser className="text-teal-600 mr-2" />
                      User Details
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Viewing complete information for {selectedUser.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <FaTimes className="text-gray-600 text-xl" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* User Header with Avatar */}
                  <div className="flex items-center space-x-6 bg-gray-50 p-6 rounded-lg">
                    <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                      {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedUser.name || 'No name'}</h3>
                      <p className="text-gray-600">User ID: #{selectedUser.userId}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role).bg} ${getRoleColor(selectedUser.role).text}`}>
                          {getRoleColor(selectedUser.role).icon} {getRoleColor(selectedUser.role).label}
                        </span>
                        {selectedUser.status && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedUser.status).bg} ${getStatusBadge(selectedUser.status).text}`}>
                            {selectedUser.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <FaUser className="text-teal-600 mr-2" />
                        Personal Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Full Name</p>
                          <p className="font-medium text-gray-800">{selectedUser.name || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Email Address</p>
                          <p className="font-medium text-gray-800 flex items-center">
                            <FaEnvelope className="mr-2 text-teal-600 text-sm" />
                            {selectedUser.email || 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                          <p className="font-medium text-gray-800 flex items-center">
                            <FaPhone className="mr-2 text-teal-600 text-sm" />
                            {selectedUser.phone || 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Address</p>
                          <p className="font-medium text-gray-800 flex items-start">
                            <FaMapMarkerAlt className="mr-2 text-teal-600 text-sm mt-1 flex-shrink-0" />
                            <span>{selectedUser.address || 'N/A'}</span>
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Account Created</p>
                          <p className="font-medium text-gray-800 flex items-center">
                            <FaCalendarAlt className="mr-2 text-teal-600 text-sm" />
                            {formatDateTime(selectedUser.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Role-specific Information */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <FaTag className="text-indigo-600 mr-2" />
                        Role Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">User Role</p>
                          <p className="font-medium text-gray-800 capitalize">{selectedUser.role || 'N/A'}</p>
                        </div>
                        
                        {selectedUser.role === 'donor' && (
                          <>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Donor Type</p>
                              <p className="font-medium text-gray-800">
                                {selectedUser.donor?.donorType === 'organization' ? 'Organization Donor' : 'Personal Donor'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Donor ID</p>
                              <p className="font-medium text-gray-800">#{selectedUser.donor?.donorId || selectedUser.donor?.id}</p>
                            </div>
                          </>
                        )}
                        
                        {selectedUser.role === 'receiver' && (
                          <>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Receiver Type</p>
                              <p className="font-medium text-gray-800">
                                {selectedUser.receiver?.receiverType === 'organization' ? 'Organization Receiver' : 'Individual Receiver'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Receiver ID</p>
                              <p className="font-medium text-gray-800">#{selectedUser.receiver?.receiverId || selectedUser.receiver?.id}</p>
                            </div>
                          </>
                        )}
                        
                        {selectedUser.role === 'admin' && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Administrator</p>
                            <p className="font-medium text-gray-800">Full system access</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* NRC/Document Information (if available) */}
                  {(selectedUser.donor?.nrcNumber || selectedUser.receiver?.nrcNumber) && (
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <FaIdCard className="text-amber-600 mr-2" />
                        Verification Documents
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedUser.role === 'donor' && selectedUser.donor?.nrcNumber && (
                          <>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">NRC Number</p>
                              <p className="font-medium text-gray-800">{selectedUser.donor.nrcNumber}</p>
                            </div>
                            {selectedUser.donor.nrc_front_url && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">NRC Front</p>
                                <a 
                                  href={selectedUser.donor.nrc_front_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                                >
                                  <FaIdCard className="mr-2 text-amber-600" />
                                  View Document
                                </a>
                              </div>
                            )}
                          </>
                        )}
                        
                        {selectedUser.role === 'receiver' && selectedUser.receiver?.nrcNumber && (
                          <>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">NRC Number</p>
                              <p className="font-medium text-gray-800">{selectedUser.receiver.nrcNumber}</p>
                            </div>
                            {selectedUser.receiver.nrc_front_url && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">NRC Front</p>
                                <a 
                                  href={selectedUser.receiver.nrc_front_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                                >
                                  <FaIdCard className="mr-2 text-amber-600" />
                                  View Document
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Activity Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaClock className="text-gray-600 mr-2" />
                      Account Activity
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Member Since</p>
                        <p className="font-medium text-gray-800">{formatDate(selectedUser.created_at)}</p>
                      </div>
                      {selectedUser.role === 'donor' && (
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Total Donations</p>
                          <p className="font-medium text-gray-800">Coming soon</p>
                        </div>
                      )}
                      {selectedUser.role === 'receiver' && (
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Total Requests</p>
                          <p className="font-medium text-gray-800">Coming soon</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 sticky bottom-0">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center">
                    <FaEdit className="mr-2" />
                    Edit User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ViewUsers;