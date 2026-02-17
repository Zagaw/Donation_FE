import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import NotificationBell from '../NotificationBell'; // Add this import
import { 
  FaHandsHelping, 
  FaTachometerAlt, 
  FaDonate, 
  FaList, 
  FaHistory, 
  FaCertificate,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaSpinner,
  FaBuilding,
  FaUserCircle,
  FaCog
} from 'react-icons/fa';

const DonorLayout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/donor', icon: FaTachometerAlt },
    { name: 'Donation Form', path: '/donor/donate', icon: FaDonate },
    { name: 'Request Lists', path: '/donor/requests', icon: FaList },
    { name: 'Donation History', path: '/donor/history', icon: FaHistory },
    { name: 'Certificates', path: '/donor/certificates', icon: FaCertificate },
    { name: 'Profile', path: '/donor/profile', icon: FaUser },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (!authApi.checkAuth()) {
        navigate('/login');
        return;
      }

      const cachedUser = authApi.getStoredUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      const response = await authApi.getMe();
      setUser(response.data.user);
      
      const token = localStorage.getItem('token');
      authApi.setAuth(token, response.data.user);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      if (error.response?.status === 401) {
        authApi.clearAuth();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authApi.clearAuth();
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading donor dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = () => {
    if (!user.name) return 'D';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDonorTypeDisplay = () => {
    if (user.donor?.donorType === 'organization') {
      return (
        <span className="flex items-center text-xs text-gray-500">
          <FaBuilding className="mr-1" /> Organization
        </span>
      );
    }
    return (
      <span className="flex items-center text-xs text-gray-500">
        <FaUserCircle className="mr-1" /> Personal Donor
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navigation Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 hidden lg:block">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <FaHandsHelping className="text-teal-600 text-2xl" />
            <h1 className="text-xl font-bold text-gray-800">Community<span className="text-teal-600">Connect</span></h1>
          </div>
          <p className="text-sm text-gray-500 mt-2">Donor Portal</p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`text-lg ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
                      <span className="font-medium">{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-bold">{getInitials()}</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                {getDonorTypeDisplay()}
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            {/* Replace manual bell with NotificationBell */}
            <NotificationBell />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            <FaSignOutAlt className="text-gray-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200">
        <div className="flex justify-around p-2">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg ${
                  isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-500'
                }`
              }
            >
              <item.icon className="text-xl" />
              <span className="text-xs mt-1">{item.name}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex flex-col items-center p-2 rounded-lg text-gray-500"
          >
            <FaCog className="text-xl" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>

        {/* Mobile Profile Menu */}
        {showMobileMenu && (
          <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 rounded-t-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-bold text-lg">{getInitials()}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                {getDonorTypeDisplay()}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <NavLink
                to="/donor/profile"
                className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaUser className="text-gray-500" />
                <span>View Profile</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaSignOutAlt className="text-gray-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64 pb-16 lg:pb-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm lg:shadow sticky top-0 z-40">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="lg:hidden">
              <div className="flex items-center space-x-2">
                <FaHandsHelping className="text-teal-600 text-xl" />
                <h1 className="font-bold text-gray-800">Donor Portal</h1>
              </div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, <span className="text-teal-600">{user.name.split(' ')[0]}</span>!</h1>
              <p className="text-gray-600">Thank you for making a difference</p>
            </div>
            <div className="flex items-center space-x-4">
              <NavLink
                to="/"
                className="hidden lg:flex items-center space-x-2 text-gray-700 hover:text-teal-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaHome />
                <span>Home</span>
              </NavLink>
              {/* Replace manual bell with NotificationBell */}
              <NotificationBell />
              <div className="lg:hidden">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"
                >
                  <span className="text-teal-600 font-bold">{getInitials()}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DonorLayout;