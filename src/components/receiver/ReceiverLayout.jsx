import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHandsHelping, 
  FaTachometerAlt, 
  FaPlusCircle, 
  FaList, 
  FaBoxOpen, 
  FaCommentDots,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaHome
} from 'react-icons/fa';

const ReceiverLayout = ({ children, activePage }) => {
  const navItems = [
    { name: 'Dashboard', path: '/receiver', icon: FaTachometerAlt },
    { name: 'Request Form', path: '/receiver/request', icon: FaPlusCircle },
    { name: 'Donation Lists', path: '/receiver/donations', icon: FaList },
    { name: 'Received Donations', path: '/receiver/received', icon: FaBoxOpen },
    { name: 'Feedback', path: '/receiver/feedback', icon: FaCommentDots },
    { name: 'Profile', path: '/receiver/profile', icon: FaUser },
  ];

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
          <p className="text-sm text-gray-500 mt-2">Receiver Portal</p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
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
                  <item.icon className={`text-lg ${activePage === item.name.toLowerCase() ? 'text-teal-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <FaUser className="text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Receiver</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <FaBell />
            </button>
          </div>
          <a
            href="/"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="text-gray-500" />
            <span>Logout</span>
          </a>
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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64 pb-16 lg:pb-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm lg:shadow">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="lg:hidden">
              <div className="flex items-center space-x-2">
                <FaHandsHelping className="text-teal-600 text-xl" />
                <h1 className="font-bold text-gray-800">Receiver</h1>
              </div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, <span className="text-teal-600">Sarah</span>!</h1>
              <p className="text-gray-600">Here's your community support overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="hidden lg:flex items-center space-x-2 text-gray-700 hover:text-teal-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaHome />
                <span>Home</span>
              </a>
              <button className="relative p-2 text-gray-600 hover:text-teal-600">
                <FaBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
              </button>
              <div className="lg:hidden">
                <NavLink
                  to="/receiver/profile"
                  className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"
                >
                  <FaUser className="text-teal-600" />
                </NavLink>
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

export default ReceiverLayout;