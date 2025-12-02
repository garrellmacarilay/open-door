import React, { useState, useEffect } from 'react';
import StaffCalendarHeader from './StaffCalendarHeader';
import StaffUpcomingAppointments from './StaffUpcomingAppointments';
import StaffUpcomingEvents from './StaffUpcomingEvents';
import StaffCalendar from './StaffCalendar';
import { useDashboardAppointments } from '../../../../hooks/staffHooks';

function StaffDashboardContent() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAnimating, setIsAnimating] = useState(false);

    const { loading, error, appointments, fetchDashboard } = useDashboardAppointments();

    useEffect(() => {
      fetchDashboard();
    }, [fetchDashboard])
    
    // Staff-specific appointments (consultations they need to handle)
  
    const handleDateNavigation = (direction) => {
      if (isAnimating) return;
      setIsAnimating(true);
      const newDate = new Date(currentDate);
      newDate.setMonth(direction === 'prev' ? newDate.getMonth() - 1 : newDate.getMonth() + 1);
      setCurrentDate(newDate);
      setTimeout(() => setIsAnimating(false), 300);
    };

    const goToToday = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentDate(new Date());
      setTimeout(() => setIsAnimating(false), 300);
    };

    return (
      <div className="flex flex-col h-full ">
        {/* Calendar Header */}

        {/* Main Content Grid */}
        <div className="flex-1 px-4 pb-4 flex gap-6 overflow-hidden min-h-0 ">
          {/* Calendar Section - Flexible sizing */}
          <div className="flex-1 min-w-0 flex flex-col min-h-0">
            <StaffCalendarHeader 
                currentDate={currentDate}
                navigateMonth={handleDateNavigation}
                setShowReminderModal={() => {}} // Add placeholder function
                goToToday={goToToday}
                isAnimating={isAnimating}
            />
            <StaffCalendar 
              currentDate={currentDate}
              bookedAppointments={appointments}
              isAnimating={isAnimating}
            />
          </div>
          
          {/* Right Column - Upcoming Consultations and Events */}
          <div className="w-80 flex flex-col gap-4 shrink-0 min-h-0">
            {/* Upcoming Consultations */}
            <div className="flex-1 min-h-0 mt-2">
              <StaffUpcomingAppointments upcomingEvents={appointments} />
            </div>
            
            {/* Upcoming Events */}
            <div className="flex-1 min-h-0">
              <StaffUpcomingEvents />
            </div>
          </div>
        </div>
      </div>
    );
}

export default StaffDashboardContent;