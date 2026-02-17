import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { authApi } from '../../api/authApi';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaEdit,
  FaSave,
  FaLock,
  FaKey,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [originalProfile, setOriginalProfile] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!authApi.checkAuth()) {
        navigate('/login');
        return;
      }

      const response = await authApi.getMe();
      const userData = response.data.user;
      
      const formattedProfile = {
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        joinDate: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'N/A',
        bio: userData.bio || ''
      };
      
      setProfile(formattedProfile);
      setOriginalProfile(formattedProfile);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data. Please try again.');
      
      if (error.response?.status === 401) {
        authApi.clearAuth();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address
      };

      const response = await authApi.updateProfile(updateData);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setOriginalProfile(profile);
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Validate passwords match
      if (passwordData.new_password !== passwordData.new_password_confirmation) {
        setError('New passwords do not match');
        setSaving(false);
        return;
      }

      const updateData = {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation
      };

      const response = await authApi.updateProfile(updateData);
      
      setSuccess('Password updated successfully!');
      setChangingPassword(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
    setError(null);
  };

  const getInitials = () => {
    if (!profile.name) return 'A';
    return profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Profile</h1>
          <p className="text-gray-600">Manage your administrator account and settings</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center">
            <FaExclamationCircle className="text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center">
            <FaCheckCircle className="text-green-500 mr-3" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

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
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 rounded-lg font-medium bg-teal-600 hover:bg-teal-700 text-white transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all transform hover:-translate-y-1"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
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
                      disabled={saving}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.name || 'Not provided'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">Administrator</div>
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
                      disabled={saving}
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
                      disabled={saving}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.phone || 'Not provided'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-gray-400" />
                    Join Date
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
                      disabled={saving}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profile.address || 'Not provided'}</div>
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
                      disabled={saving}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-line">{profile.bio || 'No bio provided'}</div>
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
              
              {!changingPassword ? (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <FaLock className="text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-800">Change Password</h3>
                      <p className="text-sm text-gray-500">Update your login password</p>
                    </div>
                  </div>
                  <span className="text-teal-600">→</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800 mb-4">Update Password</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                        disabled={saving}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                        disabled={saving}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        name="new_password_confirmation"
                        value={passwordData.new_password_confirmation}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                        disabled={saving}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <button
                      onClick={handlePasswordUpdate}
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? <FaSpinner className="animate-spin mx-auto" /> : 'Update Password'}
                    </button>
                    <button
                      onClick={() => {
                        setChangingPassword(false);
                        setPasswordData({
                          current_password: '',
                          new_password: '',
                          new_password_confirmation: ''
                        });
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Summary */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl p-6 border border-teal-200">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                  {getInitials()}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{profile.name || 'Administrator'}</h3>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="font-medium text-emerald-600 flex items-center">
                    <FaCheckCircle className="mr-1" /> Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-800">{profile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;