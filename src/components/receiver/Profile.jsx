import React, { useState } from 'react';
import ReceiverLayout from './ReceiverLayout';
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
  FaHandsHelping,
  FaCertificate,
  FaLock
} from 'react-icons/fa';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Community Street, City, State 12345',
    joinDate: 'January 15, 2024',
    bio: 'Community member seeking support for local families in need. Focus on food security and educational resources.',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      donationAlerts: true,
      newsletter: true
    }
  });

  const stats = [
    { label: 'Total Requests', value: '12', icon: FaHandsHelping, color: 'teal' },
    { label: 'Donations Received', value: '7', icon: FaChartLine, color: 'indigo' },
    { label: 'Active Requests', value: '3', icon: FaBell, color: 'amber' },
    { label: 'Certificates', value: '5', icon: FaCertificate, color: 'emerald' },
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
    <ReceiverLayout activePage="profile">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaUser className="text-teal-600 mr-2" />
                  Personal Information
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
                    Member Since
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.joinDate}</div>
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-${stat.color}-500`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`text-${stat.color}-600 text-xl`} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaLock className="text-indigo-600 mr-2" />
                Account Security
              </h2>
              <div className="space-y-4">
                <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <FaLock className="text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-800">Change Password</h3>
                      <p className="text-sm text-gray-500">Update your login password</p>
                    </div>
                  </div>
                  <span className="text-teal-600">→</span>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <FaShieldAlt className="text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add extra security to your account</p>
                    </div>
                  </div>
                  <span className="text-teal-600">Enable</span>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <FaBell className="text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-800">Login Activity</h3>
                      <p className="text-sm text-gray-500">Review recent account activity</p>
                    </div>
                  </div>
                  <span className="text-teal-600">View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Preferences & Verification */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl p-6 border border-teal-200">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-teal-600 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                <p className="text-gray-600">Community Receiver</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="font-medium text-emerald-600">Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-800">{profile.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trust Score</span>
                  <span className="font-medium text-amber-600">⭐ 4.8/5</span>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaBell className="text-amber-600 mr-2" />
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {Object.entries(profile.preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {key.includes('email') ? 'Receive email notifications' :
                         key.includes('sms') ? 'Receive SMS notifications' :
                         key.includes('alerts') ? 'Get donation alerts' :
                         'Subscribe to newsletter'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle(key)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                        value ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaShieldAlt className="text-emerald-600 mr-2" />
                Verification Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center">
                    <FaShieldAlt className="text-emerald-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-800">Identity Verified</h3>
                      <p className="text-sm text-emerald-600">Verified on Jan 20, 2024</p>
                    </div>
                  </div>
                  <span className="text-emerald-600">✓</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-teal-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-800">Address Verified</h3>
                      <p className="text-sm text-teal-600">Verified on Jan 22, 2024</p>
                    </div>
                  </div>
                  <span className="text-teal-600">✓</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center">
                    <FaPhone className="text-amber-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-800">Phone Verified</h3>
                      <p className="text-sm text-amber-600">Pending verification</p>
                    </div>
                  </div>
                  <span className="text-amber-600">Pending</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h2>
              <div className="space-y-3">
                <a href="/receiver/request" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
                  <span className="text-teal-600 mr-3">+</span>
                  <span className="text-gray-700">Create New Request</span>
                </a>
                <a href="/receiver/donations" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
                  <span className="text-indigo-600 mr-3">📦</span>
                  <span className="text-gray-700">Browse Donations</span>
                </a>
                <a href="/receiver/feedback" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all">
                  <span className="text-amber-600 mr-3">💬</span>
                  <span className="text-gray-700">Give Feedback</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReceiverLayout>
  );
};

export default Profile;