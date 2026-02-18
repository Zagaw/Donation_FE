import React, { useState, useEffect } from 'react';
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
import { adminApi } from '../../api/adminApi';
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
  FaCertificate,
  FaSpinner,
  FaHeart,
  FaTruck,
  FaFlagCheckered
} from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Stats data from API
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalRequests: 0,
    totalMatches: 0,
    pendingDonations: 0,
    pendingRequests: 0,
    approvedDonations: 0,
    approvedRequests: 0,
    executedDonations: 0,
    completedDonations: 0,
    matchedDonations: 0,
    userCounts: {
      donors: 0,
      receivers: 0,
      admins: 0
    },
    weeklyActivity: {
      donations: [0, 0, 0, 0, 0, 0, 0],
      requests: [0, 0, 0, 0, 0, 0, 0]
    },
    monthlyGrowth: {
      users: [0, 0, 0, 0, 0, 0],
      matches: [0, 0, 0, 0, 0, 0]
    }
  });

  // Recent activities
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data in parallel
      const [
        usersRes,
        donationsRes,
        requestsRes,
        matchesRes,
        interestsRes,
        statusCountsRes
      ] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllDonations(),
        adminApi.getAllRequests(),
        adminApi.getAllMatches(),
        adminApi.getAllInterests(),
        adminApi.getStatusCounts()
      ]);

      const users = usersRes.data.users || [];
      const donations = donationsRes.data.donations || [];
      const requests = requestsRes.data.requests || [];
      const matches = matchesRes.data.matches || [];
      const interests = interestsRes.data.interests || [];
      const statusCounts = statusCountsRes.data || {};

      // Calculate user counts by role
      const userCounts = {
        donors: users.filter(u => u.role === 'donor').length,
        receivers: users.filter(u => u.role === 'receiver').length,
        admins: users.filter(u => u.role === 'admin').length
      };

      // Calculate donation stats
      const pendingDonations = donations.filter(d => d.status === 'pending').length;
      const approvedDonations = donations.filter(d => d.status === 'approved').length;
      const executedDonations = donations.filter(d => d.status === 'executed').length;
      const completedDonations = donations.filter(d => d.status === 'completed').length;
      const matchedDonations = donations.filter(d => d.status === 'matched').length;

      // Calculate request stats
      const pendingRequests = requests.filter(r => r.status === 'pending').length;
      const approvedRequests = requests.filter(r => r.status === 'approved').length;
      
      // Calculate match stats
      const approvedMatches = matches.filter(m => m.status === 'approved').length;
      const executedMatches = matches.filter(m => m.status === 'executed').length;
      const completedMatches = matches.filter(m => m.status === 'completed').length;

      // Generate weekly activity (last 7 days)
      const weeklyDonations = [0, 0, 0, 0, 0, 0, 0];
      const weeklyRequests = [0, 0, 0, 0, 0, 0, 0];
      
      const today = new Date();
      donations.forEach(donation => {
        const created = new Date(donation.created_at);
        const dayDiff = Math.floor((today - created) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff < 7) {
          weeklyDonations[6 - dayDiff]++;
        }
      });

      requests.forEach(request => {
        const created = new Date(request.created_at);
        const dayDiff = Math.floor((today - created) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff < 7) {
          weeklyRequests[6 - dayDiff]++;
        }
      });

      // Generate monthly growth (last 6 months)
      const monthlyUsers = [0, 0, 0, 0, 0, 0];
      const monthlyMatches = [0, 0, 0, 0, 0, 0];
      
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      
      users.forEach(user => {
        const created = new Date(user.created_at);
        if (created >= sixMonthsAgo) {
          const monthIndex = Math.floor((today - created) / (1000 * 60 * 60 * 24 * 30));
          if (monthIndex >= 0 && monthIndex < 6) {
            monthlyUsers[5 - monthIndex]++;
          }
        }
      });

      matches.forEach(match => {
        const created = new Date(match.created_at);
        if (created >= sixMonthsAgo) {
          const monthIndex = Math.floor((today - created) / (1000 * 60 * 60 * 24 * 30));
          if (monthIndex >= 0 && monthIndex < 6) {
            monthlyMatches[5 - monthIndex]++;
          }
        }
      });

      // Generate recent activities
      const activities = [
        ...donations.slice(0, 3).map(d => ({
          type: 'Donation',
          action: d.status === 'pending' ? 'New donation pending approval' : 
                  d.status === 'approved' ? 'Donation approved' : 
                  d.status === 'executed' ? 'Donation executed' : 'Donation completed',
          user: d.donor?.user?.name || 'Unknown',
          time: formatTimeAgo(d.created_at),
          status: d.status
        })),
        ...requests.slice(0, 3).map(r => ({
          type: 'Request',
          action: r.status === 'pending' ? 'New request pending approval' : 
                  r.status === 'approved' ? 'Request approved' : 
                  r.status === 'executed' ? 'Request executed' : 'Request completed',
          user: r.receiver?.user?.name || 'Unknown',
          time: formatTimeAgo(r.created_at),
          status: r.status
        })),
        ...matches.slice(0, 3).map(m => ({
          type: 'Match',
          action: m.status === 'approved' ? 'New match created' : 
                  m.status === 'executed' ? 'Match executed' : 'Match completed',
          user: 'System',
          time: formatTimeAgo(m.created_at),
          status: m.status
        })),
        ...users.slice(0, 2).map(u => ({
          type: 'User',
          action: 'New user registered',
          user: u.name,
          time: formatTimeAgo(u.created_at),
          status: 'info'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

      setRecentActivities(activities);

      setStats({
        totalUsers: users.length,
        totalDonations: donations.length,
        totalRequests: requests.length,
        totalMatches: matches.length,
        pendingDonations,
        pendingRequests,
        approvedDonations,
        approvedRequests,
        executedDonations,
        completedDonations,
        matchedDonations,
        approvedMatches,
        executedMatches,
        completedMatches,
        totalInterests: interests.length,
        userCounts,
        weeklyActivity: {
          donations: weeklyDonations,
          requests: weeklyRequests
        },
        monthlyGrowth: {
          users: monthlyUsers,
          matches: monthlyMatches
        }
      });

      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
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

  // Stats cards data
  const statsCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      change: `+${stats.userCounts.donors + stats.userCounts.receivers} active`, 
      icon: FaUsers, 
      color: 'teal',
      trend: 'up'
    },
    { 
      title: 'Donations', 
      value: stats.totalDonations, 
      change: `${stats.pendingDonations} pending`, 
      icon: FaBox, 
      color: 'indigo',
      trend: stats.pendingDonations > 0 ? 'up' : 'down'
    },
    { 
      title: 'Requests', 
      value: stats.totalRequests, 
      change: `${stats.pendingRequests} pending`, 
      icon: FaClipboardList, 
      color: 'amber',
      trend: stats.pendingRequests > 0 ? 'up' : 'down'
    },
    { 
      title: 'Matches', 
      value: stats.totalMatches, 
      change: `${stats.approvedMatches} approved`, 
      icon: FaHandshake, 
      color: 'emerald',
      trend: 'up'
    },
  ];

  // Bar chart data - Weekly Activity
  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Donations',
        data: stats.weeklyActivity.donations,
        backgroundColor: 'rgba(20, 184, 166, 0.7)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 1,
      },
      {
        label: 'Requests',
        data: stats.weeklyActivity.requests,
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
        ticks: {
          stepSize: 1
        }
      },
    },
  };

  // Pie chart data - User Distribution
  const pieData = {
    labels: ['Donors', 'Receivers', 'Admins'],
    datasets: [
      {
        data: [
          stats.userCounts.donors,
          stats.userCounts.receivers,
          stats.userCounts.admins
        ],
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
    labels: ['5 months ago', '4 months ago', '3 months ago', '2 months ago', 'Last month', 'This month'],
    datasets: [
      {
        label: 'Total Users',
        data: stats.monthlyGrowth.users,
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Total Matches',
        data: stats.monthlyGrowth.matches,
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

  // Quick stats
  const quickStats = [
    { label: 'Pending Donations', value: stats.pendingDonations, icon: FaClock, color: 'amber' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: FaExclamationTriangle, color: 'red' },
    { label: 'Approved Matches', value: stats.approvedMatches, icon: FaCheckCircle, color: 'emerald' },
    { label: 'Completed Matches', value: stats.completedMatches, icon: FaFlagCheckered, color: 'teal' },
    { label: 'Active Interests', value: stats.totalInterests || 0, icon: FaHeart, color: 'red' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-indigo-100 text-indigo-700';
      case 'executed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'matched': return 'bg-purple-100 text-purple-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'success': return 'bg-emerald-100 text-emerald-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'Donation': return <FaBox className="text-teal-600" />;
      case 'Request': return <FaClipboardList className="text-indigo-600" />;
      case 'Match': return <FaHandshake className="text-emerald-600" />;
      case 'User': return <FaUsers className="text-amber-600" />;
      default: return <FaCertificate className="text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-5xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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
              <p className="font-bold">{lastUpdated.toLocaleTimeString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
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
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value.toLocaleString()}</h3>
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
      {stats.monthlyGrowth.users.some(val => val > 0) && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <Line data={lineData} options={lineOptions} />
        </div>
      )}

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
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'Donation' ? 'bg-teal-100' :
                        activity.type === 'Request' ? 'bg-indigo-100' :
                        activity.type === 'Match' ? 'bg-emerald-100' :
                        activity.type === 'User' ? 'bg-amber-100' : 'bg-blue-100'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{activity.action}</h4>
                        <p className="text-sm text-gray-500">By {activity.user} • {activity.time}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No recent activities</p>
              )}
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
                  <span className={`font-bold text-${stat.color}-600`}>{stat.value.toLocaleString()}</span>
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
                <span className="text-gray-700">Review Donations ({stats.pendingDonations} pending)</span>
              </a>
              <a href="/admin/manage-requests" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1">
                <FaClipboardList className="text-indigo-600 mr-3" />
                <span className="text-gray-700">Process Requests ({stats.pendingRequests} pending)</span>
              </a>
              <a href="/admin/manage-interests" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1">
                <FaHeart className="text-red-600 mr-3" />
                <span className="text-gray-700">Review Interests</span>
              </a>
              <a href="/admin/manage-matches" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all transform hover:-translate-y-1">
                <FaHandshake className="text-emerald-600 mr-3" />
                <span className="text-gray-700">Manage Matches ({stats.approvedMatches} active)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;