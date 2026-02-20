// src/components/Feedback.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedbackApi } from '../../api/feedbackApi';
import { 
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaComment,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUser,
  FaUserSecret,
  FaHandshake,
  FaBox,
  FaHeart
} from 'react-icons/fa';
import DonorLayout from './DonorLayout';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [myFeedback, setMyFeedback] = useState([]);
  const [eligibleMatches, setEligibleMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('eligible'); // 'eligible' or 'my'
  
  // Modal state for submitting feedback
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [formData, setFormData] = useState({
    matchId: null,
    rating: 5,
    comment: '',
    category: 'donation_experience',
    is_anonymous: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [feedbackRes, eligibleRes] = await Promise.all([
        feedbackApi.getMyFeedback(),
        feedbackApi.getEligibleMatchesForFeedback()
      ]);
      
      setMyFeedback(feedbackRes.data.feedback || []);
      setEligibleMatches(eligibleRes.data.matches || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      setSubmitting(true);
      
      const data = {
        ...formData,
        matchId: selectedMatch?.matchId || null
      };

      if (editMode && editingId) {
        await feedbackApi.updateFeedback(editingId, data);
        alert('Feedback updated successfully!');
      } else {
        await feedbackApi.submitFeedback(data);
        alert('Feedback submitted successfully! Thank you for your input.');
      }
      
      setShowFeedbackModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFeedback = (feedback) => {
    setEditMode(true);
    setEditingId(feedback.feedbackId);
    setSelectedMatch(feedback.match || null);
    setFormData({
      matchId: feedback.matchId,
      rating: feedback.rating,
      comment: feedback.comment || '',
      category: feedback.category,
      is_anonymous: feedback.is_anonymous
    });
    setShowFeedbackModal(true);
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      await feedbackApi.deleteFeedback(id);
      alert('Feedback deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert(error.response?.data?.message || 'Failed to delete feedback');
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setEditingId(null);
    setSelectedMatch(null);
    setFormData({
      matchId: null,
      rating: 5,
      comment: '',
      category: 'donation_experience',
      is_anonymous: false
    });
  };

  const getCategoryLabel = (category) => {
    const categories = {
      donation_experience: 'Donation Experience',
      request_experience: 'Request Experience',
      matching_process: 'Matching Process',
      communication: 'Communication',
      platform_usability: 'Platform Usability',
      other: 'Other'
    };
    return categories[category] || category;
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending', icon: FaClock };
      case 'approved':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved', icon: FaCheckCircle };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: FaTimesCircle };
      case 'featured':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Featured', icon: FaStar };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-amber-400">
            {star <= rating ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  return (
    <DonorLayout>
        <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Feedback</h1>
                <p className="text-gray-600">Share your experience or view your past feedback</p>
            </div>

            {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700">{error}</p>
            </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600">Total Feedback</p>
                    <p className="text-3xl font-bold text-gray-800">{myFeedback.length}</p>
                </div>
                <FaComment className="text-teal-600 text-2xl" />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600">Average Rating</p>
                    <p className="text-3xl font-bold text-gray-800">
                    {myFeedback.length > 0 
                        ? (myFeedback.reduce((sum, f) => sum + f.rating, 0) / myFeedback.length).toFixed(1)
                        : 'N/A'}
                    </p>
                </div>
                <FaStar className="text-indigo-600 text-2xl" />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600">Pending Reviews</p>
                    <p className="text-3xl font-bold text-gray-800">
                    {myFeedback.filter(f => f.status === 'pending').length}
                    </p>
                </div>
                <FaClock className="text-emerald-600 text-2xl" />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600">Eligible Matches</p>
                    <p className="text-3xl font-bold text-gray-800">{eligibleMatches.length}</p>
                </div>
                <FaHandshake className="text-amber-600 text-2xl" />
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
                Give Feedback ({eligibleMatches.length})
            </button>
            <button
                onClick={() => setActiveTab('my')}
                className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'my'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                My Feedback ({myFeedback.length})
            </button>
            </div>

            {/* Content */}
            {activeTab === 'eligible' ? (
            // Eligible Matches List
            eligibleMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eligibleMatches.map(match => {
                    const donorName = match.donation?.donor?.user?.name || match.interest?.donor?.user?.name || 'Donor';
                    const receiverName = match.request?.receiver?.user?.name || 'Receiver';
                    const itemName = match.donation?.itemName || match.request?.itemName || 'Item';
                    
                    return (
                    <div key={match.matchId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                        <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-lg bg-teal-100">
                            {match.matchType === 'interest' 
                                ? <FaHeart className="text-red-500 text-xl" />
                                : <FaHandshake className="text-teal-600 text-xl" />
                            }
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            match.matchType === 'interest' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                            {match.matchType === 'interest' ? 'Interest Match' : 'Manual Match'}
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
                        </div>

                        <button
                            onClick={() => {
                            setSelectedMatch(match);
                            setFormData(prev => ({ ...prev, matchId: match.matchId }));
                            setShowFeedbackModal(true);
                            }}
                            className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                        >
                            <FaPlus className="mr-2" />
                            Give Feedback
                        </button>
                        </div>
                    </div>
                    );
                })}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <FaComment className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">No Eligible Matches</h3>
                <p className="text-gray-600">You don't have any completed matches to give feedback on yet.</p>
                </div>
            )
            ) : (
            // My Feedback List
            myFeedback.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myFeedback.map(feedback => {
                    const status = getStatusBadge(feedback.status);
                    const StatusIcon = status.icon;
                    
                    return (
                    <div key={feedback.feedbackId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                        <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                            {feedback.is_anonymous ? (
                                <div className="p-2 rounded-lg bg-gray-100 mr-3">
                                <FaUserSecret className="text-gray-600" />
                                </div>
                            ) : (
                                <div className="p-2 rounded-lg bg-teal-100 mr-3">
                                <FaUser className="text-teal-600" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-gray-800">
                                {feedback.is_anonymous ? 'Anonymous' : feedback.user?.name}
                                </h3>
                                <p className="text-xs text-gray-500">{getCategoryLabel(feedback.category)}</p>
                            </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} flex items-center`}>
                            <StatusIcon className="mr-1 w-3 h-3" />
                            {status.label}
                            </span>
                        </div>

                        <div className="mb-3">
                            {renderStars(feedback.rating)}
                        </div>

                        {feedback.comment && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            "{feedback.comment}"
                            </p>
                        )}

                        {feedback.match && (
                            <div className="text-xs text-gray-500 mb-4">
                            <span className="font-medium">Match:</span> #{feedback.match.matchId}
                            {feedback.match.donation?.itemName && ` • ${feedback.match.donation.itemName}`}
                            </div>
                        )}

                        {feedback.admin_response && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-700">Admin Response:</p>
                            <p className="text-xs text-gray-600 mt-1">{feedback.admin_response}</p>
                            </div>
                        )}

                        {feedback.status === 'pending' && (
                            <div className="flex space-x-2 mt-4">
                            <button
                                onClick={() => handleEditFeedback(feedback)}
                                className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                                <FaEdit className="mr-1" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteFeedback(feedback.feedbackId)}
                                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                            >
                                <FaTrash className="mr-1" />
                                Delete
                            </button>
                            </div>
                        )}
                        </div>
                    </div>
                    );
                })}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <FaComment className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">No Feedback Yet</h3>
                <p className="text-gray-600">You haven't submitted any feedback. Go to the "Give Feedback" tab to share your experience.</p>
                </div>
            )
            )}

            {/* Feedback Modal */}
            {showFeedbackModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                    {editMode ? 'Edit Feedback' : 'Share Your Experience'}
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    {selectedMatch && !editMode && (
                    <div className="bg-teal-50 p-4 rounded-lg">
                        <p className="text-sm text-teal-700">
                        <span className="font-medium">Match:</span> {selectedMatch.donation?.itemName || selectedMatch.request?.itemName} - 
                        Donor: {selectedMatch.donation?.donor?.user?.name || selectedMatch.interest?.donor?.user?.name} →
                        Receiver: {selectedMatch.request?.receiver?.user?.name}
                        </p>
                    </div>
                    )}

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({...formData, rating: star})}
                            className="focus:outline-none"
                        >
                            {star <= formData.rating ? (
                            <FaStar className="w-8 h-8 text-amber-400 hover:text-amber-500 transition-colors" />
                            ) : (
                            <FaRegStar className="w-8 h-8 text-gray-300 hover:text-amber-400 transition-colors" />
                            )}
                        </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">{formData.rating} out of 5</span>
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="donation_experience">Donation Experience</option>
                        <option value="request_experience">Request Experience</option>
                        <option value="matching_process">Matching Process</option>
                        <option value="communication">Communication</option>
                        <option value="platform_usability">Platform Usability</option>
                        <option value="other">Other</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Comments
                    </label>
                    <textarea
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={formData.comment}
                        onChange={(e) => setFormData({...formData, comment: e.target.value})}
                        placeholder="Share your experience, suggestions, or feedback..."
                    />
                    </div>

                    <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="anonymous"
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        checked={formData.is_anonymous}
                        onChange={(e) => setFormData({...formData, is_anonymous: e.target.checked})}
                    />
                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                        Submit anonymously (your name won't be displayed)
                    </label>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                    onClick={() => {
                        setShowFeedbackModal(false);
                        resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                    Cancel
                    </button>
                    <button
                    onClick={handleSubmitFeedback}
                    disabled={submitting}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                    {submitting ? <FaSpinner className="animate-spin mr-2" /> : <FaStar className="mr-2" />}
                    {editMode ? 'Update Feedback' : 'Submit Feedback'}
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    </DonorLayout>
  );
};

export default FeedbackPage;