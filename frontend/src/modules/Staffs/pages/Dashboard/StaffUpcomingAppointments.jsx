import React, { useState } from 'react';
import GradIcon from '../../../../components/global-img/graduation-cap.svg';

function StaffUpcomingAppointments({ upcomingEvents }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const handleApprove = () => {
    // Handle approve logic here
    console.log('Approved appointment:', selectedAppointment);
    handleCloseModal();
  };

  const handleDecline = () => {
    // Handle decline logic here
    console.log('Declined appointment:', selectedAppointment);
    handleCloseModal();
  };
  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#142240] rounded-t-lg h-[58px] flex items-center px-4 shrink-0">
        <h2 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>Upcoming Appointments</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-200 min-h-0">
        {upcomingEvents?.slice(0, 2).map((event, index) => (
          <div 
            key={`${event?.studentName || 'unknown'}-${event?.time || 'unknown'}-${index}`} 
            className="border border-gray-400 rounded-[5px] p-3 pb-0 mb-4 bg-white relative cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleAppointmentClick(event)}
          >
            {/* Student Info Row */}
            <div className="flex items-center gap-2 mb-2 pr-10!">
              <img src={GradIcon} alt="Graduation Cap" className="w-5 h-5 pr-0" />
              <span className="font-semibold text-xs text-black" style={{ fontFamily: 'Inter' }}>{event?.studentName || 'Unknown Student'}</span>
            </div>

            {/* Office Row */}
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L8 1L15 5V12C15 12.2652 14.8946 12.5196 14.7071 12.7071C14.5196 12.8946 14.2652 13 14 13H2C1.73478 13 1.48043 12.8946 1.29289 12.7071C1.10536 12.5196 1 12.2652 1 12V5Z" stroke="#0059FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>{event?.office || 'Unknown Office'}</span>
            </div>

            {/* Date Row */}
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 3H3C1.89543 3 1 3.89543 1 5V13C1 14.1046 1.89543 15 3 15H11C12.1046 15 13 14.1046 13 13V5C13 3.89543 12.1046 3 11 3Z" fill="white"/>
                <path d="M9 1V5M5 1V5M1 7H13" stroke="#360055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>{event?.date || 'Unknown Date'}</span>
            </div>

            {/* Time Row */}
            <div className="flex items-center gap-2 mb-3">
              <svg width="14.5" height="14.5" viewBox="0 0 14.5 14.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7.25" cy="7.25" r="6.25" stroke="#9D4400" strokeWidth="2"/>
                <path d="M7.25 3.625V7.25L9.625 9.625" stroke="#9D4400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>{event?.time || 'Unknown Time'}</span>
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <div className={`px-3 py-1 rounded-[5px] ${
                event?.status === 'Pending' ? 'bg-[#FFE168]' :
                event?.status === 'Approved' ? 'bg-[#9EE2AA]' :
                'bg-red-200'
              }`}>
                <span className={`text-base font-medium items-center  ${
                  event?.status === 'Pending' ? 'text-[#9D6B00]' :
                  event?.status === 'Approved' ? 'text-[#009812]' :
                  'text-red-700'
                }`} style={{ fontFamily: 'Poppins' , fontSize: '10px' }}>
                  {event?.status || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] shadow-[0px_4px_50px_10px_rgba(125,125,125,0.25)] w-full max-w-[500px] h-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#122141] rounded-t-[10px] h-[60px] flex items-center px-6 shrink-0">
              <h3 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>
                Appointment Requests
              </h3>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1">

              {/* Status Badge */}
              <div className="fixed right-140 top-49 mb-4">
                <div className={`px-3 py-2 rounded-[5px] ${
                  selectedAppointment?.status === 'Pending' ? 'bg-[#FFE168]' :
                  selectedAppointment?.status === 'Approved' ? 'bg-[#9EE2AA]' :
                  'bg-red-200'
                }`}>
                  <span className={`text-sm font-medium ${
                    selectedAppointment?.status === 'Pending' ? 'text-[#9D6B00]' :
                    selectedAppointment?.status === 'Approved' ? 'text-[#009812]' :
                    'text-red-700'
                  }`} style={{ fontFamily: 'Poppins' }}>
                    {selectedAppointment?.status || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Main Information Container */}
              <div className="border border-[#BCBABA] rounded-[10px] p-4 space-y-3">
                {/* Student Information */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <img src={GradIcon} alt="Student" className="w-4 h-4" />
                    <span className="text-sm font-semibold text-black" style={{ fontFamily: 'Inter' }}>Student</span>
                  </div>
                  <div className="ml-6">
                    <span className="text-sm text-black" style={{ fontFamily: 'Inter' }}>
                      {selectedAppointment?.studentName || 'Unknown Student'}
                    </span>
                  </div>
                </div>

                {/* Office Information */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L8 1L15 5V12C15 12.2652 14.8946 12.5196 14.7071 12.7071C14.5196 12.8946 14.2652 13 14 13H2C1.73478 13 1.48043 12.8946 1.29289 12.7071C1.10536 12.5196 1 12.2652 1 12V5Z" stroke="#0059FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-semibold text-black" style={{ fontFamily: 'Inter' }}>Office</span>
                  </div>
                  <div className="ml-6">
                    <span className="text-sm text-black" style={{ fontFamily: 'Inter' }}>
                      {selectedAppointment?.office || 'Medical and Dental Services'}
                    </span>
                  </div>
                </div>

                {/* Type of Service */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L8 1L15 5V12C15 12.2652 14.8946 12.5196 14.7071 12.7071C14.5196 12.8946 14.2652 13 14 13H2C1.73478 13 1.48043 12.8946 1.29289 12.7071C1.10536 12.5196 1 12.2652 1 12V5Z" stroke="#0059FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-semibold text-black" style={{ fontFamily: 'Inter' }}>Type of Service</span>
                  </div>
                  <div className="ml-6">
                    <span className="text-sm text-black" style={{ fontFamily: 'Inter' }}>
                      {selectedAppointment?.serviceType || 'Medical Checkup'}
                    </span>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 3H3C1.89543 3 1 3.89543 1 5V13C1 14.1046 1.89543 15 3 15H11C12.1046 15 13 14.1046 13 13V5C13 3.89543 12.1046 3 11 3Z" fill="white"/>
                      <path d="M9 1V5M5 1V5M1 7H13" stroke="#360055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-semibold text-black" style={{ fontFamily: 'Inter' }}>Date & Time</span>
                  </div>
                  <div className="ml-6">
                    <div className="text-sm text-black" style={{ fontFamily: 'Inter' }}>
                      {selectedAppointment?.date || 'October 27, 2025'}
                    </div>
                    <div className="text-sm text-black" style={{ fontFamily: 'Inter' }}>
                      {selectedAppointment?.time || '2:00 PM'}
                    </div>
                  </div>
                </div>

                {/* Attached Files */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5 2.25H4.5C4.10218 2.25 3.72064 2.40804 3.43934 2.68934C3.15804 2.97064 3 3.35218 3 3.75V14.25C3 14.6478 3.15804 15.0294 3.43934 15.3107C3.72064 15.592 4.10218 15.75 4.5 15.75H13.5C13.8978 15.75 14.2794 15.592 14.5607 15.3107C14.842 15.0294 15 14.6478 15 14.25V6.75L10.5 2.25Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.5 2.25V6.75H15" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-semibold text-black" style={{ fontFamily: 'Inter' }}>Attached Files:</span>
                  </div>
                  
                  {/* File Container */}
                  <div className="ml-6 border border-[#BCBABA] rounded-[10px] p-2 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#909090]" style={{ fontFamily: 'Poppins' }}>
                        {selectedAppointment?.attachedFile || 'medicalcertificate.pdf'}
                      </span>
                      <button className="hover:opacity-75 transition-opacity">
                        <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 7.5H12.5M7.5 2.5V12.5" stroke="#909090" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end px-6 pb-6 shrink-0">
              {/* Approve Button */}
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-[#009650]! hover:bg-green-700 rounded-[5px] flex items-center justify-center transition-colors"
              >
                <span className="text-white text-sm font-bold" style={{ fontFamily: 'Poppins' }}>
                  Approve
                </span>
              </button>

              {/* Decline Button */}
              <button
                onClick={handleDecline}
                className="px-6 py-2 bg-[#fe0101]! hover:bg-red-300 rounded-[5px] flex items-center justify-center transition-colors"
              >
                <span className="text-[#ffffff] text-sm font-bold" style={{ fontFamily: 'Poppins' }}>
                  Decline
                </span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute bg-[#142240]! top-27 right-131 text-white hover:text-gray-300 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffUpcomingAppointments;