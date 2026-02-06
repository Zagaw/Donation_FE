import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
} from 'chart.js';
import AdminLayout from './AdminLayout';
import { 
  FaUsers, 
  FaBox, 
  FaClipboardList, 
  FaHandshake,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaUserCheck,
  FaDonate,
  FaCertificate ,
} from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const AdminDashboard = () => {
  // Stats data
  const stats = [
    { 
      title: 'Total Users', 
      value: '1,248', 
      change: '+42 this week', 
      icon: FaUsers, 
      color: 'teal',
      trend: 'up'
    },
    { 
      title: 'Active Donations', 
      value: '186', 
      change: '+15 today', 
      icon: FaBox, 
      color: 'indigo',
      trend: 'up'
    },
    { 
      title: 'Pending Requests', 
      value: '73', 
      change: '-8 resolved', 
      icon: FaClipboardList, 
      color: 'amber',
      trend: 'down'
    },
    { 
      title: 'Successful Matches', 
      value: '892', 
      change: '+24 this week', 
      icon: FaHandshake, 
      color: 'emerald',
      trend: 'up'
    },
  ];

  // Bar chart data - Daily Activity
  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Donations',
        data: [45, 52, 38, 65, 72, 48, 55],
        backgroundColor: 'rgba(20, 184, 166, 0.7)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 1,
      },
      {
        label: 'Requests',
        data: [38, 42, 35, 48, 52, 40, 45],
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Activity'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Pie chart data - User Distribution
  const pieData = {
    labels: ['Donors', 'Receivers', 'Admins'],
    datasets: [
      {
        data: [65, 30, 5],
        backgroundColor: [
          'rgba(20, 184, 166, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgb(20, 184, 166)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Line chart data - Monthly Growth
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Users',
        data: [800, 900, 950, 1050, 1150, 1248],
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Total Matches',
        data: [600, 650, 720, 800, 850, 892],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Growth'
      }
    },
  };

  // Recent activities
  const recentActivities = [
    { type: 'Donation', action: 'New donation listed', user: 'John Smith', time: '10 min ago', status: 'pending' },
    { type: 'Request', action: 'Urgent request submitted', user: 'Sarah Johnson', time: '25 min ago', status: 'urgent' },
    { type: 'Match', action: 'Donation matched successfully', user: 'System', time: '1 hour ago', status: 'success' },
    { type: 'User', action: 'New user registered', user: 'Michael Chen', time: '2 hours ago', status: 'info' },
    { type: 'Certificate', action: 'Certificate generated', user: 'Admin', time: '3 hours ago', status: 'success' },
  ];

  // Quick stats
  const quickStats = [
    { label: 'Pending Approvals', value: '23', icon: FaClock, color: 'amber' },
    { label: 'Urgent Requests', value: '12', icon: FaExclamationTriangle, color: 'red' },
    { label: 'Today\'s Matches', value: '8', icon: FaHandshake, color: 'emerald' },
    { label: 'System Health', value: '98%', icon: FaCheckCircle, color: 'teal' },
  ];

  return (
    <AdminLayout activePage="dashboard">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-teal-100">Here's what's happening with your community today.</p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <div className="text-right">
              <p className="text-teal-100">Last Updated</p>
              <p className="font-bold">Today, 10:30 AM</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1 border-l-4 border-teal-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`text-${stat.color}-600 text-xl`} />
              </div>
              <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="h-64">
            <Pie 
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  title: {
                    display: true,
                    text: 'User Distribution'
                  }
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <Line data={lineData} options={lineOptions} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FaChartLine className="text-teal-600 mr-2" />
              Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'Donation' ? 'bg-teal-100' :
                      activity.type === 'Request' ? 'bg-indigo-100' :
                      activity.type === 'Match' ? 'bg-emerald-100' :
                      activity.type === 'User' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      {activity.type === 'Donation' ? <FaBox className="text-teal-600" /> :
                       activity.type === 'Request' ? <FaClipboardList className="text-indigo-600" /> :
                       activity.type === 'Match' ? <FaHandshake className="text-emerald-600" /> :
                       activity.type === 'User' ? <FaUsers className="text-amber-600" /> :
                       <FaCertificate className="text-blue-600" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{activity.action}</h4>
                      <p className="text-sm text-gray-500">By {activity.user} • {activity.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activity.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    activity.status === 'urgent' ? 'bg-red-100 text-red-700' :
                    activity.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Stats</h2>
            <div className="space-y-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg bg-${stat.color}-100 mr-3`}>
                      <stat.icon className={`text-${stat.color}-600`} />
                    </div>
                    <span className="text-gray-700">{stat.label}</span>
                  </div>
                  <span className={`font-bold text-${stat.color}-600`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <a href="/admin/manage-donations" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1">
                <FaBox className="text-teal-600 mr-3" />
                <span className="text-gray-700">Review Donations</span>
              </a>
              <a href="/admin/manage-requests" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1">
                <FaClipboardList className="text-indigo-600 mr-3" />
                <span className="text-gray-700">Process Requests</span>
              </a>
              <a href="/admin/view-users" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1">
                <FaUserCheck className="text-amber-600 mr-3" />
                <span className="text-gray-700">Verify Users</span>
              </a>
              <a href="/admin/certificates" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1">
                <FaCertificate className="text-emerald-600 mr-3" />
                <span className="text-gray-700">Generate Certificates</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;