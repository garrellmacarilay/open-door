import React from 'react';
import GradIcon from '../../../../components/global-img/graduation-cap.svg';

function UpcomingAppointments({ upcomingEvents, fetchMore, hasMore }) {
  const eventsArray = Array.isArray(upcomingEvents) ? upcomingEvents : [];

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (hasMore) fetchMore();
    }
  };

  return (
    <div className="bg-white rounded-lg flex flex-col h-[400px] shadow-2xl">
      {/* Header */}
      <div className="bg-[#142240] rounded-t-lg h-[48px] flex items-center px-4 shrink-0">
        <h2 className="text-white text-sm font-bold" style={{ fontFamily: 'Inter' }}>
          Upcoming Appointments
        </h2>
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-200" 
        onScroll={handleScroll}
      >
        {eventsArray.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <p className="text-sm font-semibold" style={{ fontFamily: 'Inter' }}>
              No bookings found.
            </p>
            <p className="text-xs mt-1" style={{ fontFamily: 'Inter' }}>
              Make a booking appointment.
            </p>
          </div>
        ) : (
          /* Bookings List - COMPACT VERSION */
          eventsArray.map((event) => (
            <div
              key={event.id}
              className="border border-gray-300 rounded-[5px] p-2 mb-2 bg-white relative hover:shadow-sm transition-shadow"
            >
              {/* Row 1: Title/Student + Status */}
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2 pr-16 truncate">
                    <img src={GradIcon} alt="Graduation Cap" className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-xs text-black truncate" style={{ fontFamily: 'Inter' }}>
                        {event.details?.student || event.title}
                    </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2.5 right-3">
                  <div className={`px-2 h-5 rounded-[5px] flex items-center justify-center ${
                    event.details?.status === 'pending' ? 'bg-[#b8ce28]' :
                    event.details?.status === 'approved' ? 'bg-[#3b7846]' :
                    event.details?.status === 'rescheduled' ? 'bg-[#961bb5]' :
                    'bg-red-200'
                  }`}>
                    <span className={`${
                      event.details?.status === 'pending' ? 'text-white' :
                      event.details?.status === 'approved' ? 'text-white' :
                      event.details?.status === 'rescheduled' ? 'text-white' :
                      'text-red-700'
                    }`} style={{ fontFamily: 'Poppins', fontSize: '10px' }}>
                      {event.details?.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Office */}
              <div className="flex items-center gap-2 mb-1 pl-6">
                 <span className="text-[10px] text-gray-600 font-medium" style={{ fontFamily: 'Inter' }}>
                    {event.details?.office || 'N/A'}
                 </span>
              </div>

              {/* Row 3: Date & Time Combined */}
              <div className="flex items-center gap-3 pl-6">
                {/* Date */}
                <div className="flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3H3C1.89543 3 1 3.89543 1 5V13C1 14.1046 1.89543 15 3 15H11C12.1046 15 13 14.1046 13 13V5C13 3.89543 12.1046 3 11 3Z" fill="white" />
                        <path d="M9 1V5M5 1V5M1 7H13" stroke="#360055" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10px] text-gray-500" style={{ fontFamily: 'Inter' }}>
                        {event.dateString || (event.date instanceof Date ? event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : event.date) || 'N/A'}
                    </span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 14.5 14.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7.25" cy="7.25" r="6.25" stroke="#9D4400" strokeWidth="1.5" />
                        <path d="M7.25 3.625V7.25L9.625 9.625" stroke="#9D4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[10px] text-gray-500" style={{ fontFamily: 'Inter' }}>
                        {event.time || 'N/A'}
                    </span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UpcomingAppointments;