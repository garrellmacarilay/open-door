import React, { useState, useEffect, useRef } from 'react';
import NotificationIcon from "../../components/img/notification.png";
import {useNotifications} from '../../../../hooks/globalHooks' // 1. Import the hook

function Notification() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const dropdownRef = useRef(null);

  // 2. Use the hook (replaces local notifications state)
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    fetchNotifications 
  } = useNotifications(); // Auto-polls every 30s by default

  const handleNotificationClick = () => {
    setShowNotificationModal(!showNotificationModal);
    // Optional: Refresh data when opening to ensure it's latest
    if (!showNotificationModal) {
      fetchNotifications();
    }
  };

  // 3. Handle clicking a notification item
  const handleItemClick = (id, readAt) => {
    // Only mark as read if it hasn't been read yet
    if (!readAt) {
      markAsRead(id);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotificationModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}> 
      <button 
        onClick={handleNotificationClick}
        className="bg-white! hover:border-white! relative w-15 h-15 flex items-center rounded-full! justify-center hover:bg-gray-100! p-3! ml-5!"
      >
        {/* Notification Icon */}
        <img 
          src={NotificationIcon} 
          alt="Notifications" 
          className="w-15 h-15 object-contain"
        />

        {/* 4. Real Unread Badge */}
        {unreadCount > 0 && (
          <div className="absolute top-3 right-3 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-[10px] text-white font-bold" style={{ fontFamily: 'Poppins' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="notification-modal absolute top-12 right-0 w-[311px] bg-white! rounded-lg shadow-2xl border z-50 overflow-hidden">
          {/* Modal Header */}
          <div className="bg-[#142240] rounded-t-lg p-4 flex justify-between items-center">
            <h3 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>Notifications</h3>
            {unreadCount > 0 && (
                <span className="text-xs text-blue-200">{unreadCount} new</span>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
               <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
               <div className="p-8 text-center text-gray-500 text-sm">No new notifications</div>
            ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    onClick={() => handleItemClick(notification.id, notification.read_at)}
                    className={`
                      border-b border-gray-200 p-4 flex items-start gap-3 transition-colors cursor-pointer
                      ${!notification.read_at ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'}
                    `}
                  >
                    {/* Icon based on read status or type */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 shrink-0 ${!notification.read_at ? 'bg-[#054A9E]' : 'bg-gray-400'}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="6" cy="6" r="5.25" stroke="white" strokeWidth="1.5"/>
                        <path d="M6 3V6L8.5 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* 5. Display real message from backend */}
                      <p className={`text-sm mb-1 ${!notification.read_at ? 'text-black font-bold' : 'text-gray-600 font-medium'}`} style={{ fontFamily: 'Inter' }}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-400 text-[10px]" style={{ fontFamily: 'Inter' }}>
                          {notification.created_at} {/* e.g. "2 hours ago" */}
                        </p>
                        
                        {/* Status Badge (if your backend message doesn't cover it, or derived from type) */}
                        {notification.type === 'booking_approved' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Approved</span>
                        )}
                        {notification.type === 'booking_declined' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">Declined</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Unread Dot Indicator */}
                    {!notification.read_at && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;