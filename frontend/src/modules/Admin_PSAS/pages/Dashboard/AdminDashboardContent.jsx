import React, { useState, useEffect } from 'react';
import AdminCalendarFilter from './AdminCalendarFilter';
import AdminDynamicStats from './AdminDynamicStats';
import AdminCalendarHeader from './AdminCalendarHeader';
import AdminUpcomingAppointments from './AdminUpcomingAppointments';
import AdminUpcomingEvents from './AdminUpcomingEvents';
import AdminCalendar from './AdminCalendar';
import { useAdminAppointments, useAdminOfficeAppointments } from '../../../../hooks/adminHooks';
import { useEvents } from '../../../../hooks/globalHooks';

function AdminDashboardContent() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAnimating, setIsAnimating] = useState(false);
    
    //upcoming appointments in the sidebar
    const { appointments: upcomingAppointments, loading: upcomingLoading, error: upcomingError } = useAdminAppointments();
    const { events, fetchEvents } = useEvents()

    useEffect(() => {
      fetchEvents()
    }, [])

    //calendar and filtering
    const {
      offices,
      calendarAppointments,
      stats,
      appointments: officeAppointments,
      selectedOfficeId,
      handleOfficeChange,
      loading: calendarLoading,
      error: calendarError
    } = useAdminOfficeAppointments()   

    const handleDateNavigation = (direction) => {
      if (isAnimating) return;
      
      setIsAnimating(true);
      const newDate = new Date(currentDate);
      
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      
      setCurrentDate(newDate);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    };

    const goToToday = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentDate(new Date());
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    };

    return (
      <div className="flex flex-col h-full ">
        {/* Calendar Header */}

        {/* Main Content Grid */}
        <div className="flex-1 px-4 pb-4 flex gap-6 overflow-hidden min-h-0 ">
          {/* Calendar Section - Flexible sizing */}
          <div className="flex-1 min-w-0 flex flex-col min-h-0">
            {/* Dynamic Stats */}
            <AdminDynamicStats 
               todayConsultations={stats.today}
               pendingApprovals={stats.pending}
               thisMonth={stats.month}
            />
            {/* Calendar Filter */}
            <AdminCalendarFilter className="m-4" 
              offices={offices}
              selectedOffice={selectedOfficeId}
              onOfficeChange={handleOfficeChange}
            />
            {/* Calendar Header */}
            <AdminCalendarHeader 
                currentDate={currentDate}
                navigateMonth={handleDateNavigation}
                setShowReminderModal={() => {}} // Add placeholder function
                goToToday={goToToday}
                isAnimating={isAnimating}
            />
            {/* Admin Calendar */}
            <AdminCalendar 
              currentDate={currentDate}
              calendarAppointments={calendarAppointments}
              setBookedAppointments={() => {}}
              isAnimating={isAnimating}
            />
          </div>
          
          {/* Right Column - Upcoming Consultations and Events */}
          <div className="w-80 flex flex-col gap-4 shrink-0 min-h-0">
            {/* Upcoming Consultations */}
            <div className="flex-1 min-h-0 mt-2">
              <AdminUpcomingAppointments upcomingEvents={upcomingAppointments} />
            </div>
            
            {/* Upcoming Events */}
            <div className="flex-1 min-h-0">
              <AdminUpcomingEvents 
                
              />
            </div>
          </div>
        </div>
      </div>
    );
}

export default AdminDashboardContent;