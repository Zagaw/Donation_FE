import React, { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
  FaChartBar, 
  FaFileExport, 
  FaCalendarAlt, 
  FaFilter,
  FaDownload,
  FaPrint,
  FaEye,
  FaUsers,
  FaBox,
  FaHandshake,
  FaDollarSign,
  FaChartLine,
  FaTable
} from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const Reports = () => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  // Donation Statistics Data
  const donationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Donations Made',
        data: [42, 48, 52, 58, 62, 68],
        backgroundColor: 'rgba(20, 184, 166, 0.6)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 1,
      },
      {
        label: 'Requests Made',
        data: [38, 42, 45, 48, 52, 55],
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  };

  const donationOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Activity'
      }
    },
  };

  // Category Distribution Data
  const categoryData = {
    labels: ['Food', 'Clothing', 'Medical', 'Educational', 'Shelter', 'Other'],
    datasets: [
      {
        data: [35, 20, 15, 12, 10, 8],
        backgroundColor: [
          'rgba(20, 184, 166, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // User Growth Data
  const userGrowthData = {
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
        label: 'Active Users',
        data: [600, 650, 700, 750, 800, 850],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.3,
      },
    ],
  };

  // Summary Stats
  const summaryStats = [
    { title: 'Total Users', value: '1,248', change: '+8.2%', icon: FaUsers, color: 'teal' },
    { title: 'Total Donations', value: '892', change: '+12.5%', icon: FaBox, color: 'indigo' },
    { title: 'Successful Matches', value: '732', change: '+15.3%', icon: FaHandshake, color: 'emerald' },
    { title: 'Total Value', value: '$42,850', change: '+18.7%', icon: FaDollarSign, color: 'amber' },
  ];

  // Recent Reports
  const recentReports = [
    { id: 1, title: 'Monthly Performance Report', date: '2024-01-15', type: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'User Activity Analysis', date: '2024-01-10', type: 'Excel', size: '1.8 MB' },
    { id: 3, title: 'Donation Category Report', date: '2024-01-05', type: 'PDF', size: '3.2 MB' },
    { id: 4, title: 'Quarterly Summary', date: '2023-12-30', type: 'PDF', size: '4.1 MB' },
  ];

  const handleGenerateReport = () => {
    alert(`Generating ${reportType} report for ${dateRange}...`);
    // Implement report generation logic
  };

  const handleExport = (format) => {
    alert(`Exporting report as ${format}...`);
    // Implement export logic
  };

  return (
    <AdminLayout activePage="reports">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Generate and view system reports and analytics</p>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2 text-gray-400" />
              Date Range
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 12 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-2 text-gray-400" />
              Report Type
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="donations">Donations Report</option>
              <option value="requests">Requests Report</option>
              <option value="users">User Activity</option>
              <option value="financial">Financial Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('PDF')}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                PDF
              </button>
              <button
                onClick={() => handleExport('Excel')}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Excel
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generate Report
            </label>
            <button
              onClick={handleGenerateReport}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <FaChartBar className="mr-2" />
              Generate Now
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`text-${stat.color}-600 text-xl`} />
              </div>
              <div className="text-sm font-medium text-emerald-600">
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
          <Bar data={donationData} options={donationOptions} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="h-64">
            <Pie 
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  title: {
                    display: true,
                    text: 'Category Distribution'
                  }
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <Line 
          data={userGrowthData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'User Growth Trend'
              }
            },
          }}
        />
      </div>

      {/* Recent Reports & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FaFileExport className="text-teal-600 mr-2" />
              Recent Reports
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{report.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">{report.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.type === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">{report.size}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="View">
                            <FaEye />
                          </button>
                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download">
                            <FaDownload />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Print">
                            <FaPrint />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Avg. Donation Value</span>
                <span className="font-bold text-teal-600">$150</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Match Success Rate</span>
                <span className="font-bold text-indigo-600">83%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">User Satisfaction</span>
                <span className="font-bold text-emerald-600">4.7/5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">System Uptime</span>
                <span className="font-bold text-amber-600">99.8%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Reports</h2>
            <div className="space-y-3">
              <button className="w-full p-3 bg-white rounded-lg hover:shadow-md transition-all text-left flex items-center">
                <FaChartLine className="text-teal-600 mr-3" />
                <span>Daily Activity Report</span>
              </button>
              <button className="w-full p-3 bg-white rounded-lg hover:shadow-md transition-all text-left flex items-center">
                <FaUsers className="text-indigo-600 mr-3" />
                <span>User Growth Report</span>
              </button>
              <button className="w-full p-3 bg-white rounded-lg hover:shadow-md transition-all text-left flex items-center">
                <FaTable className="text-amber-600 mr-3" />
                <span>Financial Summary</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;