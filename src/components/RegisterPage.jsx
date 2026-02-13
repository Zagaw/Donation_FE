import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/api'; // Updated import
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
  FaChartLine,
  FaBriefcase,
  FaHome
} from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    phone: '',
    address: '',
    donorType: 'personal',
    receiverType: 'personal'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
        ...(formData.role === 'donor' && { donorType: formData.donorType }),
        ...(formData.role === 'receiver' && { receiverType: formData.receiverType })
      };

      // Use the API module
      const response = await api.auth.register(userData);

      if (response.status === 201) {
        // Store auth data using the API module
        const { token, user } = response.data;
        api.auth.setAuth(token, user);

        // Navigate to dashboard or appropriate page based on role
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        // Handle validation errors from Laravel
        if (error.response.status === 422) {
          const validationErrors = error.response.data.errors;
          const formattedErrors = {};
          
          Object.keys(validationErrors).forEach(key => {
            formattedErrors[key] = validationErrors[key][0];
          });
          
          setErrors(formattedErrors);
        } else if (error.response.status === 400) {
          setErrors({ submit: error.response.data.message || 'Registration failed' });
        } else if (error.response.status === 409) {
          setErrors({ submit: 'Email already exists. Please use a different email or login.' });
        } else {
          setErrors({ submit: 'An error occurred during registration' });
        }
      } else if (error.request) {
        setErrors({ submit: 'Network error. Please check your connection and try again.' });
      } else {
        setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
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
            
            {/* Display submit error */}
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-amber-500">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  <FaBuilding className="inline mr-2 text-gray-400" />
                  I want to:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`relative cursor-pointer p-4 border-2 rounded-md transition-all ${formData.role === 'donor' ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-300'}`}>
                    <input
                      type="radio"
                      name="role"
                      value="donor"
                      checked={formData.role === 'donor'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${formData.role === 'donor' ? 'border-teal-500' : 'border-gray-300'}`}>
                        {formData.role === 'donor' && <div className="w-3 h-3 rounded-full bg-teal-500"></div>}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Join as Donor</div>
                        <div className="text-sm text-gray-500">Make donations and help others</div>
                      </div>
                    </div>
                  </label>
                  <label className={`relative cursor-pointer p-4 border-2 rounded-md transition-all ${formData.role === 'receiver' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300'}`}>
                    <input
                      type="radio"
                      name="role"
                      value="receiver"
                      checked={formData.role === 'receiver'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${formData.role === 'receiver' ? 'border-indigo-500' : 'border-gray-300'}`}>
                        {formData.role === 'receiver' && <div className="w-3 h-3 rounded-full bg-indigo-500"></div>}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Request Help</div>
                        <div className="text-sm text-gray-500">Request assistance and support</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Donor/Receiver Type Selection */}
              {formData.role && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    {formData.role === 'donor' ? (
                      <FaBriefcase className="inline mr-2 text-gray-400" />
                    ) : (
                      <FaHome className="inline mr-2 text-gray-400" />
                    )}
                    {formData.role === 'donor' ? 'Donor Type' : 'Receiver Type'}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative cursor-pointer p-4 border-2 rounded-md transition-all ${formData[`${formData.role}Type`] === 'personal' ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-300'}`}>
                      <input
                        type="radio"
                        name={`${formData.role}Type`}
                        value="personal"
                        checked={formData[`${formData.role}Type`] === 'personal'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${formData[`${formData.role}Type`] === 'personal' ? 'border-teal-500' : 'border-gray-300'}`}>
                          {formData[`${formData.role}Type`] === 'personal' && <div className="w-3 h-3 rounded-full bg-teal-500"></div>}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Personal</div>
                          <div className="text-sm text-gray-500">Individual account</div>
                        </div>
                      </div>
                    </label>
                    <label className={`relative cursor-pointer p-4 border-2 rounded-md transition-all ${formData[`${formData.role}Type`] === 'organization' ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-300'}`}>
                      <input
                        type="radio"
                        name={`${formData.role}Type`}
                        value="organization"
                        checked={formData[`${formData.role}Type`] === 'organization'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${formData[`${formData.role}Type`] === 'organization' ? 'border-teal-500' : 'border-gray-300'}`}>
                          {formData[`${formData.role}Type`] === 'organization' && <div className="w-3 h-3 rounded-full bg-teal-500"></div>}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">Organization</div>
                          <div className="text-sm text-gray-500">Company or institution</div>
                        </div>
                      </div>
                    </label>
                  </div>
                  {errors[`${formData.role}Type`] && (
                    <p className="mt-2 text-sm text-red-600">{errors[`${formData.role}Type`]}</p>
                  )}
                </div>
              )}

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-gray-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2 text-gray-400" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2 text-gray-400" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300`}
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-gray-400" />
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    className={`w-full px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300`}
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="inline mr-2 text-gray-400" />
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300`}
                    placeholder="Create a password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="inline mr-2 text-gray-400" />
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
                  onChange={handleChange}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="/terms" className="text-teal-600 hover:text-teal-800 transition-colors">Terms of Service</a> and <a href="/privacy" className="text-teal-600 hover:text-teal-800 transition-colors">Privacy Policy</a>
                </label>
              </div>
              {errors.terms && (
                <p className="mt-2 text-sm text-red-600">{errors.terms}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${isLoading ? 'bg-amber-400' : 'bg-amber-500 hover:bg-amber-600'} text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all transform ${isLoading ? '' : 'hover:-translate-y-1 hover:shadow-md'} flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
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