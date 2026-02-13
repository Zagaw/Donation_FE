import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { 
  FaHandsHelping, 
  FaEnvelope, 
  FaLock, 
  FaArrowRight, 
  FaUser, 
  FaEye, 
  FaEyeSlash,
  FaExclamationTriangle
} from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      // Prepare login credentials
      const credentials = {
        email: formData.email,
        password: formData.password
      };

      // Call login API
      const response = await api.auth.login(credentials);

      if (response.data) {
        const { token, user } = response.data;
        
        // Store auth data
        api.auth.setAuth(token, user);
        
        // Store remember me preference
        if (formData.remember) {
          localStorage.setItem('remember', 'true');
        }

        // Get user profile to determine redirection
        const meResponse = await api.auth.getMe();
        
        if (meResponse.data && meResponse.data.user) {
          const { user } = meResponse.data;
          
          // Role-based redirection
          switch (user.role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'donor':
              navigate('/donor');
              break;
            case 'receiver':
              navigate('/receiver');
              break;
            default:
              navigate('/dashboard');
          }
        } else {
          // Fallback redirection based on user role from login response
          if (user.role === 'donor') {
            navigate('/donor');
          } else if (user.role === 'receiver') {
            navigate('/receiver');
          } else if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        // Handle specific error responses
        switch (error.response.status) {
          case 401:
            setErrors({ submit: 'Invalid email or password. Please try again.' });
            break;
          case 422:
            const validationErrors = error.response.data.errors;
            const formattedErrors = {};
            
            Object.keys(validationErrors).forEach(key => {
              formattedErrors[key] = validationErrors[key][0];
            });
            
            setErrors(formattedErrors);
            break;
          case 429:
            setErrors({ submit: 'Too many login attempts. Please try again later.' });
            break;
          case 500:
            setErrors({ submit: 'Server error. Please try again later.' });
            break;
          default:
            setErrors({ submit: error.response.data?.message || 'Login failed. Please try again.' });
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

  // Check for stored auth on component mount
  React.useEffect(() => {
    const checkRememberMe = () => {
      const remember = localStorage.getItem('remember') === 'true';
      const token = api.auth.checkAuth();
      
      if (remember && token) {
        // Auto-redirect if user is already logged in
        const user = api.auth.getStoredUser();
        if (user) {
          if (user.role === 'donor') {
            navigate('/donor/dashboard');
          } else if (user.role === 'receiver') {
            navigate('/receiver/dashboard');
          } else if (user.role === 'admin') {
            navigate('/admin/dashboard');
          }
        }
      }
    };
    
    checkRememberMe();
  }, [navigate]);

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
            
            {/* Display submit error */}
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <FaExclamationTriangle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
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
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="inline mr-2 text-gray-400" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none hover:border-teal-300`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-teal-600 disabled:opacity-50"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded disabled:opacity-50"
                  checked={formData.remember}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-teal-600 hover:text-teal-800 transition-colors disabled:opacity-50"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'} text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform ${isLoading ? '' : 'hover:-translate-y-1 hover:shadow-md'} flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  Login to CommunityConnect
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-amber-600 hover:text-amber-800 transition-colors disabled:opacity-50"
                >
                  Register here
                </Link>
              </p>
            </div>

            {/* Demo Accounts Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-800 mb-2">Demo Accounts:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div><span className="font-medium">Donor:</span> donor@example.com / password</div>
                <div><span className="font-medium">Receiver:</span> receiver@example.com / password</div>
                <div><span className="font-medium">Admin:</span> admin@example.com / password</div>
              </div>
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
                className="w-full py-3 px-4 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-all hover:border-indigo-300 text-indigo-600 disabled:opacity-50"
                disabled={isLoading}
              >
                Google
              </button>
              <button
                type="button"
                className="w-full py-3 px-4 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-all hover:border-sky-300 text-sky-600 disabled:opacity-50"
                disabled={isLoading}
              >
                Facebook
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>
              By logging in, you agree to our{' '}
              <Link to="/terms" className="text-teal-600 hover:text-teal-800 transition-colors">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-teal-600 hover:text-teal-800 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;