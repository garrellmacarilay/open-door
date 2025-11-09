import React, { useState, useEffect } from 'react';
import NotificationIcon from "../../components/img/notification.png";

function Notification() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Sample notification data
  const notifications = [
    {
      id: 1,
      title: 'New Consultation Schedule',
      time: '2 hours ago',
      icon: 'clock'
    },
    {
      id: 2,
      title: 'Booking Confirmed',
      time: '3 hours ago',
      icon: 'clock'
    },
    {
      id: 3,
      title: 'Reminder: Upcoming Meeting',
      time: '5 hours ago',
      icon: 'clock'
    },
    {
      id: 4,
      title: 'Schedule Updated',
      time: '1 day ago',
      icon: 'clock'
    },
    {
      id: 5,
      title: 'New Message',
      time: '2 days ago',
      icon: 'clock'
    },
    {
      id: 6,
      title: 'System Maintenance',
      time: '3 days ago',
      icon: 'clock'
    }
  ];

  const handleNotificationClick = () => {
    setShowNotificationModal(!showNotificationModal);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-modal') && !event.target.closest('.notification-button')) {
        setShowNotificationModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative"> 
      <button 
        onClick={handleNotificationClick}
        className="bg-white! hover:border-white! relative w-15 h-15 flex items-center rounded-full! justify-center hover:bg-gray-100! p-3! ml-5!"
      >
        {/* Notification Icon */}
        <img 
          src={NotificationIcon} 
          alt="Notifications" 
          className="w-15 h-15 object-contain "
        />

        {/* Notification Badge */}
        <div className="absolute top-3 right-3 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold" style={{ fontFamily: 'Poppins' }}>3</span>
        </div>
      </button>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="notification-modal absolute top-12 right-0 w-[311px] bg-white! rounded-lg shadow-2xl border z-50">
          {/* Modal Header */}
          <div className="bg-[#142240] rounded-t-lg p-4">
            <h3 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>Notifications</h3>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification, index) => (
              <div key={notification.id} className="border-b border-gray-200 p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                {/* Icon */}
                <div className="w-6 h-6 bg-[#054A9E] rounded-full flex items-center justify-center mt-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="5.25" stroke="white" strokeWidth="1.5"/>
                    <path d="M6 3V6L8.5 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-black text-sm font-bold mb-1" style={{ fontFamily: 'Inter' }}>
                    {notification.title}
                  </p>
                  <p className="text-black text-xs" style={{ fontFamily: 'Inter' }}>
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;