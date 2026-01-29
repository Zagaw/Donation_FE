import React from 'react';
import DonorLayout from './DonorLayout';
import { 
  FaCertificate, 
  FaDownload, 
  FaPrint, 
  FaShareAlt, 
  FaCalendarAlt,
  FaAward,
  FaStar,
  FaTrophy,
  FaCheckCircle
} from 'react-icons/fa';

const Certificates = () => {
  const certificates = [
    {
      id: 1,
      title: 'Community Hero Award',
      type: 'achievement',
      date: '2024-01-15',
      description: 'For outstanding contributions to community welfare',
      serial: 'CH-2024-001',
      level: 'Gold',
      downloadable: true
    },
    {
      id: 2,
      title: 'Food Donation Certificate',
      type: 'donation',
      date: '2024-01-10',
      description: 'Donation of 25kg food supplies to local families',
      serial: 'FD-2024-045',
      value: '$150',
      downloadable: true
    },
    {
      id: 3,
      title: 'Education Supporter',
      type: 'achievement',
      date: '2024-01-05',
      description: 'Supporting educational needs of underprivileged students',
      serial: 'ES-2024-023',
      level: 'Silver',
      downloadable: true
    },
    {
      id: 4,
      title: 'Winter Relief Donation',
      type: 'donation',
      date: '2023-12-20',
      description: 'Winter clothing donation for homeless shelter',
      serial: 'WR-2023-189',
      value: '$200',
      downloadable: true
    },
    {
      id: 5,
      title: 'Medical Aid Certificate',
      type: 'donation',
      date: '2023-12-15',
      description: 'First aid kits donation to community clinic',
      serial: 'MA-2023-156',
      value: '$75',
      downloadable: true
    },
    {
      id: 6,
      title: 'Monthly Donor',
      type: 'achievement',
      date: '2023-12-01',
      description: 'Consistent monthly donations for 6 months',
      serial: 'MD-2023-078',
      level: 'Platinum',
      downloadable: true
    },
  ];

  const stats = {
    totalCertificates: certificates.length,
    achievementCertificates: certificates.filter(c => c.type === 'achievement').length,
    donationCertificates: certificates.filter(c => c.type === 'donation').length,
    topLevel: 'Platinum'
  };

  const handleDownload = (id) => {
    alert(`Downloading certificate ${id}`);
    // Implement download logic
  };

  const handlePrint = (id) => {
    alert(`Printing certificate ${id}`);
    // Implement print logic
  };

  const handleShare = (id) => {
    alert(`Sharing certificate ${id}`);
    // Implement share logic
  };

  return (
    <DonorLayout activePage="certificates">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Certificates & Awards</h1>
        <p className="text-gray-600">Your recognition for making a difference</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Certificates</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalCertificates}</p>
            </div>
            <FaCertificate className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Achievement Awards</p>
              <p className="text-3xl font-bold text-gray-800">{stats.achievementCertificates}</p>
            </div>
            <FaAward className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Donation Certificates</p>
              <p className="text-3xl font-bold text-gray-800">{stats.donationCertificates}</p>
            </div>
            <FaCheckCircle className="text-amber-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Top Level</p>
              <p className="text-3xl font-bold text-gray-800">{stats.topLevel}</p>
            </div>
            <FaTrophy className="text-emerald-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            {/* Certificate Header */}
            <div className={`p-6 rounded-t-xl ${
              certificate.type === 'achievement' 
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500' 
                : 'bg-gradient-to-r from-teal-50 to-emerald-50 border-l-4 border-teal-500'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{certificate.title}</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      certificate.type === 'achievement' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-teal-100 text-teal-700'
                    }`}>
                      {certificate.type === 'achievement' ? 'Achievement Award' : 'Donation Certificate'}
                    </span>
                    {certificate.level && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        certificate.level === 'Gold' ? 'bg-amber-100 text-amber-700' :
                        certificate.level === 'Platinum' ? 'bg-gray-100 text-gray-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {certificate.level}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {certificate.type === 'donation' ? certificate.value : '⭐'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {certificate.type === 'donation' ? 'Value' : 'Level'}
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">{certificate.description}</p>
              
              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaCertificate className="mr-2 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Serial No.</div>
                    <div className="font-medium">{certificate.serial}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Issued Date</div>
                    <div className="font-medium">{certificate.date}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDownload(certificate.id)}
                  className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all flex items-center justify-center"
                >
                  <FaDownload className="mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => handlePrint(certificate.id)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Print"
                >
                  <FaPrint className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare(certificate.id)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Share"
                >
                  <FaShareAlt className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Preview & Badges */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Digital Badges */}
        <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl p-6 border border-teal-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaAward className="text-teal-600 mr-2" />
            Digital Badges Earned
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaStar className="text-amber-500 text-2xl" />
              </div>
              <div className="text-sm font-medium text-gray-800">First Donation</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaTrophy className="text-teal-600 text-2xl" />
              </div>
              <div className="text-sm font-medium text-gray-800">Community Hero</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaCertificate className="text-indigo-600 text-2xl" />
              </div>
              <div className="text-sm font-medium text-gray-800">Monthly Donor</div>
            </div>
          </div>
        </div>

        {/* Certificate Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Certificate Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Total Achievements</span>
              <span className="font-bold text-indigo-600">3 awards</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Total Donations Certified</span>
              <span className="font-bold text-teal-600">$1,025</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Issued This Year</span>
              <span className="font-bold text-amber-600">4 certificates</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shareable Links</span>
              <button className="text-teal-600 hover:text-teal-800 font-medium">
                Generate All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="mt-8 bg-gradient-to-r from-teal-50 to-amber-50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Download All Certificates</h3>
            <p className="text-gray-600">Get a complete archive of your certificates</p>
          </div>
          <button className="mt-4 md:mt-0 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-1 flex items-center">
            <FaDownload className="mr-2" />
            Download All as ZIP
          </button>
        </div>
      </div>
    </DonorLayout>
  );
};

export default Certificates;