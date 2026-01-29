import React from 'react';
import { Link } from 'react-router-dom';
import { FaDonate, FaHandsHelping, FaCheckCircle, FaCertificate, FaHeart, FaUsers, FaChartLine, FaHandHoldingHeart, FaHome, FaShieldAlt, FaBullhorn, FaGlobeAmericas } from 'react-icons/fa';

const LandingPage = () => {
  // Color palette
  const colors = {
    primary: 'teal',      // Main theme color
    secondary: 'amber',   // Accent for CTAs and highlights
    accent: 'indigo',     // For secondary elements
    neutral: 'gray',      // For text and backgrounds
    success: 'emerald',   // For positive indicators
    info: 'sky'          // For informational elements
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FaHandsHelping className={`text-${colors.primary}-600 text-2xl`} />
              <h1 className="text-2xl font-bold text-gray-800">Community<span className={`text-${colors.primary}-600`}>Connect</span></h1>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Home</Link>
              <a href="#about" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">About</a>
              <Link to="/login" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Login</Link>
              <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md font-medium transition-all hover:shadow-md">Donate Now</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Community Donation<br />
              <span className={`text-${colors.primary}-600`}>Management System</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              A transparent and efficient platform that connects donors with receivers and ensures every donation makes an impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-md font-medium text-lg transition-all hover:shadow-md transform hover:-translate-y-1 text-center">
                Make a Donation
              </Link>
              <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-medium text-lg transition-all hover:shadow-md transform hover:-translate-y-1 text-center">
                Request Support
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <FaDonate className="text-teal-600 text-4xl mb-4" />
              <h3 className="font-bold text-xl mb-2">Easy Donations</h3>
              <p className="text-gray-600">Simple and secure donation process</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <FaHandsHelping className="text-indigo-600 text-4xl mb-4" />
              <h3 className="font-bold text-xl mb-2">Request Assistance</h3>
              <p className="text-gray-600">Get help when you need it most</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <FaCheckCircle className="text-emerald-600 text-4xl mb-4" />
              <h3 className="font-bold text-xl mb-2">Admin Approval</h3>
              <p className="text-gray-600">Verified and transparent process</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <FaCertificate className="text-amber-500 text-4xl mb-4" />
              <h3 className="font-bold text-xl mb-2">Certificates</h3>
              <p className="text-gray-600">Receive acknowledgment for contributions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-teal-50 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold mb-2 text-teal-600">298</div>
              <p className="text-gray-600">Donations Made</p>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold mb-2 text-indigo-600">267</div>
              <p className="text-gray-600">Requests Fulfilled</p>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold mb-2 text-emerald-600">225</div>
              <p className="text-gray-600">Happy Recipients</p>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-4xl font-bold mb-2 text-amber-500">23</div>
              <p className="text-gray-600">Communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaDonate className="text-teal-600 text-2xl" />
            </div>
            <h4 className="font-bold text-xl mb-4 text-gray-800">Join as Donor</h4>
            <p className="text-gray-600">Register and start making donations to support your community</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHandsHelping className="text-indigo-600 text-2xl" />
            </div>
            <h4 className="font-bold text-xl mb-4 text-gray-800">Request Help</h4>
            <p className="text-gray-600">Submit your request for assistance through our platform</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaChartLine className="text-amber-500 text-2xl" />
            </div>
            <h4 className="font-bold text-xl mb-4 text-gray-800">Track Impact</h4>
            <p className="text-gray-600">Monitor your donations and see how they make a difference</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-teal-500">
              <FaShieldAlt className="text-teal-600 text-3xl mb-4" />
              <h4 className="font-bold text-xl mb-3">Secure & Transparent</h4>
              <p className="text-gray-600">All transactions are secure and fully transparent</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-indigo-500">
              <FaBullhorn className="text-indigo-600 text-3xl mb-4" />
              <h4 className="font-bold text-xl mb-3">Real-time Updates</h4>
              <p className="text-gray-600">Get instant notifications about your donations</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-emerald-500">
              <FaGlobeAmericas className="text-emerald-600 text-3xl mb-4" />
              <h4 className="font-bold text-xl mb-3">Community Focus</h4>
              <p className="text-gray-600">Connect with local communities and make direct impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-teal-50 to-amber-50 p-12 rounded-2xl">
          <h3 className="text-3xl font-bold mb-6 text-gray-800">Be a part of positive change in your community today</h3>
          <Link to="/register" className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-medium text-lg transition-all hover:shadow-md transform hover:-translate-y-1">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaHandsHelping className="text-teal-400" />
                <h4 className="text-xl font-bold">CommunityConnect</h4>
              </div>
              <p className="text-gray-400">Making every donation count</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">About Us</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-300 transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-teal-300 transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-teal-300 transition-colors">Partners</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-300 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-teal-300 transition-colors">Email</a></li>
                <li><a href="#" className="hover:text-teal-300 transition-colors">Phone</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-teal-300 transition-colors">Terms of Donation</a></li>
                <li><a href="#" className="hover:text-teal-300 transition-colors">History</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Community Donation Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;