import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { 
  FaCertificate, 
  FaDownload, 
  FaPrint, 
  FaSearch, 
  FaFilter,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
  FaFilePdf,
  FaEnvelope,
  FaShareAlt,
  FaEye,
  FaEdit
} from 'react-icons/fa';

const GenerateCertificates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const certificates = [
    {
      id: 1,
      title: 'Community Hero Award',
      recipient: 'John Smith',
      type: 'achievement',
      date: '2024-01-15',
      status: 'generated',
      serial: 'CH-2024-001',
      template: 'Gold Standard',
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'Food Donation Certificate',
      recipient: 'Community Center',
      type: 'donation',
      date: '2024-01-14',
      status: 'pending',
      serial: 'FD-2024-045',
      template: 'Basic',
      downloadUrl: '#'
    },
    {
      id: 3,
      title: 'Education Supporter',
      recipient: 'Sarah Johnson',
      type: 'achievement',
      date: '2024-01-13',
      status: 'generated',
      serial: 'ES-2024-023',
      template: 'Silver Standard',
      downloadUrl: '#'
    },
    {
      id: 4,
      title: 'Winter Relief Donation',
      recipient: 'Local Charity',
      type: 'donation',
      date: '2024-01-12',
      status: 'generated',
      serial: 'WR-2023-189',
      template: 'Gold Standard',
      downloadUrl: '#'
    },
    {
      id: 5,
      title: 'Monthly Donor Certificate',
      recipient: 'Michael Chen',
      type: 'achievement',
      date: '2024-01-11',
      status: 'pending',
      serial: 'MD-2024-078',
      template: 'Platinum',
      downloadUrl: '#'
    },
    {
      id: 6,
      title: 'Medical Aid Certificate',
      recipient: 'City Hospital',
      type: 'donation',
      date: '2024-01-10',
      status: 'generated',
      serial: 'MA-2023-156',
      template: 'Basic',
      downloadUrl: '#'
    },
  ];

  const templates = [
    { id: 'basic', name: 'Basic Certificate', color: 'gray' },
    { id: 'silver', name: 'Silver Standard', color: 'gray-400' },
    { id: 'gold', name: 'Gold Standard', color: 'amber' },
    { id: 'platinum', name: 'Platinum Premium', color: 'indigo' },
  ];

  const filteredCertificates = certificates.filter(cert => {
    const matchesFilter = filter === 'all' || cert.status === filter || cert.type === filter;
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleGenerate = (id) => {
    alert(`Generating certificate ${id}`);
    // Implement generation logic
  };

  const handleDownload = (id) => {
    alert(`Downloading certificate ${id}`);
    // Implement download logic
  };

  const handleSendEmail = (id) => {
    alert(`Sending certificate ${id} via email`);
    // Implement email logic
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'generated': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Generated' };
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' };
      case 'draft': return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'achievement': return { bg: 'bg-indigo-100', text: 'text-indigo-700' };
      case 'donation': return { bg: 'bg-teal-100', text: 'text-teal-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  return (
    <AdminLayout activePage="certificates">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Generate Certificates</h1>
        <p className="text-gray-600">Create and manage certificates for donors</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Certificates</p>
              <p className="text-3xl font-bold text-gray-800">{certificates.length}</p>
            </div>
            <FaCertificate className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Generated</p>
              <p className="text-3xl font-bold text-gray-800">{certificates.filter(c => c.status === 'generated').length}</p>
            </div>
            <FaCheckCircle className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-800">{certificates.filter(c => c.status === 'pending').length}</p>
            </div>
            <FaFilePdf className="text-amber-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Templates</p>
              <p className="text-3xl font-bold text-gray-800">{templates.length}</p>
            </div>
            <FaEdit className="text-emerald-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Certificate Generator */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaCertificate className="text-teal-600 mr-2" />
          Generate New Certificate
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Name *
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter recipient name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Type *
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option>Select type</option>
              <option value="achievement">Achievement Award</option>
              <option value="donation">Donation Certificate</option>
              <option value="recognition">Recognition Certificate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map(template => (
                <label key={template.id} className="relative cursor-pointer">
                  <input type="radio" name="template" className="sr-only peer" />
                  <div className="p-3 border-2 border-gray-200 rounded-lg hover:border-teal-300 peer-checked:border-teal-500 peer-checked:bg-teal-50 transition-colors">
                    <div className="font-medium text-gray-800">{template.name}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Issue *
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description / Reason
            </label>
            <textarea
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Describe the achievement or donation..."
            />
          </div>
          <div className="md:col-span-2 flex justify-end space-x-4">
            <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
              Save as Draft
            </button>
            <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">
              Generate Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2 text-gray-400" />
              Search Certificates
            </label>
            <input
              type="text"
              placeholder="Search by title or recipient..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-2 text-gray-400" />
              Filter by Status
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="generated">Generated</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bulk Actions
            </label>
            <div className="flex space-x-2">
              <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Generate All Pending
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                Export List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.map((cert) => {
                const status = getStatusColor(cert.status);
                const type = getTypeColor(cert.type);
                return (
                  <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${type.bg} mr-3`}>
                          <FaCertificate className={type.text} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{cert.title}</div>
                          <div className="text-sm text-gray-500">
                            Serial: {cert.serial} • Template: {cert.template}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <span className="text-gray-900">{cert.recipient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <span className="text-gray-900">{cert.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(cert.id)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <FaDownload />
                        </button>
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print">
                          <FaPrint />
                        </button>
                        <button
                          onClick={() => handleSendEmail(cert.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <FaEnvelope />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Preview">
                          <FaEye />
                        </button>
                        {cert.status === 'pending' && (
                          <button
                            onClick={() => handleGenerate(cert.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Generate"
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl p-6 border border-teal-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Certificate Templates</h3>
          <div className="space-y-4">
            {templates.map(template => (
              <div key={template.id} className="p-4 bg-white rounded-lg hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800">{template.name}</h4>
                    <p className="text-sm text-gray-500">Click to preview template</p>
                  </div>
                  <button className="text-teal-600 hover:text-teal-800">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Certificate Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Certificates Generated This Month</span>
              <span className="font-bold text-teal-600">24</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Most Used Template</span>
              <span className="font-bold text-indigo-600">Gold Standard</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Average Generation Time</span>
              <span className="font-bold text-amber-600">2.3 minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email Delivery Rate</span>
              <span className="font-bold text-emerald-600">98.5%</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GenerateCertificates;