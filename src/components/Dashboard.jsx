import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandsHelping, FaDonate, FaHandHoldingHeart, FaChartLine, FaBell, FaUser, FaSignOutAlt, FaHome, FaReceipt, FaHistory, FaCog, FaCalendarAlt, FaUsers, FaStar, FaTrophy } from 'react-icons/fa';

const Dashboard = () => {
  const stats = [
    { label: 'Total Donations', value: '15', icon: FaDonate, color: 'teal' },
    { label: 'Requests Made', value: '8', icon: FaHandHoldingHeart, color: 'indigo' },
    { label: 'Total Amount', value: '$4,200', icon: FaReceipt, color: 'amber' },
    { label: 'Certificates', value: '3', icon: FaStar, color: 'emerald' },
  ];

  const recentActivities = [
    { type: 'Donation', desc: 'Food supplies to Local Shelter', amount: '$500', date: 'Today', status: 'Completed', color: 'teal' },
    { type: 'Request', desc: 'Medical aid for Community Clinic', amount: '$1,200', date: 'Yesterday', status: 'In Progress', color: 'indigo' },
    { type: 'Donation', desc: 'Educational materials', amount: '$300', date: 'Jan 15', status: 'Completed', color: 'teal' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <FaHandsHelping className="text-teal-600 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-800">Community<span className="text-teal-600">Connect</span></h1>
            </div>
            <div className="flex items-center space-x-6">
              <button className="text-gray-700 hover:text-teal-600 transition-colors relative">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
              <button className="text-gray-700 hover:text-teal-600 transition-colors">
                <FaUser className="text-xl" />
              </button>
              <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors">
                <FaSignOutAlt className="text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome, John!</h2>
              <p className="text-teal-100">Continue helping your community today</p>
            </div>
            <Link to="/" className="mt-4 md:mt-0 bg-white text-teal-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-all transform hover:-translate-y-1 hover:shadow-md">
              <FaHome className="inline mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-l-4 border-teal-500">
              <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
                <FaUser className="text-teal-600 mr-3" />
                Profile
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600"><strong>Role:</strong> <span className="text-teal-600">Donor</span></p>
                <p className="text-gray-600"><strong>Joined:</strong> Jan 2024</p>
                <p className="text-gray-600"><strong>Status:</strong> <span className="text-emerald-600">Active</span></p>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <FaTrophy className="text-amber-500 mr-2" />
                    <span className="text-sm text-gray-600">Community Hero Level 2</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-l-4 border-indigo-500">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-md hover:bg-teal-50 transition-colors flex items-center text-teal-700">
                  <FaDonate className="text-teal-600 mr-3" />
                  Make Donation
                </button>
                <button className="w-full text-left p-3 rounded-md hover:bg-indigo-50 transition-colors flex items-center text-indigo-700">
                  <FaHandHoldingHeart className="text-indigo-600 mr-3" />
                  Request Help
                </button>
                <button className="w-full text-left p-3 rounded-md hover:bg-amber-50 transition-colors flex items-center text-amber-700">
                  <FaHistory className="text-amber-500 mr-3" />
                  View History
                </button>
                <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors flex items-center text-gray-700">
                  <FaCog className="text-gray-600 mr-3" />
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1 border-t-4 border-${stat.color}-500`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                    </div>
                    <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                      <stat.icon className={`text-${stat.color}-600 text-xl`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
              <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center">
                <FaHistory className="text-teal-600 mr-3" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors group">
                    <div className="flex items-center">
                      <div className={`bg-${activity.color}-100 p-2 rounded-md mr-4 group-hover:bg-${activity.color}-200 transition-colors`}>
                        {activity.type === 'Donation' ? 
                          <FaDonate className={`text-${activity.color}-600`} /> : 
                          <FaHandHoldingHeart className={`text-${activity.color}-600`} />
                        }
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{activity.desc}</h4>
                        <p className="text-sm text-gray-500">{activity.type} • {activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{activity.amount}</p>
                      <p className={`text-sm ${activity.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {activity.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events & Quick Stats */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-l-4 border-amber-500">
                <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center">
                  <FaCalendarAlt className="text-amber-500 mr-3" />
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-100">
                    <h4 className="font-medium text-gray-800">Community Food Drive</h4>
                    <p className="text-sm text-gray-500">Feb 15, 2024 • City Center</p>
                    <p className="text-sm text-gray-600 mt-1">Join us in collecting food for local families</p>
                  </div>
                  <div className="pb-4 border-b border-gray-100">
                    <h4 className="font-medium text-gray-800">Medical Camp</h4>
                    <p className="text-sm text-gray-500">Feb 20, 2024 • Community Hall</p>
                    <p className="text-sm text-gray-600 mt-1">Free health checkups for the community</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-l-4 border-indigo-500">
                <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center">
                  <FaChartLine className="text-indigo-600 mr-3" />
                  Your Impact
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600">People Helped</span>
                    <span className="font-bold text-teal-600">42</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Communities Reached</span>
                    <span className="font-bold text-indigo-600">5</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Donation Streak</span>
                    <span className="font-bold text-amber-500">3 months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Impact Score</span>
                    <span className="font-bold text-emerald-600">⭐ 8.5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;