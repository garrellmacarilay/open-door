export default function AppointmentRequests({ booking, loading, onApprove, onDecline }) {
    if (loading) return <p className="p-6">Loading</p>

    if (!booking) return <p className="p-6 text-gray-500">No pending appointment requests.</p>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Appointment Request</h2>

            <div className="bg-white shadow p-4 rounded-lg space-y-3">

                <div>
                    <p className="font-semibold text-gray-600">Student</p>
                    <p>{booking.student_name}</p>
                </div>

                <div>
                    <p className="font-semibold text-gray-600">Office</p>
                    <p>{booking.office}</p>
                </div>

                <div>
                    <p className="font-semibold text-gray-600">Type of Service</p>
                    <p>{booking.service_type}</p>
                </div>

                <div>
                    <p className="font-semibold text-gray-600">Date & Time</p>
                    <p>
                        {new Date(booking.consultation_date).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </p>
                </div>

                <div>
                    <p className="font-semibold text-gray-600">Attached File</p>
                    {booking.attached_files ? (
                        <a
                            href={booking.attached_files}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            Download File
                        </a>
                        ) : (
                            <p>No attachment</p>
                        )}
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        className="lex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={() => onApprove && onApprove(booking.id)}
                    >
                        Approve
                    </button>
                    
                    <button
                        className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => onDecline && onDecline(booking.id)}
                    >
                        Decline
                    </button>
                </div>
        </div>
    </div>
    )
}