import React, { useEffect, useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'react-feather';

const Notification = () => {
  const { notification, hideNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification.open) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(hideNotification, 300); // Wait for fade out animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.open, hideNotification]);

  if (!notification.open) return null;

  const getIcon = () => {
    const iconClass = 'w-6 h-6 flex-shrink-0';
    switch (notification.type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-yellow-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${getBgColor()} ${getTextColor()} max-w-md w-full flex items-start transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
      role="alert"
    >
      <div className="mr-3 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1">
        {typeof notification.message === 'string' ? (
          <p className="text-sm">{notification.message}</p>
        ) : (
          notification.message
        )}
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(hideNotification, 300);
        }}
        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
        aria-label="Close notification"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;
