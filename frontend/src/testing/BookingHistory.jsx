import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import FeedbackModal from '../components/FeedbackModal.jsx';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/history');
      setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAddFeedback = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleFeedbackSubmit = (updatedFeedback) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id ? { ...b, feedback: updatedFeedback } : b
      )
    );
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  if (loading) return <div className="text-center mt-5">Loading booking history...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Booking History</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p><strong>Student:</strong> {booking.student_name}</p>
                  <p><strong>Office:</strong> {booking.office_name}</p>
                  <p><strong>Service:</strong> {booking.service_type}</p>
                  <p><strong>Date:</strong> {booking.consultation_date}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                </div>

                {booking.status === 'completed' && !booking.feedback && (
                  <button
                    onClick={() => handleAddFeedback(booking)}
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Add Feedback
                  </button>
                )}
              </div>

              {booking.feedback && (
                <div className="mt-3 border-t pt-2">
                  <p className="text-yellow-600 text-lg font-semibold">
                    ⭐ {booking.feedback.rating} / 5
                  </p>
                  <p><strong>Feedback:</strong> {booking.feedback.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <FeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
          onSubmitted={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}
