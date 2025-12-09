import React, { useState, useEffect } from 'react';
import GradIcon from '../../../../components/global-img/graduation-cap.svg';
import { useDashboardAppointments } from '../../../../hooks/staffHooks';

function StaffCalendar({ currentDate, isAnimating, }) {
  const { loading, error, appointments, fetchDashboard } = useDashboardAppointments()
  const [showAppointmentHoverModal, setShowAppointmentHoverModal] = useState(false);
  const [hoveredAppointment, setHoveredAppointment] = useState(null);
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  useEffect(() => {
    const transformed = appointments.map(appt => ({
      id: appt.id,
      office: appt.details.office,
      studentName: appt.details.student,
      dateObj: new Date(appt.start),
      time: new Date(appt.start).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      status: appt.details.status
    }));

    setCalendarData(transformed);
  }, [appointments]);

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

    // Fill the array with 42 cells
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1;
      
      if (i < firstDay || dayNumber > daysInMonth) {
        // Empty cell (before month starts or after month ends)
        daysArray.push(
          <div key={`empty-${i}`} className="flex-1 bg-white border border-[#EFEFEF]"></div>
        );
      } else {
        // Day cell
        const isToday = today.getDate() === dayNumber && 
                       today.getMonth() === currentMonth && 
                       today.getFullYear() === currentYear;
        
        // Get all appointments for this day
        const dayAppointments = calendarData.filter(appointment => {
          return appointment.dateObj.getDate() === dayNumber &&
                 appointment.dateObj.getMonth() === currentMonth &&
                 appointment.dateObj.getFullYear() === currentYear;
        });

        const hasAppointments = dayAppointments.length > 0;
        const maxVisible = 2;
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
                    key={`appointment-${index}`}
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
                      {appointment.office}
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
      {/* Calendar Section - Flexible viewport-based design */}
      <div className="flex-1 flex flex-col min-h-0 rounded-lg">
        {/* Calendar Body */}
        <div className="bg-white rounded-lg border-2 border-gray-900 flex-1 flex flex-col min-h-0">
          {/* Days of Week */}
          <div className="grid grid-cols-7 shrink-0">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
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
          </div>

        </div>
      </div>


      {/* Appointment Hover Modal */}
      {showAppointmentHoverModal && hoveredAppointment && (
        <div 
          className={`fixed bg-white rounded-[10px] rounded-br-none shadow-lg z-50 pointer-events-none ${
            hoveredAppointment.isViewAll ? 'w-[280px]' : 'w-[210px] h-[153px]'
          }`}
          style={{
            left: `${hoveredAppointment.isViewAll ? hoveredAppointment.position.x - 290 : hoveredAppointment.position.x + 10}px`,
            top: `${hoveredAppointment.position.y - (hoveredAppointment.isViewAll ? (10 + (hoveredAppointment.allAppointments.length * 45) + 12) : 160)}px`
          }}
        >
          {/* Modal Header */}
          <div className="bg-[#122141] rounded-t-[10px] h-9 flex items-center px-4">
            <h3 className="text-white text-[8px] font-bold" style={{ fontFamily: 'Poppins' }}>
              {hoveredAppointment.isViewAll ? 'All Consultation Schedules' : 'Consultation Schedule'}
            </h3>
          </div>

          {/* Modal Content */}
          <div className="p-3 space-y-2">
            {hoveredAppointment.isViewAll ? (
              // Show all appointments when "View all" is hovered
              hoveredAppointment.allAppointments.map((appt) => (
                <div key={appt.id} className="border-b border-gray-200 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                  {/* Name */}
                  <div className="flex items-center gap-2 mb-1">
                    <img src={GradIcon} alt="Graduation Cap" className="w-3 h-3 pr-0" />
                    <span className="text-black text-[9px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{appt.studentName}</span>
                  </div>

                  {/* Office */}
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4L6 1L11 4V9C11 9.26522 10.8946 9.51957 10.7071 9.70711C10.5196 9.89464 10.2652 10 10 10H2C1.73478 10 1.48043 9.89464 1.29289 9.70711C1.10536 9.51957 1 9.26522 1 9V4Z" stroke="#0059FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-black text-[9px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{appt.office}</span>
                  </div>

                   {/* <div className="flex items-center gap-2 mb-1">
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 2H2C1.44772 2 1 2.44772 1 3V9C1 9.55228 1.44772 10 2 10H8C8.55228 10 9 9.55228 9 9V3C9 2.44772 8.55228 2 8 2Z" fill="white"/>
                      <path d="M7 1V3M3 1V3M1 5H9" stroke="#360055" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                    <span className="text-black text-[9px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{appointment.date}</span>
                  </div> */}

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <svg width="9" height="9" viewBox="0 0 10.5 10.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="5.25" cy="5.25" r="4.75" stroke="#9D4400" strokeWidth="1"/>
                      <path d="M5.25 2.625V5.25L7 7" stroke="#9D4400" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-black text-[9px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{appt.time}</span>
                  </div>
                </div>
              ))
            ) : (
              // Show single appointment details
              <>
                {/* Name */}
                <div className="flex items-center gap-2">
                  <img src={GradIcon} alt="Graduation Cap" className="w-3 h-3 pr-0" />
                  <span className="text-black text-[10px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{hoveredAppointment.studentName}</span>
                </div>

                {/* Office */}
                <div className="flex items-center gap-2">
                  <svg width="10" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L6 1L11 4V9C11 9.26522 10.8946 9.51957 10.7071 9.70711C10.5196 9.89464 10.2652 10 10 10H2C1.73478 10 1.48043 9.89464 1.29289 9.70711C1.10536 9.51957 1 9.26522 1 9V4Z" stroke="#0059FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-black text-[10px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{hoveredAppointment.office}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2H2C1.44772 2 1 2.44772 1 3V9C1 9.55228 1.44772 10 2 10H8C8.55228 10 9 9.55228 9 9V3C9 2.44772 8.55228 2 8 2Z" fill="white"/>
                    <path d="M7 1V3M3 1V3M1 5H9" stroke="#360055" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-black text-[10px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{hoveredAppointment.dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2">
                  <svg width="10.5" height="10.5" viewBox="0 0 10.5 10.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="5.25" cy="5.25" r="4.75" stroke="#9D4400" strokeWidth="1"/>
                    <path d="M5.25 2.625V5.25L7 7" stroke="#9D4400" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-black text-[10px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>{hoveredAppointment.time}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default StaffCalendar;