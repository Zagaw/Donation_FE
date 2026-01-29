import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import ReceiverDashboard from './components/receiver/ReceiverDashboard';
import RequestForm from './components/receiver/RequestForm';
import DonationList from './components/receiver/DonationList';
import ReceivedDonations from './components/receiver/ReceivedDonations';
import Feedback from './components/receiver/Feedback';
import Profile from './components/receiver/Profile';
import DonorDashboard from './components/donor/DonorDashboard';
import DonationForm from './components/donor/DonationForm';
import RequestList from './components/donor/RequestList';
import DonationHistory from './components/donor/DonationHistory';
import Certificates from './components/donor/Certificates';
import DonorProfile from './components/donor/DonorProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Receiver Routes */}
          <Route path="/receiver" element={<ReceiverDashboard />} />
          <Route path="/receiver/request" element={<RequestForm />} />
          <Route path="/receiver/donations" element={<DonationList />} />
          <Route path="/receiver/received" element={<ReceivedDonations />} />
          <Route path="/receiver/feedback" element={<Feedback />} />
          <Route path="/receiver/profile" element={<Profile />} />
          
          {/* Donor Routes */}
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/donor/donate" element={<DonationForm />} />
          <Route path="/donor/requests" element={<RequestList />} />
          <Route path="/donor/history" element={<DonationHistory />} />
          <Route path="/donor/certificates" element={<Certificates />} />
          <Route path="/donor/profile" element={<DonorProfile />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;