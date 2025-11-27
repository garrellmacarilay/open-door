import React, { useState } from 'react';
import GradIcon from '../../../../components/global-img/graduation-cap.svg';

function AdminCalendar({ currentDate, isAnimating, calendarAppointments = [] }) {
  const [showAppointmentHoverModal, setShowAppointmentHoverModal] = useState(false);
  const [hoveredAppointment, setHoveredAppointment] = useState(null);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

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

        const dayAppointments = calendarAppointments.filter((appointment) => {
          const dateObj = new Date(appointment.start);
          return (
            dateObj.getDate() === dayNumber &&
            dateObj.getMonth() === currentMonth &&
            dateObj.getFullYear() === currentYear
          );
        });

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
            <span
              className={`absolute top-1 right-2 text-sm font-bold ${
                isToday ? 'text-white' : 'text-black'
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              {dayNumber}
            </span>

            {/* Appointment indicators */}
            {dayAppointments.length > 0 && (
              <div className="absolute bottom-1 left-1 right-1 space-y-0.5">
                {visibleAppointments.map((appointment, index) => (
                  <div
                    key={`appointment-${index}`}
                    className="bg-[#FF9500] rounded-[3px] px-1 py-0.5 flex items-center justify-center cursor-pointer z-10"
                    onMouseEnter={(e) => {
                      setHoveredAppointment({
                        ...appointment,
                        position: {
                          x: e.currentTarget.getBoundingClientRect().left,
                          y: e.currentTarget.getBoundingClientRect().top,
                        },
                      });
                      setShowAppointmentHoverModal(true);
                    }}
                    onMouseLeave={() => {
                      setShowAppointmentHoverModal(false);
                      setHoveredAppointment(null);
                    }}
                  >
                    <span
                      className="text-white text-[10px] font-bold leading-none"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      {appointment.serviceType}
                    </span>
                  </div>
                ))}

                {hasMoreAppointments && (
                  <div
                    className="bg-[#122141] rounded-[3px] px-1 py-0.5 flex items-center justify-center cursor-pointer z-10"
                    onMouseEnter={(e) => {
                      setHoveredAppointment({
                        allAppointments: dayAppointments,
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
                      setHoveredAppointment(null);
                    }}
                  >
                    <span
                      className="text-white text-[12px] font-bold leading-none"
                      style={{ fontFamily: 'Poppins' }}
                    >
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
          className={`fixed bg-white rounded-[10px] rounded-br-none shadow-lg z-50 pointer-events-none ${
            hoveredAppointment.isViewAll ? 'w-[280px]' : 'w-[210px] h-[153px]'
          }`}
          style={{
            left: `${
              hoveredAppointment.isViewAll
                ? hoveredAppointment.position.x - 290
                : hoveredAppointment.position.x + 10
            }px`,
            top: `${
              hoveredAppointment.position.y -
              (hoveredAppointment.isViewAll
                ? 10 + hoveredAppointment.allAppointments.length * 45 + 12
                : 160)
            }px`,
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
              hoveredAppointment.allAppointments.map((appointment, index) => (
                <div key={index} className="border-b border-gray-200 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                  {/* Name */}
                  <div className="flex items-center gap-2 mb-1">
                    <img src={GradIcon} alt="Graduation Cap" className="w-3 h-3 pr-0" />
                    <span className="text-black text-[9px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>
                      {appointment.studentName}
                    </span>
                  </div>

                  {/* Office */}
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4L6 1L11 4V9C11 9.26522 10.8946 9.51957 10.7071 9.70711C10.5196 9.89464 10.2652 10 10 10H2C1.73478 10 1.48043 9.89464 1.29289 9.70711C1.10536 9.51957 1 9.26522 1 9V4Z" stroke="#0059FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-black text-[9px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>
                      {appointment.office}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <svg width="9" height="9" viewBox="0 0 10.5 10.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="5.25" cy="5.25" r="4.75" stroke="#9D4400" strokeWidth="1"/>
                      <path d="M5.25 2.625V5.25L7 7" stroke="#9D4400" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-black text-[9px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>
                      {appointment.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Single Appointment */}
                <div className="flex items-center gap-2">
                  <img src={GradIcon} alt="Graduation Cap" className="w-3 h-3 pr-0" />
                  <span className="text-black text-[10px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>
                    {hoveredAppointment.studentName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <svg width="10" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L6 1L11 4V9C11 9.26522 10.8946 9.51957 10.7071 9.70711C10.5196 9.89464 10.2652 10 10 10H2C1.73478 10 1.48043 9.89464 1.29289 9.70711C1.10536 9.51957 1 9.26522 1 9V4Z" stroke="#0059FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-black text-[10px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>
                    {hoveredAppointment.office}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <svg width="10.5" height="10.5" viewBox="0 0 10.5 10.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="5.25" cy="5.25" r="4.75" stroke="#9D4400" strokeWidth="1"/>
                    <path d="M5.25 2.625V5.25L7 7" stroke="#9D4400" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-black text-[10px] font-medium" style={{ fontFamily: 'Inter', letterSpacing: '-2%' }}>
                    {hoveredAppointment.start}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminCalendar;
