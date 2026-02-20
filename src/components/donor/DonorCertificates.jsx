// src/components/donor/Certificates.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorLayout from './DonorLayout';
import { certificateApi } from '../../api/cetificateApi';
import { 
  FaCertificate,
  FaDownload,
  FaEye,
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUser,
  FaBox,
  FaHeart,
  FaHandshake,
  FaFilePdf,
  FaSearch
} from 'react-icons/fa';

const DonorCertificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await certificateApi.getMyCertificates();
      setCertificates(response.data.certificates || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Failed to load certificates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = (id) => {
    navigate(`/donor/certificates/${id}`);
  };

  const handleDownloadCertificate = async (id) => {
    try {
      setDownloading(true);
      const response = await certificateApi.downloadCertificate(id);
      
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
    } finally {
      setDownloading(false);
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cert.certificateNumber?.toLowerCase().includes(searchLower) ||
      cert.title?.toLowerCase().includes(searchLower) ||
      cert.itemName?.toLowerCase().includes(searchLower) ||
      cert.recipientName?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DonorLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your certificates...</p>
          </div>
        </div>
      </DonorLayout>
    );
  }

  return (
    <DonorLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Certificates</h1>
          <p className="text-gray-600">View and download your donation certificates</p>
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
                <p className="text-gray-600">People Helped</p>
                <p className="text-3xl font-bold text-gray-800">
                  {new Set(certificates.map(c => c.recipientName)).size}
                </p>
              </div>
              <FaUser className="text-indigo-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Items Donated</p>
                <p className="text-3xl font-bold text-gray-800">
                  {certificates.reduce((sum, c) => sum + c.quantity, 0)}
                </p>
              </div>
              <FaBox className="text-emerald-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2 text-gray-400" />
                Search Certificates
              </label>
              <input
                type="text"
                placeholder="Search by certificate number, title, item or recipient..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map(cert => (
              <div key={cert.certificateId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                <div className="p-6">
                  {/* Certificate Icon and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600">
                      <FaCertificate className="text-white text-xl" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cert.status === 'generated' ? 'bg-gray-100 text-gray-700' :
                      cert.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {cert.status}
                    </span>
                  </div>

                  {/* Certificate Info */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{cert.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">#{cert.certificateNumber}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FaUser className="mr-2 text-teal-600 flex-shrink-0" />
                      <span className="text-sm">Recipient: {cert.recipientName}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <FaBox className="mr-2 text-indigo-600 flex-shrink-0" />
                      <span className="text-sm">{cert.itemName} ({cert.quantity})</span>
                    </div>

                    {cert.match?.matchType && (
                      <div className="flex items-center text-gray-600">
                        {cert.match.matchType === 'interest' ? (
                          <FaHeart className="mr-2 text-red-500 flex-shrink-0" />
                        ) : (
                          <FaHandshake className="mr-2 text-purple-600 flex-shrink-0" />
                        )}
                        <span className="text-sm">
                          {cert.match.matchType === 'interest' ? 'Interest-Based' : 'Manual Match'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-amber-600 flex-shrink-0" />
                      <span className="text-sm">Issued: {formatDate(cert.issueDate)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewCertificate(cert.certificateId)}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                    >
                      <FaEye className="mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadCertificate(cert.certificateId)}
                      disabled={downloading}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {downloading ? <FaSpinner className="animate-spin mr-2" /> : <FaDownload className="mr-2" />}
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FaCertificate className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Certificates Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search' : 'You don\'t have any certificates yet. They will appear here after your donations are completed.'}
            </p>
          </div>
        )}
      </div>
    </DonorLayout>
  );
};

export default DonorCertificates;