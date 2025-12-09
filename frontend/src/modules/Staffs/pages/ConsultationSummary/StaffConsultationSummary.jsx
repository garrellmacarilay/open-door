import React, { useState, useEffect } from 'react';
import { useConsultationSummary } from '../../../../hooks/staffHooks';

function StaffConsultationSummary() {
  const { consultations = [], fetchSummary, loading, error } = useConsultationSummary();
  
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // State Variables
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState(''); 

  // Connect Search (Only fetches when search query changes)
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchSummary(searchQuery);
    }, 500);
    return () => clearTimeout(timer); 
  }, [searchQuery, fetchSummary]);

  // Client-side Status Filtering
  const filteredConsultations = (consultations || []).filter(consultation => {
    if (filterStatus === 'All') return true;
    return consultation.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  // Helper functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'no show': return 'bg-red-100 text-red-800';
      case 'cancelled':
      case 'declined': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400 text-xs">No rating</span>;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} width="16" height="15" viewBox="0 0 24 22" fill="none" className="w-4 h-3">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={star <= rating ? "#FFAA00" : "#E5E5E5"}
              stroke={star <= rating ? "#FFAA00" : "#E5E5E5"}
              strokeWidth="1"
            />
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
    <div className="flex-1 h-screen overflow-hidden bg-[#E9E9E9] font-inter">
      <div className="h-full p-4 md:p-8 overflow-y-auto">
        <div className="bg-white rounded-[20px] p-4 md:p-8 w-full max-w-full mx-auto shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] min-h-fit overflow-hidden">
  
          {/* Controls Section */}
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {/* Search Input */}
              <div className="sm:col-span-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21L16.514 16.506L21 21ZM18 10.5C18 15.194 14.194 19 9.5 19C4.806 19 1 15.194 1 10.5C1 5.806 4.806 2 9.5 2C14.194 2 18 5.806 18 10.5Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search student name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
              
              {/* Status Filter */}
              <div className="sm:col-span-1">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-3 pr-8 py-2 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                  <option value="All">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Declined">Declined</option>
                  <option value="No Show">No Show</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
             <div className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <>
              {(searchQuery || filterStatus !== 'All') && (
                <div className="mb-4 text-sm text-gray-600">
                  Showing {filteredConsultations.length} results
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#142240] rounded-3xl">
                      <th className="text-left p-4 font-semibold text-white border-b">Student</th>
                      <th className="text-left p-4 font-semibold text-white border-b">Office</th>
                      <th className="text-left p-4 font-semibold text-white border-b">Date & Time</th>
                      <th className="text-left p-4 font-semibold text-white border-b">Status</th>
                      <th className="text-left p-4 font-semibold text-white border-b">Rating</th>
                      <th className="text-left p-4 font-semibold text-white border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultations.map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 border-b">
                          <div>
                            <div className="font-medium text-gray-800">
                                {consultation.student_name || consultation.studentName || 'Unknown Student'}
                            </div>
                            <div className="text-sm text-gray-500">
                                {consultation.reference_code || consultation.studentId || '#'}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 border-b">
                          <div className="text-gray-800">{consultation.office}</div>
                        </td>
                        <td className="p-4 border-b">
                          <div>
                            <div className="text-gray-800">   
                              {new Date(consultation.consultation_date).toLocaleDateString("en-US", {
                                month: "long", day: "numeric", year: "numeric"
                              })}
                            </div>
                            <div className="text-sm text-gray-500">   
                              {new Date(consultation.consultation_date).toLocaleTimeString("en-US", {
                                hour: "numeric", minute: "numeric", hour12: true
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 border-b">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColor(consultation.status)}`}>
                            {consultation.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 border-b">
                            {consultation.feedback?.rating 
                                ? renderStars(consultation.feedback.rating) 
                                : renderStars(null)
                            }
                        </td>
                        <td className="p-4 border-b">
                          <button
                            onClick={() => handleViewDetails(consultation)}
                            className="px-3 py-1 bg-[#142240] text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredConsultations.length === 0 && (
                  <div className="text-center py-12">
                      <p className="text-gray-500">No consultations found.</p>
                  </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedConsultation && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
               <div className="bg-[#142240] px-6 py-4 border-b flex justify-between items-center">
                   <h3 className="text-lg font-semibold text-white">Consultation Details</h3>
                   <button onClick={handleCloseModal} className="text-white hover:text-gray-300 text-xl">×</button>
               </div>
               <div className="p-6 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                       <div>
                           <label className="text-sm font-bold text-gray-500">Student</label>
                           <p className="text-gray-900">{selectedConsultation.student_name || selectedConsultation.studentName}</p>
                       </div>
                       <div>
                           <label className="text-sm font-bold text-gray-500">Service Type</label>
                           <p className="text-gray-900">{selectedConsultation.service_type || selectedConsultation.topic}</p>
                       </div>
                       <div>
                           <label className="text-sm font-bold text-gray-500">Date</label>
                           <p className="text-gray-900">{new Date(selectedConsultation.consultation_date).toDateString()}</p>
                       </div>
                       <div>
                           <label className="text-sm font-bold text-gray-500">Status</label>
                           <div>
                               <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(selectedConsultation.status)}`}>
                                   {selectedConsultation.status}
                               </span>
                           </div>
                       </div>
                   </div>
                   
                   <div>
                        <label className="text-sm font-bold text-gray-500">Notes/Topic</label>
                        <div className="bg-gray-50 p-3 rounded mt-1 text-gray-800">
                            {selectedConsultation.notes || selectedConsultation.topic || 'No notes available'}
                        </div>
                   </div>

                   {/* Safe check for feedback */}
                   {selectedConsultation.feedback && (
                       <div>
                            <label className="text-sm font-bold text-gray-500">Feedback</label>
                            <div className="bg-blue-50 p-3 rounded mt-1 text-gray-800">
                                {selectedConsultation.feedback.comment || selectedConsultation.feedback}
                            </div>
                       </div>
                   )}
               </div>
               <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                    <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded text-gray-800 hover:bg-gray-300">Close</button>
               </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default StaffConsultationSummary;