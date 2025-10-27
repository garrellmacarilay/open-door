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
    <div className="max-w-md mx-auto mt-6 p-4 border rounded shadow">
      <h3 className="text-xl font-semibold mb-4">📌 Recent Bookings</h3>
      <ul className="space-y-3">
        {bookings.map((booking) => (
          <li key={booking.reference_code} className="p-3 border rounded hover:bg-gray-50 transition">
            <p><strong>Reference:</strong> {booking.reference_code}</p>
            <p><strong>Service:</strong> {booking.service_type}</p>
            <p><strong>Date:</strong> {new Date(booking.consultation_date).toLocaleString()}</p>        
          </li>
        ))}
      </ul>
    </div>
  );

}