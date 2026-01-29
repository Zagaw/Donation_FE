import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHandsHelping, FaEnvelope, FaLock, FaArrowRight, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg border-t-4 border-teal-500">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
              <FaUser className="text-teal-600 text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Login to continue helping your community</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="inline mr-2 text-gray-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-teal-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-teal-600 hover:text-teal-800 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:-translate-y-1 hover:shadow-md flex items-center justify-center group"
            >
              Login to Donation Portal
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-amber-600 hover:text-amber-800 transition-colors">
                  Register here
                </Link>
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full py-3 px-4 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-all hover:border-indigo-300 text-indigo-600"
              >
                Google
              </button>
              <button
                type="button"
                className="w-full py-3 px-4 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-all hover:border-sky-300 text-sky-600"
              >
                Facebook
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>By logging in, you agree to our <a href="#" className="text-teal-600 hover:text-teal-800 transition-colors">Terms</a> and <a href="#" className="text-teal-600 hover:text-teal-800 transition-colors">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;