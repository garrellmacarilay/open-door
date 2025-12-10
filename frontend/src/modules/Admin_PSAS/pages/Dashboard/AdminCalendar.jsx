import React, { useState } from 'react';
import GradIcon from '../../../../components/global-img/graduation-cap.svg';

function AdminCalendar({ currentDate, isAnimating, calendarAppointments = [], events = [] }) {
  const [showAppointmentHoverModal, setShowAppointmentHoverModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Get status-based colors for appointments
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-[#15803D]';
      case 'pending': return 'bg-[#B45309]';
      case 'declined': return 'bg-red-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      case 'rescheduled': return 'bg-purple-500';
      default: return 'bg-[#B45309]';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const totalCells = 42;
    const daysArray = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1;

      if (i < firstDay || dayNumber > daysInMonth) {
        daysArray.push(
          <div key={`empty-${i}`} className="flex-1 bg-white border border-[#EFEFEF]"></div>
        );
      } else {
        const isToday =
          today.getDate() === dayNumber &&
          today.getMonth() === currentMonth &&
          today.getFullYear() === currentYear;

        // 1. Filter Appointments
        const dayAppointments = calendarAppointments.filter((appointment) => {
          const dateObj = new Date(appointment.start);
          return (
            dateObj.getDate() === dayNumber &&
            dateObj.getMonth() === currentMonth &&
            dateObj.getFullYear() === currentYear
          );
        });

        // 2. Filter Events (Using 'event_date' from your object)
        const dayEvents = events.filter((event) => {
          const dateObj = new Date(event.event_date); 
          return (
            dateObj.getDate() === dayNumber &&
            dateObj.getMonth() === currentMonth &&
            dateObj.getFullYear() === currentYear
          );
        });

        // Combine for display logic
        const totalItems = dayEvents.length + dayAppointments.length;
        const maxVisible = 2;
        
        // Prioritize showing Events
        const visibleEvents = dayEvents.slice(0, maxVisible);
        const remainingSlots = maxVisible - visibleEvents.length;
        const visibleAppointments = dayAppointments.slice(0, remainingSlots);
        
        const hasMore = totalItems > maxVisible;

        daysArray.push(
          <div
            key={dayNumber}
            className={`flex-1 border border-gray-200 relative cursor-pointer hover:bg-blue-50 transition-colors ${
              isToday ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white'
            }`}
          >
            <span
              className={`absolute top-1 right-2 text-sm font-bold ${
                isToday ? 'text-white' : 'text-black'
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              {dayNumber}
            </span>

            {/* Content Container */}
            <div className="absolute bottom-1 left-1 right-1 space-y-0.5">
              
              {/* Render EVENTS first */}
              {visibleEvents.map((event, index) => (
                <div
                  key={`evt-${index}`}
                  // CHANGED: Background color is now #122141
                  className="bg-[#122141] rounded-[3px] px-1 py-0.5 flex items-center justify-center cursor-pointer z-10"
                  onMouseEnter={(e) => {
                    setHoveredItem({
                      ...event,
                      type: 'event',
                      position: {
                        x: e.currentTarget.getBoundingClientRect().left,
                        y: e.currentTarget.getBoundingClientRect().top,
                      },
                    });
                    setShowAppointmentHoverModal(true);
                  }}
                  onMouseLeave={() => {
                    setShowAppointmentHoverModal(false);
                    setHoveredItem(null);
                  }}
                >
                  {/* CHANGED: Using event_title */}
                  <span className="text-white text-[10px] font-bold leading-none truncate" style={{ fontFamily: 'Poppins' }}>
                    {event.event_title} 
                  </span>
                </div>
              ))}

              {/* Render APPOINTMENTS next */}
              {visibleAppointments.map((appointment, index) => (
                <div
                  key={`appt-${index}`}
                  className={`${getStatusColor(appointment.status || appointment.details?.status)} rounded-[3px] px-1 py-0.5 flex items-center justify-center cursor-pointer z-10`}
                  onMouseEnter={(e) => {
                    setHoveredItem({
                      ...appointment,
                      type: 'appointment',
                      position: {
                        x: e.currentTarget.getBoundingClientRect().left,
                        y: e.currentTarget.getBoundingClientRect().top,
                      },
                    });
                    setShowAppointmentHoverModal(true);
                  }}
                  onMouseLeave={() => {
                    setShowAppointmentHoverModal(false);
                    setHoveredItem(null);
                  }}
                >
                  <span className="text-white text-[10px] font-bold leading-none truncate" style={{ fontFamily: 'Poppins' }}>
                    {appointment.serviceType}
                  </span>
                </div>
              ))}

              {/* View All Button */}
              {hasMore && (
                <div
                  // FIX: Changed bg-gray-500 to bg-[#122141]
                  className="bg-[#122141] rounded-[3px] px-1 py-0.5 flex items-center justify-center cursor-pointer z-10"
                  onMouseEnter={(e) => {
                    setHoveredItem({
                      allAppointments: dayAppointments,
                      allEvents: dayEvents,
                      isViewAll: true,
                      position: {
                        x: e.currentTarget.getBoundingClientRect().left,
                        y: e.currentTarget.getBoundingClientRect().top,
                      },
                    });
                    setShowAppointmentHoverModal(true);
                  }}
                  onMouseLeave={() => {
                    setShowAppointmentHoverModal(false);
                    setHoveredItem(null);
                  }}
                >
                  <span className="text-white text-[12px] font-bold leading-none" style={{ fontFamily: 'Poppins' }}>
                    View all ({totalItems})
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      }
    }

    return daysArray;
  };

  // Helper to render a single appointment row in modal
  const renderAppointmentRow = (appointment) => (
    <div className="flex flex-col gap-1 border-b border-gray-600/20 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
        <div className="flex items-center gap-2">
            <img src={GradIcon} alt="Graduation Cap" className="w-3 h-3 pr-0" />
            <span className="text-black text-[10px] font-medium font-inter">
                {appointment.studentName}
            </span>
        </div>
        <div className="flex items-center gap-2">
             <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4L6 1L11 4V9C11 9.26522 10.8946 9.51957 10.7071 9.70711C10.5196 9.89464 10.2652 10 10 10H2C1.73478 10 1.48043 9.89464 1.29289 9.70711C1.10536 9.51957 1 9.26522 1 9V4Z" stroke="#0059FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-black text-[10px] font-medium font-inter">
                {appointment.office} ({appointment.serviceType})
            </span>
        </div>
        <div className="flex items-center gap-2">
            <svg width="9" height="9" viewBox="0 0 10.5 10.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5.25" cy="5.25" r="4.75" stroke="#9D4400" strokeWidth="1"/>
                <path d="M5.25 2.625V5.25L7 7" stroke="#9D4400" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-black text-[10px] font-medium font-inter">
                {new Date(appointment.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </span>
        </div>
    </div>
  );

  // Helper to render a single event row in modal
  const renderEventRow = (event) => (
    <div className="flex flex-col gap-1 border-b border-gray-600/20 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
        <div className="flex items-center gap-2">
            {/* CHANGED: Dot color is now #122141 */}
            <div className="w-2 h-2 rounded-full bg-[#122141]"></div>
            {/* CHANGED: Using event_title */}
            <span className="text-black text-[10px] font-bold font-inter">
                {event.event_title}
            </span>
        </div>
        <div className="pl-4 text-gray-600 text-[9px] font-inter">
            {event.description || 'No description'}
        </div>
    </div>
  );

  return (
    <>
      {/* Calendar Container */}
      <div className="flex-1 flex flex-col min-h-0 rounded-lg">
        <div className="bg-white rounded-lg border-2 border-gray-900 flex-1 flex flex-col min-h-0">
          {/* Days of the Week */}
          <div className="grid grid-cols-7 shrink-0">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
              (day, index) => (
                <div
                  key={day}
                  className={`bg-gray-50 border border-[#EFEFEF] h-[34px] flex items-center justify-center ${
                    index === 0 ? 'rounded-tl-[10px]' : index === 6 ? 'rounded-tr-[10px]' : ''
                  }`}
                >
                  <span className="text-black text-[15px] font-semibold" style={{ fontFamily: 'Inter' }}>
                    {day}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Calendar Grid */}
          <div
            className={`flex-1 flex flex-col min-h-0 transition-all duration-150 ${
              isAnimating ? 'opacity-50 scale-98' : 'opacity-100 scale-100'
            }`}
          >
            {Array.from({ length: 6 }, (_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex-1 flex">
                {renderCalendar().slice(rowIndex * 7, (rowIndex + 1) * 7)}
              </div>
            ))}
          </div>

          {/* Status Legend */}
          <div className="p-2 border-t border-gray-200 flex gap-4 shrink-0 text-black overflow-x-auto">
            <div className="flex items-center gap-1">
              {/* CHANGED: Legend color is now #122141 */}
              <div className="w-2 h-2 bg-[#122141] rounded-full"></div>
              <span className="text-xs" style={{ fontFamily: 'Poppins' }}>Event</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#15803D] rounded-full"></div>
              <span className="text-xs" style={{ fontFamily: 'Poppins' }}>Approved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#B45309] rounded-full"></div>
              <span className="text-xs" style={{ fontFamily: 'Poppins' }}>Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Modal */}
      {showAppointmentHoverModal && hoveredItem && (
        <div
          className={`fixed bg-white rounded-[10px] rounded-br-none shadow-lg z-50 pointer-events-none ${
            hoveredItem.isViewAll ? 'w-[280px]' : 'w-[210px] min-h-[80px]'
          }`}
          style={{
            left: `${
                hoveredItem.isViewAll
                ? hoveredItem.position.x - 290
                : hoveredItem.position.x + 10
            }px`,
            top: `${
                hoveredItem.position.y -
                (hoveredItem.isViewAll
                ? 10 + ((hoveredItem.allAppointments?.length || 0) + (hoveredItem.allEvents?.length || 0)) * 45 + 12
                : 100) 
            }px`,
          }}
        >
          {/* Modal Header (Color #122141 matches events now) */}
          <div className="bg-[#122141] rounded-t-[10px] h-9 flex items-center px-4">
            <h3 className="text-white text-[8px] font-bold" style={{ fontFamily: 'Poppins' }}>
              {hoveredItem.isViewAll 
                ? 'All Schedule' 
                : hoveredItem.type === 'event' ? 'Event Details' : 'Consultation Schedule'}
            </h3>
          </div>

          {/* Modal Content */}
          <div className="p-3">
            {hoveredItem.isViewAll ? (
                <>
                 {/* Show All Events First */}
                 {hoveredItem.allEvents?.map((evt, idx) => (
                    <div key={`all-evt-${idx}`}>{renderEventRow(evt)}</div>
                 ))}
                 {/* Show All Appointments Next */}
                 {hoveredItem.allAppointments?.map((appt, idx) => (
                    <div key={`all-appt-${idx}`}>{renderAppointmentRow(appt)}</div>
                 ))}
                </>
            ) : (
              // Single Item View
              hoveredItem.type === 'event' 
                ? renderEventRow(hoveredItem) 
                : renderAppointmentRow(hoveredItem)
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminCalendar;