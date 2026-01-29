import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHandsHelping, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaUserCircle, 
  FaBuilding, 
  FaArrowRight, 
  FaIdCard, 
  FaMapMarkerAlt, 
  FaPhone,
  FaCertificate,
  FaShieldAlt,
  FaChartLine
} from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'donor',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaHandsHelping className="text-teal-600 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-800">Community<span className="text-teal-600">Connect</span></h1>
            </Link>
            <Link to="/" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Register Form */}
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
              <FaUserCircle className="text-teal-600 text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Join Our Community</h2>
            <p className="mt-2 text-gray-600">Create an account to start making a difference</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-amber-500">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  <FaBuilding className="inline mr-2 text-gray-400" />
                  I want to:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`relative cursor-pointer p-4 border-2 rounded-md transition-all ${formData.userType === 'donor' ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-300'}`}>
                    <input
                      type="radio"
                      name="userType"
                      value="donor"
                      checked={formData.userType === 'donor'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${formData.userType === 'donor' ? 'border-teal-500' : 'border-gray-300'}`}>
                        {formData.userType === 'donor' && <div className="w-3 h-3 rounded-full bg-teal-500"></div>}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Join as Donor</div>
                        <div className="text-sm text-gray-500">Make donations and help others</div>
                      </div>
                    </div>
                  </label>
                  <label className={`relative cursor-pointer p-4 border-2 rounded-md transition-all ${formData.userType === 'receiver' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300'}`}>
                    <input
                      type="radio"
                      name="userType"
                      value="receiver"
                      checked={formData.userType === 'receiver'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${formData.userType === 'receiver' ? 'border-indigo-500' : 'border-gray-300'}`}>
                        {formData.userType === 'receiver' && <div className="w-3 h-3 rounded-full bg-indigo-500"></div>}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Request Help</div>
                        <div className="text-sm text-gray-500">Request assistance and support</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-gray-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2 text-gray-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2 text-gray-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-gray-400" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="inline mr-2 text-gray-400" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="inline mr-2 text-gray-400" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-teal-600 hover:text-teal-800 transition-colors">Terms of Service</a> and <a href="#" className="text-teal-600 hover:text-teal-800 transition-colors">Privacy Policy</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all transform hover:-translate-y-1 hover:shadow-md flex items-center justify-center group"
              >
                Create Account
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-teal-600 hover:text-teal-800 transition-colors">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-teal-50 to-amber-50 p-6 rounded-lg border border-teal-200">
            <h4 className="font-bold text-lg mb-4 text-gray-800">Benefits of joining:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-center bg-white p-3 rounded-md shadow-sm">
                <FaIdCard className="text-teal-600 mr-3" />
                <span className="text-gray-700">Verified Donor/Recipient Status</span>
              </li>
              <li className="flex items-center bg-white p-3 rounded-md shadow-sm">
                <FaCertificate className="text-amber-500 mr-3" />
                <span className="text-gray-700">Digital Certificates</span>
              </li>
              <li className="flex items-center bg-white p-3 rounded-md shadow-sm">
                <FaShieldAlt className="text-emerald-600 mr-3" />
                <span className="text-gray-700">Secure Transactions</span>
              </li>
              <li className="flex items-center bg-white p-3 rounded-md shadow-sm">
                <FaChartLine className="text-indigo-600 mr-3" />
                <span className="text-gray-700">Impact Tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;