import React, { useState, useEffect } from 'react';
import NotificationIcon from "../../components/img/notification.png";

function Notification() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  // Sample notification data
  const notifications = [
    {
      id: 1,
      office: 'Student Organization',
      starttime: '11:00 AM',
      endtime: '12:00 PM',
      notiftime: '2 hours ago',
      status: 'Approved',
      icon: 'clock'
    },
    {
      id: 2,
      office: 'Studen Discipline',
      starttime: '1:00 PM',
      endtime: '2:00 PM',
      notiftime: '3 hours ago',
      status: 'Approved',
      icon: 'clock'
    },
    {
      id: 3,
      office: 'Student Publication',
      starttime: '2:30 PM',
      endtime: '3:30 PM',
      notiftime: '5 hours ago',
      status: 'Declined',
      icon: 'clock'
    },
    {
      id: 4,
      office: 'Student Internship',
      starttime: '9:00 AM',
      endtime: '10:00 AM',
      notiftime: '1 day ago',
      status: 'Declined',
      icon: 'clock'
    },
    {
      id: 5,
      office: 'Sports Development and Management',
      starttime: '3:00 PM',
      endtime: '4:00 PM',
      notiftime: '2 days ago',
      status: 'Approved',
      icon: 'clock'
    },
    {
      id: 6,
      office: 'Student IT Support and Services',
      starttime: '10:00 AM',
      endtime: '11:00 AM',
      notiftime: '3 days ago',
      status: 'Approved',
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
                    {notification.office}
                  </p>
                  <p className="text-black text-xs mb-1" style={{ fontFamily: 'Inter' }}>
                    {notification.starttime} - {notification.endtime}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-xs" style={{ fontFamily: 'Inter' }}>
                      {notification.notiftime}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      notification.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      notification.status === 'Declined' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`} style={{ fontFamily: 'Inter' }}>
                      {notification.status}
                    </span>
                  </div>
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