import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { 
  FaHandsHelping, 
  FaTachometerAlt, 
  FaBox, 
  FaClipboardList,
  FaUsers,
  FaCertificate,
  FaHandshake,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaCog,
  FaSpinner
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FaTachometerAlt },
    { name: 'Manage Donations', path: '/admin/manage-donations', icon: FaBox },
    { name: 'Manage Requests', path: '/admin/manage-requests', icon: FaClipboardList },
    { name: 'Manage Interests', path: '/admin/manage-interests', icon: FaClipboardList },
    { name: 'View Users', path: '/admin/view-users', icon: FaUsers },
    { name: 'Certificates', path: '/admin/certificates', icon: FaCertificate },
    { name: 'Manage Matches', path: '/admin/manage-matches', icon: FaHandshake },
    { name: 'Reports', path: '/admin/reports', icon: FaChartBar },
    { name: 'Feedbacks', path: '/admin/feedback', icon: FaChartBar },
    { name: 'Profile', path: '/admin/profile', icon: FaUser },
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = () => {
    if (!user.name) return 'A';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getLastLogin = () => {
    const lastLogin = localStorage.getItem('lastLogin');
    if (lastLogin) {
      return new Date(lastLogin).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric'
      });
    }
    return new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navigation Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 hidden lg:block border-r border-gray-200">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FaHandsHelping className="text-teal-600 text-2xl" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Community<span className="text-teal-600">Connect</span></h1>
              <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-500 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-100 hover:border-l-4 hover:border-gray-300'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`text-lg ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                {getInitials()}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <NavLink
              to="/"
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaHome />
              <span>Home</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50 border-t border-gray-300">
        <div className="flex justify-around p-2">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg flex-1 mx-1 ${
                  isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-500'
                }`
              }
            >
              <item.icon className="text-xl" />
              <span className="text-xs mt-1 truncate">{item.name.split(' ')[0]}</span>
            </NavLink>
          ))}
          <button 
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className="flex flex-col items-center p-2 rounded-lg flex-1 mx-1 text-gray-500"
          >
            <FaCog className="text-xl" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
        
        {/* Mobile More Menu */}
        {showLogoutMenu && (
          <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-2 rounded-t-lg">
            <div className="p-3 border-b border-gray-100 mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {getInitials()}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
            <NavLink
              to="/admin/profile"
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowLogoutMenu(false)}
            >
              <FaUser className="text-gray-500" />
              <span>Profile</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaSignOutAlt className="text-gray-500" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64 pb-20 lg:pb-0">
        {/* Top Header - No notification bell for admin */}
        <header className="bg-white shadow-sm lg:shadow-md sticky top-0 z-40">
          <div className="px-4 py-4 lg:px-6 lg:py-4 flex justify-between items-center">
            <div className="lg:hidden">
              <div className="flex items-center space-x-2">
                <FaHandsHelping className="text-teal-600 text-xl" />
                <h1 className="font-bold text-gray-800 text-lg">Admin Panel</h1>
              </div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Manage Community Donation System</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Desktop: Show user info only */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-gray-800">Welcome, {user.name}</p>
                  <p className="text-sm text-gray-500">Last login: {getLastLogin()}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {getInitials()}
                </div>
              </div>
              
              {/* Mobile: Show menu button only */}
              <div className="flex lg:hidden items-center space-x-2">
                <button 
                  onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                  className="p-2 text-gray-600 hover:text-teal-600"
                >
                  <FaUser className="text-xl" />
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

export default AdminLayout;