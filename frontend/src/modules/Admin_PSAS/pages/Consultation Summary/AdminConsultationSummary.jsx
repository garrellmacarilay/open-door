import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import { useAdminBookings } from '../../../../hooks/adminHooks';

function AdminConsultationSummary() {
  const location = useLocation(); 
  
  const [selectedConsultation, setSelectedConsultation] = useState();
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Use existing hooks
  const { bookings, search, setSearch, status, setStatus, handleSearchChange, fetchBookings, loading } = useAdminBookings();

  // 3. DEEP LINKING EFFECT
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookingIdFromUrl = params.get('bookingId');

    if (bookingIdFromUrl && bookings.length > 0) {
      const targetBooking = bookings.find(b => b.id.toString() === bookingIdFromUrl);
      
      if (targetBooking) {
        handleViewDetails(targetBooking);
      }
    }
  }, [location.search, bookings]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-blue-100! text-blue-800';
      case 'declined': return 'bg-red-100! text-red-800';
      case 'cancelled': return 'bg-red-100! text-red-800';
      case 'approved': return 'bg-green-100! text-green-800';
      case 'pending': return 'bg-yellow-100! text-yellow-800';
      case 'rescheduled': return 'bg-purple-100! text-purple-800';
      default: return 'bg-gray-100! text-gray-800';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} width="16" height="15" viewBox="0 0 24 22" fill="none" className="w-4 h-3">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={star <= rating ? "#FFAA00" : "#E5E5E5"} stroke={star <= rating ? "#FFAA00" : "#E5E5E5"} strokeWidth="1" />
          </svg>
        ))}
      </div>
    );
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedConsultation(null);
  };

  return (
    <div className="flex-1 h-screen overflow-hidden bg-[#E9E9E9]" style={{ fontFamily: 'Inter' }}>
      <div className="h-full p-4 md:p-8 overflow-y-auto">
        <div className="bg-white rounded-[20px] p-4 md:p-8 w-full max-w-full mx-auto shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] min-h-fit overflow-hidden">
  
        {/* Controls */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {/* Search */}
            <div className="sm:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21L16.514 16.506L21 21ZM18 10.5C18 15.194 14.194 19 9.5 19C4.806 19 1 15.194 1 10.5C1 5.806 4.806 2 9.5 2C14.194 2 18 5.806 18 10.5Z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search consultations..." 
                value={search} 
                onChange={handleSearchChange} 
                className="pl-10 pr-4 py-2 border text-gray-900! border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" 
              />
              
              {/* ✅ UPDATED CLEAR BUTTON LOGIC */}
              {search && (
                <button 
                  onClick={() => { 
                    setSearch('');             // Clear input state
                    fetchBookings('', status); // Force reload with empty query
                  }} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter */}
            <div className="sm:col-span-1">
              <select value={status} onChange={(e) => { setStatus(e.target.value); fetchBookings(search, e.target.value); }} className="pl-3 pr-8 py-2 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" style={{ fontFamily: 'Inter' }}>
                <option value="All">All Status</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#142240] rounded-3xl">
                <th className="text-left p-4 font-semibold text-white border-b" style={{ fontFamily: 'Inter' }}>Student</th>
                <th className="text-left p-4 font-semibold text-white border-b" style={{ fontFamily: 'Inter' }}>Office</th>
                <th className="text-left p-4 font-semibold text-white border-b" style={{ fontFamily: 'Inter' }}>Date & Time</th>
                <th className="text-left p-4 font-semibold text-white border-b" style={{ fontFamily: 'Inter' }}>Status</th>
                <th className="text-left p-4 font-semibold text-white border-b" style={{ fontFamily: 'Inter' }}>Rating</th>
                <th className="text-left p-4 font-semibold text-white border-b" style={{ fontFamily: 'Inter' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b">
                    <div>
                      <div className="font-medium text-gray-800" style={{ fontFamily: 'Inter' }}>{consultation.student_name}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>{consultation.reference_code}</div>
                    </div>
                  </td>
                  <td className="p-4 border-b text-gray-800" style={{ fontFamily: 'Inter' }}>{consultation.office}</td>
                  <td className="p-4 border-b">
                    <div className="text-gray-800" style={{ fontFamily: 'Inter' }}>{new Date(consultation.consultation_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                    <div className="text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>{new Date(consultation.consultation_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</div>
                  </td>
                  
                  {/* Status Badge */}
                  <td className="p-4 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColor(consultation.status)}`} style={{ fontFamily: 'Inter' }}>
                      {consultation.status || 'Pending'}
                    </span>
                  </td>

                  <td className="p-4 border-b">
                    {consultation.feedback?.rating ? renderStars(consultation.feedback.rating) : <span className="text-gray-400 text-xs" style={{ fontFamily: 'Inter' }}>No rating</span>}
                  </td>
                  <td className="p-4 border-b">
                    <button onClick={() => handleViewDetails(consultation)} className="px-3 py-1 bg-[#142240]! text-white rounded-md text-sm hover:bg-blue-700 transition-colors" style={{ fontFamily: 'Inter' }}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && !loading && (
             <div className="text-center py-10 text-gray-500" style={{ fontFamily: 'Inter' }}>No consultations found.</div>
          )}
        </div>
      </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedConsultation && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#122141] px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Inter' }}>Consultation Details</h3>
              <button onClick={handleCloseModal} className="text-white hover:text-gray-300 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter' }}>Student Name</label><p className="text-gray-800" style={{ fontFamily: 'Inter' }}>{selectedConsultation.student_name}</p></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter' }}>Student ID</label><p className="text-gray-800" style={{ fontFamily: 'Inter' }}>{selectedConsultation.reference_code}</p></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter' }}>Topic</label><p className="text-gray-800" style={{ fontFamily: 'Inter' }}>{selectedConsultation.service_type}</p></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter' }}>Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedConsultation.status)}`} style={{ fontFamily: 'Inter' }}>{selectedConsultation.status}</span>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter' }}>Date</label><p className="text-gray-800" style={{ fontFamily: 'Inter' }}>{new Date(selectedConsultation.consultation_date).toDateString()}</p></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter' }}>Time</label><p className="text-gray-800" style={{ fontFamily: 'Inter' }}>{new Date(selectedConsultation.consultation_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter' }}>Notes</label><p className="text-gray-800 bg-gray-50 p-3 rounded-lg" style={{ fontFamily: 'Inter' }}>{selectedConsultation.notes}</p></div>
              {selectedConsultation.feedback && (
                <>
                  {selectedConsultation.feedback.rating && <div><label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter' }}>Rating</label>{renderStars(selectedConsultation.feedback.rating)}</div>}
                  {selectedConsultation.feedback.comment && <div><label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter' }}>Student Feedback</label><p className="text-gray-800 bg-gray-50 p-3 rounded-lg" style={{ fontFamily: 'Inter' }}>{selectedConsultation.feedback.comment}</p></div>}
                </>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors" style={{ fontFamily: 'Inter' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminConsultationSummary;