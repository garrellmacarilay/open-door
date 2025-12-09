import React, { useState, useMemo, useCallback } from 'react';
import GradIcon from '../../../../components/global-img/graduation-cap.svg';

function Calendar({ 
  currentDate, 
  isAnimating, 
  bookedAppointments, 
  setBookedAppointments 
}) {
  const [showAppointmentHoverModal, setShowAppointmentHoverModal] = useState(false);
  const [hoveredAppointment, setHoveredAppointment] = useState(null);

  // Precompute normalized appointments grouped by local date key to avoid remapping in each cell
  const apptsByDate = useMemo(() => {
    const map = {};
    const dateKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    (bookedAppointments || []).forEach((appointment) => {
      // Parse date from 'start' (or 'end' if you prefer)
      const apptDate = new Date(appointment.start);

      const localDate = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate());
      const key = dateKey(localDate);

      const details = appointment.details || {};

      // Normalize fields to your component's expected names
      const normalized = {
        ...appointment,
        id: appointment.id,
        dateObj: apptDate,
        student: details.student || details.studentName || appointment.title || 'Unknown',
        studentName: details.student || details.studentName || appointment.title || 'Unknown',
        office: details.office || details.office_name || 'Unknown',
        serviceType: details.service_type || details.service || 'Unknown',
        time: apptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: (details.status || 'pending').toLowerCase(), // normalize to lowercase
        attachedFile: details.attachment || null,
        concernDescription: details.concern_description || '',
        staff: details.staff || 'Unassigned',
        referenceCode: details.reference_code || '',
        dateString: localDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      };

      if (!map[key]) map[key] = [];
      map[key].push(normalized);
    });

    // Sort each day's appointments by time
    Object.keys(map).forEach(k => {
      map[k].sort((a, b) => a.dateObj - b.dateObj);
    });

    return map;
  }, [bookedAppointments]);


  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Create a 6x7 grid (6 rows, 7 columns = 42 cells total)
    const totalCells = 42;
    const daysArray = [];

    // helper to create a date key (local y-m-d) for map lookups
    const dateKey = (d) => `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;

    // Fill the array with 42 cells
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1;
      
      if (i < firstDay || dayNumber > daysInMonth) {
        // Empty cell (before month starts or after month ends)
        daysArray.push(
          <div key={`empty-${i}`} className="flex-1 border border-gray-200 bg-gray-50"></div>
        );
      } else {
        // Day cell
        const isToday = today.getDate() === dayNumber && 
                       today.getMonth() === currentMonth && 
                       today.getFullYear() === currentYear;
        
        // Lookup appointments for this day from the precomputed map
        const cellDate = new Date(currentYear, currentMonth, dayNumber);
        const dayKey = dateKey(cellDate);
        const dayAppointments = apptsByDate[dayKey] || [];

        const hasAppointments = dayAppointments.length > 0;
        const maxVisible = 2;
        // pre-sorted when grouping; visible ones are earliest
        const visibleAppointments = dayAppointments.slice(0, maxVisible);
        const hasMoreAppointments = dayAppointments.length > maxVisible;
        
        daysArray.push(
          <div
            key={dayNumber}
            className={`flex-1 border border-gray-200 relative cursor-pointer hover:bg-blue-50 transition-colors ${
              isToday ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white'
            }`}
          >
            <span className={`absolute top-1 right-2 text-sm font-bold ${
              isToday ? 'text-white' : 'text-black'
            }`} style={{ fontFamily: 'Poppins' }}>
              {dayNumber}
            </span>
            
            {/* Appointment Indicators */}
            {hasAppointments && (
              <div className="absolute bottom-1 left-1 right-1 space-y-0.5">
                {/* Visible appointment indicators */}
                {visibleAppointments.map((appointment, index) => (
                  <div 
                    key={appointment.id || `${appointment.office}-${appointment.time}`}
                    className="bg-[#FF9500] rounded-[3px] px-1 py-0.5 flex items-center justify-center cursor-pointer z-10"
                    onMouseEnter={(e) => {
                      setHoveredAppointment({
                        ...appointment,
                        position: { x: e.currentTarget.getBoundingClientRect().left, y: e.currentTarget.getBoundingClientRect().top }
                      });
                      setShowAppointmentHoverModal(true);
                    }}
                    onMouseLeave={() => {
                      setShowAppointmentHoverModal(false);
                      setHoveredAppointment(null);
                    }}
                  >
                    <span className="text-white text-[10px] font-bold leading-none" style={{ fontFamily: 'Poppins' }}>
                      {appointment.office || appointment.office_name || 'Appointment'}
                    </span>
                  </div>
                ))}
                
                {/* View all indicator */}
                {hasMoreAppointments && (
                  <div 
                    className="bg-[#122141] rounded-[3px] px-1 py-0.5 flex items-center justify-center cursor-pointer z-10"
                    onMouseEnter={(e) => {
                      setHoveredAppointment({
                        allAppointments: dayAppointments,
                        isViewAll: true,
                        position: { x: e.currentTarget.getBoundingClientRect().left, y: e.currentTarget.getBoundingClientRect().top }
                      });
                      setShowAppointmentHoverModal(true);
                    }}
                    onMouseLeave={() => {
                      setShowAppointmentHoverModal(false);
                      setHoveredAppointment(null);
                    }}
                  >
                    <span className="text-white text-[12px] font-bold leading-none" style={{ fontFamily: 'Poppins' }}>
                      View all ({dayAppointments.length})
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }
    }

    return daysArray;
  };

  return (
    <>
      {/* Calendar Section */}
      <div className="flex-1 flex flex-col min-h-0 rounded-lg">
        {/* Calendar Body */}
        <div className="bg-white rounded-lg border-2 border-gray-900 flex-1 flex flex-col min-h-0">
          {/* Days of Week */}
          <div className="grid grid-cols-7 shrink-0">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
            <div 
              key={day} 
              className={`bg-gray-50 border border-[#EFEFEF] h-[2.125rem] flex items-center justify-center ${
                index === 0 ? 'rounded-tl-[0.625rem]' : index === 6 ? 'rounded-tr-[0.625rem]' : ''
              }`}
            >
              <span className="text-black text-[0.9375rem] font-semibold" style={{ fontFamily: 'Inter' }}>
                {day}
              </span>
            </div>
          ))} 
        </div>
          {/* Calendar Grid - 6 rows x 7 columns using flexible boxes */}
          <div className={`flex-1 flex flex-col min-h-0 transition-all duration-150 ${
            isAnimating ? 'opacity-50 scale-98' : 'opacity-100 scale-100'
          }`}>
            {/* Create 6 rows */}
            {Array.from({ length: 6 }, (_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex-1 flex">
                {/* Each row contains 7 columns */}
                {renderCalendar().slice(rowIndex * 7, (rowIndex + 1) * 7)}
              </div>
            ))}
          </div>

          {/* Status Legend */}
          <div className="p-2 border-t border-gray-200 flex gap-4 shrink-0 text-black!">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs" style={{ fontFamily: 'Poppins' }}>Approved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs" style={{ fontFamily: 'Poppins' }}>Pending</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs" style={{ fontFamily: 'Poppins' }}>Declined</span>
            </div>
          </div>

        </div>
      </div>

      {/* Appointment Hover Modal */}
      {showAppointmentHoverModal && hoveredAppointment && (
        <div 
          className={`fixed bg-white rounded-[0.625rem] rounded-br-none shadow-lg z-50 pointer-events-none ${
            hoveredAppointment.isViewAll ? 'w-[17.5rem]' : 'w-[13.125rem] h-[9.5625rem]'
          }`}
          style={{
            left: `${hoveredAppointment.isViewAll ? hoveredAppointment.position.x - 18.125 : hoveredAppointment.position.x + 0.625}rem`,
            top: `${hoveredAppointment.position.y - (hoveredAppointment.isViewAll ? (0.625 + (hoveredAppointment.allAppointments.length * 2.8125) + 0.75) : 10)}rem`
          }}
        >
          {/* Modal Header */}
          <div className="bg-[#122141] rounded-t-[0.625rem] h-9 flex items-center px-4">
            <h3 className="text-white text-[0.5rem] font-bold" style={{ fontFamily: 'Poppins' }}>
              {hoveredAppointment.isViewAll ? 'All Consultation Schedules' : 'Consultation Schedule'}
            </h3>
          </div>

          {/* Modal Content */}
          <div className="p-3 space-y-2">
            {hoveredAppointment.isViewAll ? (
              // Show all appointments when "View all" is hovered
              hoveredAppointment.allAppointments.map((appointment, index) => (
                <div key={index} className="border-b border-gray-200 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">

                  {/* Office */}
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="0.625rem" height="0.5rem" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4L6 1L11 4V9C11 9.26522 10.8946 9.51957 10.7071 9.70711C10.5196 9.89464 10.2652 10 10 10H2C1.73478 10 1.48043 9.89464 1.29289 9.70711C1.10536 9.51957 1 9.26522 1 9V4Z" stroke="#0059FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-black text-[0.5625rem] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{appointment.office}</span>
                  </div>

                   {/* <div className="flex items-center gap-2 mb-1">
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 2H2C1.44772 2 1 2.44772 1 3V9C1 9.55228 1.44772 10 2 10H8C8.55228 10 9 9.55228 9 9V3C9 2.44772 8.55228 2 8 2Z" fill="white"/>
                      <path d="M7 1V3M3 1V3M1 5H9" stroke="#360055" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                    <span className="text-black text-[0.5625rem] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{appointment.date}</span>
                  </div> */}

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <svg width="0.5625rem" height="0.5625rem" viewBox="0 0 10.5 10.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="5.25" cy="5.25" r="4.75" stroke="#9D4400" strokeWidth="1"/>
                      <path d="M5.25 2.625V5.25L7 7" stroke="#9D4400" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-black text-[0.5625rem] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{appointment.time}</span>
                  </div>
                </div>
              ))
            ) : (
              // Show single appointment details
              <>
                {/* Office */}
                <div className="flex items-center gap-2">
                  <svg width="0.625rem" height="0.625rem" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L6 1L11 4V9C11 9.26522 10.8946 9.51957 10.7071 9.70711C10.5196 9.89464 10.2652 10 10 10H2C1.73478 10 1.48043 9.89464 1.29289 9.70711C1.10536 9.51957 1 9.26522 1 9V4Z" stroke="#0059FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-black text-[0.625rem] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{hoveredAppointment.office}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2">
                  <svg width="0.625rem" height="0.75rem" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2H2C1.44772 2 1 2.44772 1 3V9C1 9.55228 1.44772 10 2 10H8C8.55228 10 9 9.55228 9 9V3C9 2.44772 8.55228 2 8 2Z" fill="white"/>
                    <path d="M7 1V3M3 1V3M1 5H9" stroke="#360055" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-black text-[0.625rem] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{hoveredAppointment.dateString}</span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2">
                  <svg width="0.65625rem" height="0.65625rem" viewBox="0 0 10.5 10.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="5.25" cy="5.25" r="4.75" stroke="#9D4400" strokeWidth="1"/>
                    <path d="M5.25 2.625V5.25L7 7" stroke="#9D4400" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-black text-[0.625rem] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{hoveredAppointment.time}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Calendar;