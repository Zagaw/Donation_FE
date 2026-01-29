import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import ReceiverLayout from './ReceiverLayout';
import { 
  FaBoxOpen, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaChartLine,
  FaHandHoldingHeart,
  FaDonate,
  FaPlusCircle, // ← ADD THIS IMPORT
  FaList,
  FaCommentDots,
  FaHistory
} from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ReceiverDashboard = () => {
  // Stats data
  const stats = [
    { 
      title: 'Total Requests', 
      value: '12', 
      change: '+2 this month', 
      icon: FaHandHoldingHeart, 
      color: 'teal',
      bgColor: 'teal-50'
    },
    { 
      title: 'Pending Donations', 
      value: '5', 
      change: 'Awaiting approval', 
      icon: FaClock, 
      color: 'amber',
      bgColor: 'amber-50'
    },
    { 
      title: 'Received Items', 
      value: '7', 
      change: '+3 this week', 
      icon: FaBoxOpen, 
      color: 'emerald',
      bgColor: 'emerald-50'
    },
    { 
      title: 'Urgent Needs', 
      value: '3', 
      change: 'High priority', 
      icon: FaExclamationTriangle, 
      color: 'red',
      bgColor: 'red-50'
    },
  ];

  // Doughnut chart data
  const doughnutData = {
    labels: ['Food', 'Clothing', 'Medical', 'Educational', 'Other'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(20, 184, 166, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgb(20, 184, 166)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(107, 114, 128)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Requests Made',
        data: [2, 4, 3, 5, 4, 6],
        backgroundColor: 'rgba(20, 184, 166, 0.6)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 1,
      },
      {
        label: 'Donations Received',
        data: [1, 3, 2, 4, 3, 5],
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
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
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Recent activities
  const recentActivities = [
    { type: 'Donation', item: 'Food Supplies', status: 'Received', time: '2 hours ago', icon: FaDonate },
    { type: 'Request', item: 'Winter Clothes', status: 'Pending', time: '1 day ago', icon: FaHandHoldingHeart },
    { type: 'Donation', item: 'Books & Stationery', status: 'Approved', time: '2 days ago', icon: FaDonate },
    { type: 'Request', item: 'Medical Supplies', status: 'Processing', time: '3 days ago', icon: FaHandHoldingHeart },
  ];

  return (
    <ReceiverLayout activePage="dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1 border-l-4 border-${stat.color}-500`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.bgColor}`}>
                <stat.icon className={`text-${stat.color}-600 text-xl`} />
              </div>
              <span className={`text-sm font-medium text-${stat.color}-600`}>{stat.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Doughnut Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaChartLine className="text-teal-600 mr-2" />
              Needs by Category
            </h3>
            <span className="text-sm text-gray-500">Distribution</span>
          </div>
          <div className="h-64">
            <Doughnut 
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaCalendarAlt className="text-indigo-600 mr-2" />
              Monthly Activity
            </h3>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'Donation' ? 'bg-teal-100' : 'bg-indigo-100'
                  }`}>
                    <activity.icon className={
                      activity.type === 'Donation' ? 'text-teal-600' : 'text-indigo-600'
                    } />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{activity.item}</h4>
                    <p className="text-sm text-gray-500">{activity.type} • {activity.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activity.status === 'Received' ? 'bg-emerald-100 text-emerald-700' :
                  activity.status === 'Approved' ? 'bg-teal-100 text-teal-700' :
                  activity.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <a
              href="/receiver/request"
              className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-teal-100">
                  <FaPlusCircle className="text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Create New Request</h4>
                  <p className="text-sm text-gray-500">Request for needed items</p>
                </div>
              </div>
              <span className="text-teal-600">→</span>
            </a>
            <a
              href="/receiver/donations"
              className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <FaList className="text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Browse Donations</h4>
                  <p className="text-sm text-gray-500">View available donations</p>
                </div>
              </div>
              <span className="text-indigo-600">→</span>
            </a>
            <a
              href="/receiver/feedback"
              className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-amber-100">
                  <FaCommentDots className="text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Provide Feedback</h4>
                  <p className="text-sm text-gray-500">Share your experience</p>
                </div>
              </div>
              <span className="text-amber-600">→</span>
            </a>
          </div>
        </div>
      </div>
    </ReceiverLayout>
  );
};

export default ReceiverDashboard;