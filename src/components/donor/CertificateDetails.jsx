// src/components/donor/CertificateDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DonorLayout from './DonorLayout';
import { certificateApi } from '../../api/cetificateApi';
import { 
  FaCertificate,
  FaDownload,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft,
  FaUser,
  FaBox,
  FaCalendarAlt,
  FaHeart,
  FaHandshake,
  FaFilePdf,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';

const CertificateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCertificateDetails();
  }, [id]);

  const fetchCertificateDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await certificateApi.getCertificateDetails(id);
      setCertificate(response.data.certificate);
    } catch (error) {
      console.error('Error fetching certificate:', error);
      setError('Failed to load certificate details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await certificateApi.downloadCertificate(id);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificate.certificateNumber}.pdf`);
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
          <FaSpinner className="animate-spin text-4xl text-teal-600" />
        </div>
      </DonorLayout>
    );
  }

  if (error || !certificate) {
    return (
      <DonorLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-teal-600 mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error || 'Certificate not found'}</p>
          </div>
        </div>
      </DonorLayout>
    );
  }

  return (
    <DonorLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-teal-600 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Certificates
        </button>

        {/* Certificate Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-teal-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-indigo-600 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{certificate.title}</h1>
                <p className="text-teal-100">Certificate of Donation</p>
              </div>
              <FaCertificate className="text-5xl text-white opacity-50" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Certificate Number */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500">Certificate Number</p>
              <p className="text-xl font-mono text-teal-600 font-bold">{certificate.certificateNumber}</p>
            </div>

            {/* Main Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-teal-600" />
                  Recipient Information
                </h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {certificate.recipientName}</p>
                  {certificate.match?.request?.receiver?.user && (
                    <>
                      <p className="flex items-center">
                        <FaEnvelope className="mr-2 text-gray-400 text-sm" />
                        {certificate.match.request.receiver.user.email}
                      </p>
                      <p className="flex items-center">
                        <FaPhone className="mr-2 text-gray-400 text-sm" />
                        {certificate.match.request.receiver.user.phone}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaBox className="mr-2 text-indigo-600" />
                  Donation Details
                </h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Item:</span> {certificate.itemName}</p>
                  <p><span className="font-medium">Quantity:</span> {certificate.quantity}</p>
                  {certificate.category && (
                    <p><span className="font-medium">Category:</span> {certificate.category}</p>
                  )}
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    <span className="font-medium mr-2">Issued:</span> {formatDate(certificate.issueDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Match Type */}
            {certificate.match?.matchType && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700">
                  <span className="font-medium">Match Type:</span>{' '}
                  {certificate.match.matchType === 'interest' ? (
                    <span className="text-red-600">Interest-Based Match</span>
                  ) : (
                    <span className="text-purple-600">Manual Match</span>
                  )}
                </p>
              </div>
            )}

            {/* Description */}
            {certificate.description && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Message</h3>
                <p className="text-gray-600 italic">{certificate.description}</p>
                <p className="text-right mt-4 text-gray-500">- CommunityConnect Team</p>
              </div>
            )}

            {/* Download Button */}
            <div className="border-t border-gray-200 pt-6 flex justify-center">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {downloading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaDownload className="mr-2" />
                )}
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </DonorLayout>
  );
};

export default CertificateDetails;