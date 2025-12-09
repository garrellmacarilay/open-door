import React from 'react';
import GradIcon from '../../../../components/global-img/graduation-cap.svg';

function UpcomingAppointments({ upcomingEvents, fetchMore, hasMore }) {
  // TODO: Comment out when done testing - Dummy data for testing
  const dummyData = [
    {
      id: 1,
      title: "Academic Advising Session",
      details: {
        student: "John Doe",
        office: "Guidance and Counseling",
        status: "pending",
        service_type: "Academic Consultation"
      },
      dateString: "December 15, 2025",
      time: "10:00 AM"
    },
    {
      id: 2,
      title: "Career Planning Meeting",
      details: {
        student: "Jane Smith", 
        office: "Student Affairs",
        status: "approved",
        service_type: "Career Guidance"
      },
      dateString: "December 16, 2025", 
      time: "2:30 PM"
    },
    {
      id: 3,
      title: "IT Support Request",
      details: {
        student: "Mike Johnson",
        office: "IT Services",
        status: "rescheduled", 
        service_type: "Technical Support"
      },
      dateString: "December 18, 2025",
      time: "11:15 AM"
    },
    {
      id: 4,
      title: "Financial Aid Consultation",
      details: {
        student: "Sarah Wilson",
        office: "Financial Aid Office",
        status: "pending",
        service_type: "Financial Consultation"
      },
      dateString: "December 20, 2025",
      time: "9:00 AM"
    },
    {
      id: 5,
      title: "Health Services Appointment",
      details: {
        student: "Alex Brown",
        office: "Medical Services", 
        status: "approved",
        service_type: "Health Checkup"
      },
      dateString: "December 22, 2025",
      time: "1:45 PM"
    }
  ];

  // Use dummy data instead of API data for testing
  const eventsArray = dummyData;
  // TODO: Uncomment when done testing
  // const eventsArray = Array.isArray(upcomingEvents) ? upcomingEvents : [];

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (hasMore) fetchMore();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#142240] rounded-t-lg h-[58px] flex items-center px-4 shrink-0">
        <h2 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>
          Upcoming Appointments
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-200 min-h-0" onScroll={handleScroll}>
        {eventsArray.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-sm">No upcoming appointments</div>
        ) : (
          eventsArray.map((event) => (
            <div
              key={event.id}
              className="border border-gray-400 rounded-[5px] p-3 pb-0 mb-4 bg-white relative cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Student Info Row */}
              <div className="flex items-center gap-2 mb-2 pr-10">
                <img src={GradIcon} alt="Graduation Cap" className="w-5 h-5 pr-0" />
                <span className="font-semibold text-xs text-black" style={{ fontFamily: 'Inter' }}>
                  {event.details?.student || event.title}
                </span>
              </div>

              {/* Office Row */}
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 16 14" fill="none">
                  <path d="M1 5L8 1L15 5V12C15 12.2652 14.8946 12.5196 14.7071 12.7071C14.5196 12.8946 14.2652 13 14 13H2C1.73478 13 1.48043 12.8946 1.29289 12.7071C1.10536 12.5196 1 12.2652 1 12V5Z" stroke="#0059FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>
                  {event.details?.office || 'N/A'}
                </span>
              </div>

              {/* Date Row */}
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 14 16" fill="none">
                  <path d="M11 3H3C1.89543 3 1 3.89543 1 5V13C1 14.1046 1.89543 15 3 15H11C12.1046 15 13 14.1046 13 13V5C13 3.89543 12.1046 3 11 3Z" fill="white" />
                  <path d="M9 1V5M5 1V5M1 7H13" stroke="#360055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>
                  {event.dateString || (event.date instanceof Date ? event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : event.date) || 'N/A'}
                </span>
              </div>

              {/* Time Row */}
              <div className="flex items-center gap-2 mb-3">
                <svg width="14.5" height="14.5" viewBox="0 0 14.5 14.5" fill="none">
                  <circle cx="7.25" cy="7.25" r="6.25" stroke="#9D4400" strokeWidth="2"/>
                  <path d="M7.25 3.625V7.25L9.625 9.625" stroke="#9D4400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>
                  {event.time || 'N/A'}
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
          ))
        )}
      </div>
    </div>
  );
}

export default UpcomingAppointments;