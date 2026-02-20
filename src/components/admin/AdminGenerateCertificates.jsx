// src/components/admin/GenerateCertificates.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { adminApi } from '../../api/adminApi';
import { 
  FaCertificate,
  FaDownload,
  FaTrash,
  FaEye,
  FaPlus,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUser,
  FaBox,
  FaCalendarAlt,
  FaHeart,
  FaHandshake,
  FaFilePdf,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const AdminGenerateCertificates = () => {
  const [eligibleMatches, setEligibleMatches] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('eligible'); // 'eligible' or 'all'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [certificateForm, setCertificateForm] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [eligibleRes, certificatesRes] = await Promise.all([
        adminApi.getEligibleMatchesForCertificates(),
        adminApi.getAllCertificates()
      ]);
      
      setEligibleMatches(eligibleRes.data.matches || []);
      setCertificates(certificatesRes.data.certificates || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateClick = (match) => {
    setSelectedMatch(match);
    setCertificateForm({
      title: `Certificate of Appreciation - ${match.donation?.itemName || match.request?.itemName}`,
      description: `Thank you for your generous donation to ${match.request?.receiver?.user?.name || 'the community'}.`
    });
    setShowGenerateModal(true);
  };

  const handleGenerateCertificate = async () => {
    if (!certificateForm.title) {
      alert('Please enter a certificate title');
      return;
    }

    try {
      setActionLoading(true);
      const response = await adminApi.generateCertificate({
        matchId: selectedMatch.matchId,
        title: certificateForm.title,
        description: certificateForm.description
      });
      
      alert('Certificate generated successfully!');
      setShowGenerateModal(false);
      fetchData(); // Refresh lists
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert(error.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadCertificate = async (id) => {
    try {
      const response = await adminApi.downloadCertificate(id);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate');
    }
  };

  const handleDeleteCertificate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      await adminApi.deleteCertificate(id);
      alert('Certificate deleted successfully');
      fetchData(); // Refresh lists
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('Failed to delete certificate');
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cert.certificateNumber?.toLowerCase().includes(searchLower) ||
      cert.itemName?.toLowerCase().includes(searchLower) ||
      cert.recipientName?.toLowerCase().includes(searchLower) ||
      cert.donor?.user?.name?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading certificates...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Certificate Management</h1>
          <p className="text-gray-600">Generate and manage donation certificates</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-gray-600">Eligible Matches</p>
                <p className="text-3xl font-bold text-gray-800">{eligibleMatches.length}</p>
              </div>
              <FaCheckCircle className="text-indigo-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Generated This Month</p>
                <p className="text-3xl font-bold text-gray-800">
                  {certificates.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <FaFilePdf className="text-emerald-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('eligible')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'eligible'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Eligible Matches ({eligibleMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'all'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Certificates ({certificates.length})
          </button>
        </div>

        {/* Search - only show for all certificates tab */}
        {activeTab === 'all' && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaSearch className="inline mr-2 text-gray-400" />
                  Search Certificates
                </label>
                <input
                  type="text"
                  placeholder="Search by certificate number, item, recipient or donor..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'eligible' ? (
          // Eligible Matches List
          eligibleMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eligibleMatches.map(match => {
                const donorName = match.donation?.donor?.user?.name || match.interest?.donor?.user?.name || 'Unknown Donor';
                const receiverName = match.request?.receiver?.user?.name || 'Unknown Receiver';
                const itemName = match.donation?.itemName || match.request?.itemName || 'Unknown Item';
                
                return (
                  <div key={match.matchId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-teal-100">
                          <FaHandshake className="text-teal-600 text-xl" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          match.matchType === 'interest' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {match.matchType === 'interest' ? 'Interest' : 'Manual'}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{itemName}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Donor:</span> {donorName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Receiver:</span> {receiverName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Quantity:</span> {match.donation?.quantity || match.request?.quantity}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          Completed: {formatDate(match.updated_at)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleGenerateClick(match)}
                        className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                      >
                        <FaPlus className="mr-2" />
                        Generate Certificate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <FaCertificate className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Eligible Matches</h3>
              <p className="text-gray-600">All completed matches already have certificates.</p>
            </div>
          )
        ) : (
          // All Certificates List
          filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map(cert => (
                <div key={cert.certificateId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-amber-100">
                        <FaCertificate className="text-amber-600 text-xl" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cert.status === 'generated' ? 'bg-gray-100 text-gray-700' :
                        cert.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {cert.status}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{cert.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">#{cert.certificateNumber}</p>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Donor:</span> {cert.donor?.user?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Recipient:</span> {cert.recipientName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Item:</span> {cert.itemName} ({cert.quantity})
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        Issued: {formatDate(cert.issueDate)}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownloadCertificate(cert.certificateId)}
                        className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteCertificate(cert.certificateId)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <FaCertificate className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Certificates Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'Generate your first certificate from eligible matches'}
              </p>
            </div>
          )
        )}

        {/* Generate Certificate Modal */}
        {showGenerateModal && selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Generate Certificate</h2>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-teal-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-teal-700">
                    <span className="font-medium">Match Details:</span> {selectedMatch.donation?.itemName || selectedMatch.request?.itemName} - 
                    Donor: {selectedMatch.donation?.donor?.user?.name || selectedMatch.interest?.donor?.user?.name} →
                    Receiver: {selectedMatch.request?.receiver?.user?.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={certificateForm.title}
                    onChange={(e) => setCertificateForm({...certificateForm, title: e.target.value})}
                    placeholder="e.g., Certificate of Appreciation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={certificateForm.description}
                    onChange={(e) => setCertificateForm({...certificateForm, description: e.target.value})}
                    placeholder="Add a personalized message..."
                  />
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    This will generate a certificate for the donor. They will be able to view and download it from their account.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateCertificate}
                  disabled={actionLoading || !certificateForm.title}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {actionLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCertificate className="mr-2" />}
                  Generate Certificate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGenerateCertificates;