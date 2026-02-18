import React, { useState, useEffect } from 'react';
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
import { requestApi } from '../../api/requestApi';
import { notificationApi } from '../../api/notificationApi';
import { 
  FaBoxOpen, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaChartLine,
  FaHandHoldingHeart,
  FaDonate,
  FaPlusCircle,
  FaList,
  FaCommentDots,
  FaHistory,
  FaSpinner,
  FaHeart,
  FaTruck,
  FaFlagCheckered,
  FaUsers
} from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ReceiverDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stats data
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    receivedItems: 0,
    urgentNeeds: 0,
    approvedRequests: 0,
    matchedRequests: 0,
    completedRequests: 0,
    peopleServed: 0
  });

  // Chart data
  const [categoryData, setCategoryData] = useState({
    labels: ['Food', 'Clothing', 'Medical', 'Educational', 'Other'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
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
    }]
  });

  const [monthlyData, setMonthlyData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Requests Made',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(20, 184, 166, 0.6)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 1,
      },
      {
        label: 'Donations Received',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  });

  const [recentActivities, setRecentActivities] = useState([]);

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all receiver data
      const [requestsRes, notificationsRes] = await Promise.all([
        requestApi.getMyRequests(),
        notificationApi.getNotifications(1, 10)
      ]);

      const requests = requestsRes.data || [];
      const notifications = notificationsRes.data?.notifications?.data || [];

      // Calculate stats
      const totalRequests = requests.length;
      const pendingRequests = requests.filter(r => r.status === 'pending').length;
      const approvedRequests = requests.filter(r => r.status === 'approved').length;
      const matchedRequests = requests.filter(r => r.status === 'matched').length;
      const completedRequests = requests.filter(r => r.status === 'completed').length;
      const receivedItems = completedRequests; // Items received when request is completed
      
      // Calculate urgent needs (you can define your own criteria)
      const urgentNeeds = requests.filter(r => 
        r.status === 'approved' && 
        r.created_at && 
        (new Date() - new Date(r.created_at)) > 7 * 24 * 60 * 60 * 1000 // Older than 7 days
      ).length;

      // Calculate category distribution
      const categoryCounts = {
        Food: 0,
        Clothing: 0,
        Medical: 0,
        Educational: 0,
        Other: 0
      };

      requests.forEach(r => {
        const cat = r.category?.toLowerCase() || '';
        if (cat.includes('food')) categoryCounts.Food++;
        else if (cat.includes('cloth')) categoryCounts.Clothing++;
        else if (cat.includes('medical') || cat.includes('health')) categoryCounts.Medical++;
        else if (cat.includes('edu') || cat.includes('school')) categoryCounts.Educational++;
        else categoryCounts.Other++;
      });

      setCategoryData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: [
            categoryCounts.Food,
            categoryCounts.Clothing,
            categoryCounts.Medical,
            categoryCounts.Educational,
            categoryCounts.Other
          ]
        }]
      }));

      // Calculate monthly activity (last 6 months)
      const monthlyRequests = [0, 0, 0, 0, 0, 0];
      const monthlyReceived = [0, 0, 0, 0, 0, 0];
      
      const today = new Date();
      requests.forEach(request => {
        const created = new Date(request.created_at);
        const monthDiff = today.getMonth() - created.getMonth() + 
                         (12 * (today.getFullYear() - created.getFullYear()));
        
        if (monthDiff >= 0 && monthDiff < 6) {
          monthlyRequests[5 - monthDiff]++;
          if (request.status === 'completed') {
            monthlyReceived[5 - monthDiff]++;
          }
        }
      });

      setMonthlyData(prev => ({
        ...prev,
        datasets: [
          { ...prev.datasets[0], data: monthlyRequests },
          { ...prev.datasets[1], data: monthlyReceived }
        ]
      }));

      // Generate recent activities
      const activities = [
        ...requests.slice(0, 4).map(r => ({
          type: 'Request',
          item: r.itemName,
          status: r.status,
          time: formatTimeAgo(r.created_at),
          icon: FaHandHoldingHeart
        })),
        ...notifications.slice(0, 2).map(n => ({
          type: 'Notification',
          item: n.data?.title || 'Update',
          status: n.read_at ? 'Read' : 'New',
          time: formatTimeAgo(n.created_at),
          icon: FaCheckCircle
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

      setRecentActivities(activities);

      setStats({
        totalRequests,
        pendingRequests,
        receivedItems,
        urgentNeeds,
        approvedRequests,
        matchedRequests,
        completedRequests,
        peopleServed: receivedItems * 2 // Estimate
      });

    } catch (error) {
      console.error('Error fetching receiver dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'approved': return 'bg-teal-100 text-teal-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'matched': return 'bg-purple-100 text-purple-700';
      case 'new': return 'bg-indigo-100 text-indigo-700';
      case 'read': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Stats cards data
  const statsCards = [
    { 
      title: 'Total Requests', 
      value: stats.totalRequests, 
      change: `${stats.pendingRequests} pending`, 
      icon: FaHandHoldingHeart, 
      color: 'teal',
      bgColor: 'teal-50'
    },
    { 
      title: 'Approved Requests', 
      value: stats.approvedRequests, 
      change: 'Ready for matching', 
      icon: FaCheckCircle, 
      color: 'green',
      bgColor: 'green-50'
    },
    { 
      title: 'Received Items', 
      value: stats.receivedItems, 
      change: `${stats.completedRequests} completed`, 
      icon: FaBoxOpen, 
      color: 'emerald',
      bgColor: 'emerald-50'
    },
    { 
      title: 'Urgent Needs', 
      value: stats.urgentNeeds, 
      change: 'High priority', 
      icon: FaExclamationTriangle, 
      color: 'red',
      bgColor: 'red-50'
    },
  ];

  if (loading) {
    return (
      <ReceiverLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-5xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </ReceiverLayout>
    );
  }

  if (error) {
    return (
      <ReceiverLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3 text-xl" />
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </ReceiverLayout>
    );
  }

  return (
    <ReceiverLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
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
            <span className="text-sm text-gray-500">Your requests</span>
          </div>
          <div className="h-64">
            <Doughnut 
              data={categoryData}
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
            <Bar data={monthlyData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'Request' ? 'bg-teal-100' : 
                      activity.type === 'Notification' ? 'bg-blue-100' : 
                      'bg-indigo-100'
                    }`}>
                      <activity.icon className={
                        activity.type === 'Request' ? 'text-teal-600' : 
                        activity.type === 'Notification' ? 'text-blue-600' : 
                        'text-indigo-600'
                      } />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{activity.item}</h4>
                      <p className="text-sm text-gray-500">{activity.type} • {activity.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent activities</p>
            )}
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
              href="/receiver/received"
              className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <FaBoxOpen className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Received Donations</h4>
                  <p className="text-sm text-gray-500">View items you've received</p>
                </div>
              </div>
              <span className="text-emerald-600">→</span>
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

      {/* Status Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Request Success Rate</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.totalRequests > 0 
                  ? Math.round((stats.completedRequests / stats.totalRequests) * 100) 
                  : 0}%
              </p>
            </div>
            <FaChartLine className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">People Served</p>
              <p className="text-3xl font-bold text-gray-800">{stats.peopleServed}</p>
            </div>
            <FaUsers className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active Requests</p>
              <p className="text-3xl font-bold text-gray-800">{stats.approvedRequests + stats.matchedRequests}</p>
            </div>
            <FaClock className="text-emerald-600 text-2xl" />
          </div>
        </div>
      </div>
    </ReceiverLayout>
  );
};

export default ReceiverDashboard;