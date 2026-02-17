// src/components/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheckCircle, FaHeart, FaHandshake, FaBox, FaUser } from 'react-icons/fa';
import { notificationApi } from '../api/notificationApi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getNotifications(1, 5); // Get latest 5
      setNotifications(response.data.notifications.data || []);
      setUnreadCount(response.data.notifications.data?.filter(n => !n.read_at).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    if (!showDropdown) {
      fetchNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  const handleMarkAsRead = async (id, event) => {
    event.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async (event) => {
    event.stopPropagation();
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read first
    if (!notification.read_at) {
      handleMarkAsRead(notification.id, { stopPropagation: () => {} });
    }
    
    // Navigate based on notification type and user role
    if (notification.data.action_url) {
      navigate(notification.data.action_url);
    }
    
    setShowDropdown(false);
  };

  const getNotificationIcon = (data) => {
    switch(data.type) {
      case 'match_created':
        return <FaHeart className="text-red-500 text-lg" />;
      case 'donation_approved':
        return <FaCheckCircle className="text-green-500 text-lg" />;
      case 'request_approved':
        return <FaCheckCircle className="text-blue-500 text-lg" />;
      case 'interest_approved':
        return <FaHandshake className="text-purple-500 text-lg" />;
      default:
        return <FaBell className="text-gray-500 text-lg" />;
    }
  };

  const getNotificationTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="font-bold text-gray-800 flex items-center">
              <FaBell className="mr-2 text-teal-600" />
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read_at ? 'bg-teal-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {getNotificationIcon(notification.data)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read_at ? 'font-semibold' : 'font-medium'} text-gray-800`}>
                        {notification.data.title || 'New Notification'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.data.message || ''}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">
                          {getNotificationTime(notification.created_at)}
                        </span>
                        {!notification.read_at && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                    {!notification.read_at && (
                      <div className="flex-shrink-0 ml-2">
                        <span className="inline-block w-2 h-2 bg-teal-600 rounded-full"></span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-300 text-4xl mb-3">🔔</div>
                <p className="text-gray-500">No notifications</p>
                <p className="text-xs text-gray-400 mt-2">You're all caught up!</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 border-t border-gray-200 text-center bg-gray-50 rounded-b-lg">
            <button
              onClick={() => {
                navigate('/notifications');
                setShowDropdown(false);
              }}
              className="text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;