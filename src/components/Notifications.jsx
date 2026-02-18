// src/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationApi } from '../api/notificationApi';
import { 
  FaBell, 
  FaHeart, 
  FaCheckCircle, 
  FaHandshake,
  FaTrash,
  FaCheckDouble,
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 20
  });

  useEffect(() => {
    fetchNotifications();
  }, [pagination.current_page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationApi.getNotifications(pagination.current_page, pagination.per_page);
      setNotifications(response.data.notifications.data);
      setPagination({
        current_page: response.data.notifications.current_page,
        last_page: response.data.notifications.last_page,
        total: response.data.notifications.total,
        per_page: response.data.notifications.per_page
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete all notifications?')) return;
    
    try {
      await notificationApi.clearAll();
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (!notification.read_at) {
      handleMarkAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.data.type === 'match_created') {
      navigate(`/matches/${notification.data.match_id}`);
    } else if (notification.data.action_url) {
      navigate(notification.data.action_url);
    }
  };

  const getNotificationIcon = (data) => {
    const iconClass = "text-2xl";
    switch(data.type) {
      case 'match_created':
        return <FaHeart className={`${iconClass} text-red-500`} />;
      case 'donation_approved':
        return <FaCheckCircle className={`${iconClass} text-green-500`} />;
      case 'request_approved':
        return <FaCheckCircle className={`${iconClass} text-blue-500`} />;
      case 'interest_approved':
        return <FaHandshake className={`${iconClass} text-purple-500`} />;
      default:
        return <FaBell className={`${iconClass} text-gray-500`} />;
    }
  };

  const getNotificationPreview = (data) => {
    if (data.type === 'match_created') {
      if (data.donor_name) {
        return `Matched with donor: ${data.donor_name}`;
      } else if (data.receiver_name) {
        return `Matched with receiver: ${data.receiver_name}`;
      }
    }
    return data.message || '';
  };

  const getNotificationTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-teal-600 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
              <p className="text-gray-600 mt-2">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <FaCheckDouble className="mr-2" />
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="mr-2" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
            <button 
              onClick={fetchNotifications}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Notifications List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read_at ? 'bg-teal-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0 mr-4">
                      {getNotificationIcon(notification.data)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-lg ${!notification.read_at ? 'font-bold' : 'font-medium'} text-gray-800`}>
                          {notification.data.title || 'New Notification'}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {getNotificationTime(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{getNotificationPreview(notification.data)}</p>
                      
                      {/* Details based on notification type */}
                      {notification.data.type === 'match_created' && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Match Details:</p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Item:</span> {notification.data.item_name}
                          </p>
                          {notification.data.donor_name && (
                            <p className="text-sm text-gray-600 mt-1 flex items-center">
                              <FaUser className="mr-2 text-gray-400" />
                              <span className="font-medium">Donor:</span> {notification.data.donor_name}
                            </p>
                          )}
                          {notification.data.receiver_name && (
                            <p className="text-sm text-gray-600 mt-1 flex items-center">
                              <FaUser className="mr-2 text-gray-400" />
                              <span className="font-medium">Receiver:</span> {notification.data.receiver_name}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Match Type:</span>{' '}
                            {notification.data.match_type === 'interest' ? 'Interest-Based' : 'Manual'}
                          </p>
                          <p className="text-sm text-teal-600 mt-2">
                            👆 Click to view full contact details
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex justify-end space-x-3">
                        {!notification.read_at && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {!notification.read_at && (
                      <div className="flex-shrink-0 ml-4">
                        <span className="inline-block w-3 h-3 bg-teal-600 rounded-full"></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-300 text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Notifications</h3>
            <p className="text-gray-600">You don't have any notifications yet.</p>
            <p className="text-gray-500 text-sm mt-2">When you get notifications, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;