import React, { useEffect, useState } from 'react';
import api from '../utils/api'; // your axios instance
import { useNavigate } from 'react-router-dom';

export default function NotificationModal({ onSelectBooking }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [open, setOpen] = useState(false); // modal toggle

  // ✅ Fetch notifications when modal opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark notification as read
  const markAsRead = async (id) => {
    try {
      await api.get(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    await markAsRead(notif.id)

    if (notif.booking_id) {
      onSelectBooking(notif.booking_id)
    }

    setOpen(false)
  }

  return (
    <div className="relative">
      {/* 🔔 Notification Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <span role="img" aria-label="bell" className="text-2xl">
          🔔
        </span>

        {/* 🟠 Unread indicator */}
        {notifications.some((n) => !n.read_at) && (
          <span className="absolute top-1 right-1 bg-red-500 w-3 h-3 rounded-full"></span>
        )}
      </button>

      {/* 📬 Notification Modal */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✖
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-gray-500 text-center">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">
                No notifications found.
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 border-b cursor-pointer transition ${
                    notif.read_at
                      ? 'bg-white hover:bg-gray-50'
                      : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  {notif.booking_reference && (
                    <p className="text-xs text-gray-500">
                      Ref: {notif.booking_reference}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {notif.created_at}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
