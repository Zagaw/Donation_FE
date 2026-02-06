import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaEdit,
  FaSave,
  FaShieldAlt,
  FaBell,
  FaChartLine,
  FaCog,
  FaLock,
  FaKey,
  FaHistory,
  FaUserShield
} from 'react-icons/fa';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@communityconnect.org',
    phone: '+1 (555) 000-0000',
    address: '789 Admin Street, City, State 00000',
    joinDate: 'January 1, 2023',
    role: 'Super Administrator',
    department: 'System Management',
    bio: 'System administrator responsible for managing the Community Donation Platform. Ensuring smooth operations and user satisfaction.',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      systemAlerts: true,
      reportEmails: true,
      twoFactorAuth: true
    }
  });

  const activityLog = [
    { id: 1, action: 'Approved 5 donations', time: 'Today, 10:30 AM', ip: '192.168.1.1' },
    { id: 2, action: 'Generated monthly report', time: 'Today, 09:15 AM', ip: '192.168.1.1' },
    { id: 3, action: 'Suspended user account', time: 'Yesterday, 03:45 PM', ip: '192.168.1.1' },
    { id: 4, action: 'Updated system settings', time: 'Yesterday, 11:20 AM', ip: '192.168.1.1' },
  ];

  const permissions = [
    { name: 'User Management', level: 'Full Access', icon: FaUserShield },
    { name: 'Donation Management', level: 'Full Access', icon: FaChartLine },
    { name: 'System Settings', level: 'Full Access', icon: FaCog },
    { name: 'Report Generation', level: 'Full Access', icon: FaChartLine },
    { name: 'Certificate Management', level: 'Full Access', icon: FaKey },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (preference) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference]
      }
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <AdminLayout activePage="profile">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Profile</h1>
          <p className="text-gray-600">Manage your administrator account and settings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaUser className="text-teal-600 mr-2" />
                  Administrator Information
                </h2>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all transform hover:-translate-y-1 ${
                    isEditing 
                      ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isEditing ? <FaSave className="mr-2" /> : <FaEdit className="mr-2" />}
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>

              {/* Profile Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-gray-400" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.role}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2 text-gray-400" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.email}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2 text-gray-400" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.phone}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-gray-400" />
                    Join Date
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.joinDate}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={profile.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.department}</div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-gray-400" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.address}</div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio / About
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-line">{profile.bio}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaLock className="text-indigo-600 mr-2" />
                Account Security
              </h2>
              <div className="space-y-4">
                <div className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center">
                    <FaLock className="text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-800">Change Password</h3>
                      <p className="text-sm text-gray-500">Update your login password</p>
                    </div>
                  </div>
                  <span className="text-teal-600">→</span>
                </div>
                
                <div className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center">
                    <FaKey className="text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add extra security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-emerald-600 mr-2">Enabled</span>
                    <div 
                      onClick={() => handleToggle('twoFactorAuth')}
                      className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${profile.preferences.twoFactorAuth ? 'bg-teal-600' : 'bg-gray-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${profile.preferences.twoFactorAuth ? 'translate-x-7' : 'translate-x-1'}`} />
                    </div>
                  </div>
                </div>
                
                <div className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center">
                    <FaHistory className="text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-800">Login Activity</h3>
                      <p className="text-sm text-gray-500">Review recent account activity</p>
                    </div>
                  </div>
                  <span className="text-teal-600">View</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Permissions & Activity */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl p-6 border border-teal-200">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                  A
                </div>
                <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                <p className="text-gray-600">{profile.role}</p>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                    ⭐ Super Admin
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="font-medium text-emerald-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-800">{profile.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Login</span>
                  <span className="font-medium text-teal-600">Today, 10:30 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Access Level</span>
                  <span className="font-medium text-indigo-600">Full Access</span>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaUserShield className="text-purple-600 mr-2" />
                System Permissions
              </h2>
              <div className="space-y-4">
                {permissions.map((perm, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-teal-100 mr-3">
                        <perm.icon className="text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{perm.name}</h3>
                        <p className="text-sm text-gray-500">{perm.level}</p>
                      </div>
                    </div>
                    <span className="text-emerald-600">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaHistory className="text-amber-600 mr-2" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-gray-800">{activity.action}</h3>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-xs text-gray-500">IP: {activity.ip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Tools</h2>
              <div className="space-y-3">
                <a href="/admin/manage-donations" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
                  <span className="text-teal-600 mr-3">📊</span>
                  <span className="text-gray-700">System Dashboard</span>
                </a>
                <a href="/admin/reports" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
                  <span className="text-indigo-600 mr-3">📈</span>
                  <span className="text-gray-700">Generate Reports</span>
                </a>
                <a href="/admin/view-users" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
                  <span className="text-amber-600 mr-3">👥</span>
                  <span className="text-gray-700">Manage Users</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;