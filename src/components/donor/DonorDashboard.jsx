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
import DonorLayout from './DonorLayout';
import { 
  FaDonate, 
  FaClock, 
  FaCheckCircle, 
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaHandHoldingHeart,
  FaBoxOpen,
  FaPlusCircle,
  FaList,
  FaCertificate
} from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DonorDashboard = () => {
  // Stats data
  const stats = [
    { 
      title: 'Total Donations', 
      value: '18', 
      change: '+3 this month', 
      icon: FaDonate, 
      color: 'teal',
      bgColor: 'teal-50'
    },
    { 
      title: 'Pending Requests', 
      value: '7', 
      change: 'Awaiting response', 
      icon: FaClock, 
      color: 'amber',
      bgColor: 'amber-50'
    },
    { 
      title: 'People Helped', 
      value: '42', 
      change: '+8 this week', 
      icon: FaUsers, 
      color: 'indigo',
      bgColor: 'indigo-50'
    },
    { 
      title: 'Certificates', 
      value: '5', 
      change: 'Recent: 2', 
      icon: FaCertificate, 
      color: 'emerald',
      bgColor: 'emerald-50'
    },
  ];

  // Doughnut chart data - Donation Categories
  const doughnutData = {
    labels: ['Food', 'Clothing', 'Medical', 'Educational', 'Other'],
    datasets: [
      {
        data: [40, 20, 15, 15, 10],
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

  // Bar chart data - Monthly Impact
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Donations Made',
        data: [2, 3, 4, 2, 5, 2],
        backgroundColor: 'rgba(20, 184, 166, 0.6)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 1,
      },
      {
        label: 'Value ($)',
        data: [400, 600, 800, 350, 1200, 450],
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
        yAxisID: 'y1',
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
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Donations Count'
        },
        beginAtZero: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Value ($)'
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Recent activities
  const recentActivities = [
    { type: 'Donation', item: 'Food Supplies', status: 'Delivered', time: '2 hours ago', icon: FaDonate },
    { type: 'Request', item: 'Winter Clothes', status: 'Matched', time: '1 day ago', icon: FaHandHoldingHeart },
    { type: 'Donation', item: 'Books', status: 'In Transit', time: '2 days ago', icon: FaDonate },
    { type: 'Certificate', item: 'Certificate #45', status: 'Issued', time: '3 days ago', icon: FaCertificate },
  ];

  return (
    <DonorLayout activePage="dashboard">
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
              Donation Categories
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
              Monthly Impact
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
                    activity.type === 'Donation' ? 'bg-teal-100' : 
                    activity.type === 'Request' ? 'bg-indigo-100' : 
                    'bg-emerald-100'
                  }`}>
                    <activity.icon className={
                      activity.type === 'Donation' ? 'text-teal-600' : 
                      activity.type === 'Request' ? 'text-indigo-600' : 
                      'text-emerald-600'
                    } />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{activity.item}</h4>
                    <p className="text-sm text-gray-500">{activity.type} • {activity.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activity.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                  activity.status === 'Matched' ? 'bg-teal-100 text-teal-700' :
                  activity.status === 'In Transit' ? 'bg-amber-100 text-amber-700' :
                  'bg-indigo-100 text-indigo-700'
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
              href="/donor/donate"
              className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-teal-100">
                  <FaPlusCircle className="text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Make a Donation</h4>
                  <p className="text-sm text-gray-500">Donate items to those in need</p>
                </div>
              </div>
              <span className="text-teal-600">→</span>
            </a>
            <a
              href="/donor/requests"
              className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <FaList className="text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">View Requests</h4>
                  <p className="text-sm text-gray-500">See what people need</p>
                </div>
              </div>
              <span className="text-indigo-600">→</span>
            </a>
            <a
              href="/donor/certificates"
              className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-amber-100">
                  <FaCertificate className="text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">View Certificates</h4>
                  <p className="text-sm text-gray-500">See your donation certificates</p>
                </div>
              </div>
              <span className="text-amber-600">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Impact Value</p>
              <p className="text-3xl font-bold text-gray-800">$4,200</p>
            </div>
            <FaChartLine className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Communities Helped</p>
              <p className="text-3xl font-bold text-gray-800">8</p>
            </div>
            <FaUsers className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-800">⭐ 4.8</p>
            </div>
            <FaCheckCircle className="text-emerald-600 text-2xl" />
          </div>
        </div>
      </div>
    </DonorLayout>
  );
};

export default DonorDashboard;