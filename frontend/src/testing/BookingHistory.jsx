import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function BookingHistory () {
    const [bookings, setBookings]= React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8000/api/bookings/history', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setBookings(res.data.bookings || []);
            } catch (err) {
                console.error(err);
                alert('Failed to fetch booking history.');
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, [])

    if (loading) {
        return <div className="text-center mt-5">Loading booking history...</div>;
    }
     return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Booking History</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Reference Code</th>
              <th className="px-4 py-2 text-left">Student Name</th>
              <th className="px-4 py-2 text-left">Service Type</th>
              <th className="px-4 py-2 text-left">Consultation Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Concern</th>
            </tr >
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{booking.reference_code}</td>
                <td className="px-4 py-2">{booking.student_name}</td>
                <td className="px-4 py-2">{booking.service_type}</td>
                <td className="px-4 py-2">{booking.consultation_date}</td>
                <td className="px-4 py-2">{booking.status}</td>
                <td className="px-4 py-2">{booking.concern_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}   