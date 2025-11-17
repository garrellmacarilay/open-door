import React, { useState } from 'react';

function AdminConsultationSummary() {
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      studentId: '2021-001',
      office: 'Guidance and Counseling',
      topic: 'Academic Advising',
      date: '2025-11-10',
      time: '10:00 AM',
      status: 'Completed',
      notes: 'Student discussed course selection for next semester. Provided guidance on career paths.',
      rating: 5,
      feedback: 'Very helpful session. Clear guidance provided.'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      studentId: '2021-002',
      office: 'Guidance and Counseling',
      topic: 'Career Planning',
      date: '2025-11-09',
      time: '11:00 AM',
      status: 'Completed',
      notes: 'Discussed career opportunities in the students field of study. Provided resources for job hunting.',
      rating: 4,
      feedback: 'Good session with practical advice.'
    },
    {
      id: 3,
      studentName: 'Mike Johnson',
      studentId: '2021-003',
      office: 'Guidance and Counseling',
      topic: 'Personal Counseling',
      date: '2025-11-08',
      time: '2:00 PM',
      status: 'Completed',
      notes: 'Student shared personal challenges affecting academic performance. Developed coping strategies.',
      rating: 5,
      feedback: 'Excellent support and understanding.'
    },
    {
      id: 4,
      studentName: 'Sarah Wilson',
      studentId: '2021-004',
      office: 'Guidance and Counseling',
      topic: 'Academic Support',
      date: '2025-11-07',
      time: '3:00 PM',
      status: 'No Show',
      notes: 'Student did not attend scheduled consultation.',
      rating: null,
      feedback: null
    }
  ]);

  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100! text-green-800';
      case 'No Show':
        return 'bg-red-100! text-red-800';
      case 'Cancelled':
        return 'bg-yellow-100! text-yellow-800';
      default:
        return 'bg-gray-100! text-gray-800';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="16"
            height="15"
            viewBox="0 0 24 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-3"
          >
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

  const filteredConsultations = consultations.filter(consultation => {
    // Apply status filter
    const statusMatch = filterStatus === 'All' || consultation.status === filterStatus;
    
    // Apply search filter
    const searchMatch = searchQuery === '' || 
      consultation.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.office.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.date.includes(searchQuery) ||
      consultation.time.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (consultation.notes && consultation.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (consultation.feedback && consultation.feedback.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

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
        {/* Main Container with Shadow */}
        <div className="bg-white rounded-[20px] p-4 md:p-8 w-full max-w-full mx-auto shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] min-h-fit overflow-hidden">
  
        {/* Header with Search and Filters */}
        <div className="mb-6">
          {/* Search and Filter Controls - Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {/* Search Input - Takes 2/3 (2 columns) */}
            <div className="sm:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="h-4 w-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 21L16.514 16.506L21 21ZM18 10.5C18 15.194 14.194 19 9.5 19C4.806 19 1 15.194 1 10.5C1 5.806 4.806 2 9.5 2C14.194 2 18 5.806 18 10.5Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search consultations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border text-gray-900! border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg 
                    className="h-4 w-4 text-gray-400 hover:text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Status Filter - Takes 1/3 (1 column) */}
            <div className="sm:col-span-1">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-3 pr-8 py-2 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="No Show">No Show</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {(searchQuery || filterStatus !== 'All') && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredConsultations.length} of {consultations.length} consultations
            {searchQuery && <span> for "{searchQuery}"</span>}
            {filterStatus !== 'All' && <span> with status "{filterStatus}"</span>}
          </div>
        )}

        {/* Consultations Table */}
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
                      <div className="font-medium text-gray-800">{consultation.studentName}</div>
                      <div className="text-sm text-gray-500">{consultation.studentId}</div>
                    </div>
                  </td>
                  <td className="p-4 border-b">
                    <div className="text-gray-800">{consultation.office}</div>
                  </td>
                  <td className="p-4 border-b">
                    <div>
                      <div className="text-gray-800">{consultation.date}</div>
                      <div className="text-sm text-gray-500">{consultation.time}</div>
                    </div>
                  </td>
                  <td className="p-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                      {consultation.status}
                    </span>
                  </td>
                  <td className="p-4 border-b">
                    {renderStars(consultation.rating)}
                  </td>
                  <td className="p-4 border-b">
                    <button
                      onClick={() => handleViewDetails(consultation)}
                      className="px-3 py-1 bg-[#142240]! text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConsultations.length === 0 && (
          <div className="text-center py-12">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1" 
                d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">No consultations found</p>
            <p className="text-gray-400 text-sm">
              {searchQuery || filterStatus !== 'All' 
                ? 'Try adjusting your search or filter criteria' 
                : 'No consultations available'}
            </p>
            {(searchQuery || filterStatus !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('All');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedConsultation && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Consultation Details</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <p className="text-gray-800">{selectedConsultation.studentName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <p className="text-gray-800">{selectedConsultation.studentId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <p className="text-gray-800">{selectedConsultation.topic}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedConsultation.status)}`}>
                    {selectedConsultation.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <p className="text-gray-800">{selectedConsultation.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <p className="text-gray-800">{selectedConsultation.time}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedConsultation.notes}</p>
              </div>

              {selectedConsultation.rating && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  {renderStars(selectedConsultation.rating)}
                </div>
              )}

              {selectedConsultation.feedback && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Feedback</label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedConsultation.feedback}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminConsultationSummary;