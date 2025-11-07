import React, { useState, useEffect } from 'react';
import api from '../utils/api'

export default function RecentBooking() {
    const [bookings, setBookings] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchRecentBooking = async () => {
            try {
                const res = await api.get('/bookings/recent');
                if (res.data.success) {
                    setBookings(res.data.bookings)
                }
            }catch (err) {
                console.error('Error fetching recent booking', err)
            } finally {
                setLoading(false);
            }
        }

        fetchRecentBooking()
    }, []);

    if (loading) return <p>Loading recent bookings....</p>;
    if (bookings.length === 0 ) return <p>No recent booking found</p>

    return (
    <div className="w-full p-4 border rounded shadow bg-white">
      <h3 className="text-xl font-semibold mb-4">📌 Recent Bookings</h3>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Student</th>
              <th className="border p-2 text-left">Office</th>
              <th className="border p-2 text-left">Service</th>
              <th className="border p-2 text-left">Appointment Date</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.reference_code} className="hover:bg-gray-50 transition">
                  <td className="border p-2">{booking.student_name || "N/A"}</td>
                  <td className="border p-2">{booking.office}</td>
                  <td className="border p-2">{booking.service_type}</td>
                  <td className="border p-2">
                    {new Date(booking.consultation_date).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                      onClick={() => onReschedule && onReschedule(booking.id)}
                    >
                      Reschedule
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => onCancel && onCancel(booking.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-3 text-center text-gray-500" colSpan="5">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );

}