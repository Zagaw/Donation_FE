import React, { useState } from 'react';
import ReceiverLayout from './ReceiverLayout';
import { 
  FaStar, 
  FaThumbsUp, 
  FaCommentDots, 
  FaPaperPlane, 
  FaSmile, 
  FaFrown,
  FaMeh,
  FaChartBar,
  FaQuoteRight
} from 'react-icons/fa';

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    rating: 0,
    category: 'general',
    title: '',
    message: '',
    allowContact: false
  });

  const [submittedFeedback, setSubmittedFeedback] = useState([
    {
      id: 1,
      date: '2024-01-15',
      rating: 5,
      category: 'donation',
      title: 'Excellent Support',
      message: 'The donation process was smooth and the donor was very helpful.',
      status: 'acknowledged'
    },
    {
      id: 2,
      date: '2024-01-10',
      rating: 4,
      category: 'platform',
      title: 'Easy to Use',
      message: 'The platform is user-friendly and makes it easy to find donations.',
      status: 'pending'
    },
    {
      id: 3,
      date: '2024-01-05',
      rating: 3,
      category: 'delivery',
      title: 'Delivery Timing',
      message: 'Delivery could be faster, but overall satisfied with the service.',
      status: 'resolved'
    }
  ]);

  const categories = [
    { value: 'general', label: 'General Feedback', color: 'gray' },
    { value: 'donation', label: 'Donation Process', color: 'teal' },
    { value: 'platform', label: 'Platform Experience', color: 'indigo' },
    { value: 'delivery', label: 'Delivery/Collection', color: 'emerald' },
    { value: 'communication', label: 'Communication', color: 'amber' },
    { value: 'suggestion', label: 'Suggestion', color: 'blue' },
  ];

  const handleRatingClick = (rating) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    const newFeedback = {
      id: submittedFeedback.length + 1,
      date: new Date().toISOString().split('T')[0],
      ...feedback
    };
    
    setSubmittedFeedback(prev => [newFeedback, ...prev]);
    alert('Thank you for your feedback!');
    
    // Reset form
    setFeedback({
      rating: 0,
      category: 'general',
      title: '',
      message: '',
      allowContact: false
    });
  };

  const getEmoji = (rating) => {
    if (rating >= 4) return { icon: FaSmile, color: 'text-emerald-600', label: 'Happy' };
    if (rating >= 3) return { icon: FaMeh, color: 'text-amber-600', label: 'Neutral' };
    return { icon: FaFrown, color: 'text-red-600', label: 'Unhappy' };
  };

  const stats = {
    averageRating: 4.0,
    totalFeedback: submittedFeedback.length,
    positiveFeedback: submittedFeedback.filter(f => f.rating >= 4).length,
    responseRate: '85%'
  };

  return (
    <ReceiverLayout activePage="feedback">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Feedback & Reviews</h1>
        <p className="text-gray-600">Share your experience and help us improve</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-800">{stats.averageRating}/5</p>
            </div>
            <FaStar className="text-teal-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Feedback</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalFeedback}</p>
            </div>
            <FaCommentDots className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Positive Feedback</p>
              <p className="text-3xl font-bold text-gray-800">{stats.positiveFeedback}</p>
            </div>
            <FaThumbsUp className="text-emerald-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Response Rate</p>
              <p className="text-3xl font-bold text-gray-800">{stats.responseRate}</p>
            </div>
            <FaChartBar className="text-amber-600 text-2xl" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Feedback Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaCommentDots className="text-teal-600 mr-2" />
            Share Your Feedback
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-800 mb-4">
                How would you rate your overall experience? *
              </label>
              <div className="flex space-x-4 mb-4">
                {[1, 2, 3, 4, 5].map((star) => {
                  const Emoji = getEmoji(star).icon;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className={`flex flex-col items-center p-4 rounded-xl transition-all transform hover:-translate-y-1 ${
                        feedback.rating === star
                          ? 'bg-teal-50 border-2 border-teal-500'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <Emoji className={`text-3xl mb-2 ${getEmoji(star).color}`} />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-lg ${
                              i < star ? 'text-amber-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm mt-1">{getEmoji(star).label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={feedback.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={feedback.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Brief summary of your feedback"
                required
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Feedback *
              </label>
              <textarea
                name="message"
                value={feedback.message}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Please share your detailed experience, suggestions, or concerns..."
                required
              />
            </div>

            {/* Checkbox */}
            <div className="mb-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="allowContact"
                  checked={feedback.allowContact}
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">
                  Allow us to contact you for follow-up questions
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-lg font-medium text-lg transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
            >
              <FaPaperPlane className="mr-2" />
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Submitted Feedback & Guidelines */}
        <div className="space-y-8">
          {/* Submitted Feedback */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaQuoteRight className="text-indigo-600 mr-2" />
              Your Previous Feedback
            </h2>
            <div className="space-y-4">
              {submittedFeedback.map((item) => (
                <div key={item.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'acknowledged' ? 'bg-teal-100 text-teal-700' :
                      item.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex mr-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-sm ${
                            i < item.rating ? 'text-amber-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {categories.find(c => c.value === item.category)?.label}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Guidelines */}
          <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl p-6 border border-teal-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Feedback Guidelines</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <FaStar className="text-teal-600 mt-1 mr-2 flex-shrink-0" />
                <span>Be specific about your experience</span>
              </li>
              <li className="flex items-start">
                <FaStar className="text-teal-600 mt-1 mr-2 flex-shrink-0" />
                <span>Provide constructive suggestions</span>
              </li>
              <li className="flex items-start">
                <FaStar className="text-teal-600 mt-1 mr-2 flex-shrink-0" />
                <span>Mention specific donors or items if relevant</span>
              </li>
              <li className="flex items-start">
                <FaStar className="text-teal-600 mt-1 mr-2 flex-shrink-0" />
                <span>Share both positive experiences and areas for improvement</span>
              </li>
              <li className="flex items-start">
                <FaStar className="text-teal-600 mt-1 mr-2 flex-shrink-0" />
                <span>All feedback is anonymous unless you allow contact</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ReceiverLayout>
  );
};

export default Feedback;