import React, { useState, useMemo, useRef, useEffect } from 'react';
import GradIcon from '../../../../components/global-img/graduation-cap.svg';
// We don't need the hook here anymore because data is passed via props
// but if you prefer keeping it, that's fine. I will use the props 'bookedAppointments'

function StaffCalendar({ 
  currentDate, 
  isAnimating, 
  bookedAppointments, // Data passed from parent
  events              // Data passed from parent
}) {
  const [showAppointmentHoverModal, setShowAppointmentHoverModal] = useState(false);
  const [hoveredAppointment, setHoveredAppointment] = useState(null);
  const hoverTimeoutRef = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // ---------------------------------------------------------
  // 1. MERGE & PROCESS DATA (Appointments + Events)
  // ---------------------------------------------------------
  const itemsByDate = useMemo(() => {
    const map = {};
    const dateKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    // A. Process Appointments
    (bookedAppointments || []).forEach((appt) => {
      const apptDate = new Date(appt.start);
      const localDate = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate());
      const key = dateKey(localDate);

      const normalized = {
        id: appt.id,
        type: 'appointment', // Mark as appointment
        office: appt.details?.office || 'Unknown',
        studentName: appt.details?.student || 'Unknown',
        status: appt.details?.status || 'pending',
        dateObj: apptDate,
        time: apptDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        dateString: localDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };

      if (!map[key]) map[key] = [];
      map[key].push(normalized);
    });

    // B. Process Events (Safe Parsing)
    (events || []).forEach((event) => {
      if (!event.event_date) return;

      // Manual split to avoid timezone shifts
      const [y, m, d] = event.event_date.split('-').map(Number);
      
      let hours = 8, minutes = 0;
      if (event.event_time) {
         [hours, minutes] = event.event_time.split(':').map(Number);
      }

      // Create date (Month is 0-indexed)
      const eventDate = new Date(y, m - 1, d, hours, minutes);
      
      if (isNaN(eventDate.getTime())) return;

      const localDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const key = dateKey(localDate);

      const normalized = {
        id: event.id || `evt-${Math.random()}`,
        type: 'event', // Mark as event
        title: event.event_title || 'School Event',
        description: event.description || '',
        dateObj: eventDate,
        time: eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        dateString: localDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      };

      if (!map[key]) map[key] = [];
      map[key].push(normalized);
    });

    // Sort by time
    Object.keys(map).forEach(k => {
      map[k].sort((a, b) => a.dateObj - b.dateObj);
    });

    return map;
  }, [bookedAppointments, events]);

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-[#15803D]';
      case 'pending':
        return 'bg-[#B45309]';
      case 'declined':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      case 'rescheduled':
        return 'bg-purple-500';
      default:
        return 'bg-[#B45309]'; // default to pending color
    }
  };

  const handleMouseEnter = (e, item, isViewAll = false, allItems = []) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredAppointment({
      ...(isViewAll ? { allAppointments: allItems, isViewAll: true } : item),
      position: { x: rect.left, y: rect.top }
    });
    setShowAppointmentHoverModal(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowAppointmentHoverModal(false);
      setHoveredAppointment(null);
    }, 100);
  };

  // ---------------------------------------------------------
  // Render Logic
  // ---------------------------------------------------------
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const totalCells = 42;
    const daysArray = [];
    const dateKey = (d) => `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1;
      
      if (i < firstDay || dayNumber > daysInMonth) {
        daysArray.push(
          <div key={`empty-${i}`} className="flex-1 bg-white border border-[#EFEFEF]"></div>
        );
      } else {
        const isToday = today.getDate() === dayNumber && 
                        today.getMonth() === currentMonth && 
                        today.getFullYear() === currentYear;
        
        const cellDate = new Date(currentYear, currentMonth, dayNumber);
        const dayKey = dateKey(cellDate);
        const dayItems = itemsByDate[dayKey] || []; // Get Merged Items

        const maxVisible = 2;
        const visibleItems = dayItems.slice(0, maxVisible);
        const hasMore = dayItems.length > maxVisible;
        
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
            
            {/* Items Grid */}
            {dayItems.length > 0 && (
              <div className="absolute bottom-1 left-1 right-1 space-y-0.5">
                {visibleItems.map((item, index) => (
                  <div 
                    key={item.id || index}
                    className={`${item.type === 'event' ? 'bg-[#122141]' : getStatusColor(item.status)} rounded-[3px] px-1 py-0.5 flex items-center justify-center cursor-pointer z-10`}
                    onMouseEnter={(e) => handleMouseEnter(e, item)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.type === 'event' ? (
                       // Event Pill
                       <div className="flex items-center gap-1">
                          <img src={GradIcon} alt="Event" className="w-3 h-3 invert brightness-0 filter" style={{filter: 'brightness(0) invert(1)'}} /> 
                          <span className="text-white text-[9px] font-bold leading-none truncate max-w-[50px]" style={{ fontFamily: 'Poppins' }}>
                            {item.title}
                          </span>
                       </div>
                    ) : (
                       // Appointment Pill
                       <span className="text-white text-[10px] font-bold leading-none" style={{ fontFamily: 'Poppins' }}>
                         {item.office}
                       </span>
                    )}
                  </div>
                ))}
                
                {hasMore && (
                  <div 
                    className="bg-[#122141] rounded-[3px] px-1 py-0.5 flex items-center justify-center cursor-pointer z-10"
                    onMouseEnter={(e) => handleMouseEnter(e, null, true, dayItems)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="text-white text-[12px] font-bold leading-none" style={{ fontFamily: 'Poppins' }}>
                      View all ({dayItems.length})
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
      <div className="flex-1 flex flex-col min-h-0 rounded-lg">
        <div className="bg-white rounded-lg border-2 border-gray-900 flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-7 shrink-0">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
              <div key={day} className={`bg-gray-50 border border-[#EFEFEF] h-[34px] flex items-center justify-center ${index === 0 ? 'rounded-tl-[10px]' : index === 6 ? 'rounded-tr-[10px]' : ''}`}>
                <span className="text-black text-[15px] font-semibold" style={{ fontFamily: 'Inter' }}>{day}</span>
              </div>
            ))} 
          </div>
          <div className={`flex-1 flex flex-col min-h-0 transition-all duration-150 ${isAnimating ? 'opacity-50 scale-98' : 'opacity-100 scale-100'}`}>
            {Array.from({ length: 6 }, (_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex-1 flex">
                {renderCalendar().slice(rowIndex * 7, (rowIndex + 1) * 7)}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="p-2 border-t border-gray-200 flex gap-4 shrink-0 text-black!">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#15803D] rounded-full"></div>
              <span className="text-xs" style={{ fontFamily: 'Poppins' }}>Approved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#B45309] rounded-full"></div>
              <span className="text-xs" style={{ fontFamily: 'Poppins' }}>Pending</span>
            </div>
            {/* Added Event Legend */}
            <div className="flex items-center gap-1">
               <img src={GradIcon} className="w-3 h-3" alt="event"/>
               <span className="text-xs" style={{ fontFamily: 'Poppins' }}>Event</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Modal */}
      {showAppointmentHoverModal && hoveredAppointment && (
        <div 
          className={`fixed bg-white rounded-[10px] rounded-br-none shadow-lg z-50 pointer-events-none border border-gray-200 ${
            hoveredAppointment.isViewAll ? 'w-[280px]' : 'w-[210px]'
          }`}
          style={{
            left: `${hoveredAppointment.isViewAll ? hoveredAppointment.position.x - 290 : hoveredAppointment.position.x + 10}px`,
            top: `${hoveredAppointment.position.y - 100}px` 
          }}
        >
          <div className="bg-[#122141] rounded-t-[10px] h-9 flex items-center px-4">
            <h3 className="text-white text-[8px] font-bold" style={{ fontFamily: 'Poppins' }}>
              {hoveredAppointment.isViewAll ? 'All Schedules' : (hoveredAppointment.type === 'event' ? 'Event Details' : 'Consultation Schedule')}
            </h3>
          </div>

          <div className="p-3 space-y-2">
            {hoveredAppointment.isViewAll ? (
              // List View
              hoveredAppointment.allAppointments.map((item, index) => (
                <div key={item.id || index} className="border-b border-gray-200 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                  {item.type === 'event' ? (
                     // Event List Item
                     <div className="flex items-center gap-2 mb-1">
                        <img src={GradIcon} alt="Graduation Cap" className="w-3 h-3 pr-0" />
                        <span className="text-black text-[9px] font-bold">{item.title}</span>
                     </div>
                  ) : (
                     // Appointment List Item
                     <div className="flex items-center gap-2 mb-1">
                        <img src={GradIcon} alt="Graduation Cap" className="w-3 h-3 pr-0" />
                        <span className="text-black text-[9px] font-medium">{item.studentName}</span>
                     </div>
                  )}
                  {/* Time / Extra Info */}
                  <span className="text-gray-500 text-[8px] block ml-5">{item.time}</span>
                </div>
              ))
            ) : (
              // Single Item View
              <>
                {hoveredAppointment.type === 'event' ? (
                  // Single Event View
                  <>
                    <div className="flex items-center gap-2">
                       <img src={GradIcon} className="w-3 h-3" alt="event" />
                       <span className="text-black text-[10px] font-bold">{hoveredAppointment.title}</span>
                    </div>
                    {hoveredAppointment.description && (
                       <p className="text-gray-600 text-[8px] mt-1">{hoveredAppointment.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-gray-500 text-[8px]">{hoveredAppointment.dateString} at {hoveredAppointment.time}</span>
                    </div>
                  </>
                ) : (
                  // Single Appointment View (Existing)
                  <>
                    <div className="flex items-center gap-2">
                      <img src={GradIcon} alt="Graduation Cap" className="w-3 h-3 pr-0" />
                      <span className="text-black text-[10px] font-medium">{hoveredAppointment.studentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-black text-[10px] font-medium">Office: {hoveredAppointment.office}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-black text-[10px] font-medium">Time: {hoveredAppointment.time}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default StaffCalendar;