export default function BookingTable({ bookings, loading }) {
   
    if (loading) {
        return <p className="text-gray-500 text-center py-4">Loading records</p>
    }

    if (!loading && bookings.length === 0) {
        return <p className="text-gray-500 text-center py-4">No bookings found</p>
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm">
                        <th className="p-2 border">Student</th>
                        <th className="p-2 border">Office</th>
                        <th className="p-2 border">Service</th>
                        <th className="p-2 border">Date & Time</th>
                        <th className="p-2 border">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id} className="text-sm hover:bg-gray-50">
                            <td className="p-2 border">{booking.student_name}</td>
                            <td className="p-2 border">{booking.office}</td>
                            <td className="p-2 border">{booking.service_type}</td>
                            <td className="p-2 border">
                                {new Date(booking.consultation_date).toLocaleString("en-US",{
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </td>
                            <td className="p-2 border">
                                <span 
                                    className="px-2 py-1 rounded text-white text-xs font-bold"
                                    style={{ backgroundColor: booking.color }}
                                >
                                    {booking.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}