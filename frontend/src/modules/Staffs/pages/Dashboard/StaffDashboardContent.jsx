import React, { useState } from 'react';
import StaffCalendarHeader from './StaffCalendarHeader';
import StaffUpcomingAppointments from './StaffUpcomingAppointments';
import StaffUpcomingEvents from './StaffUpcomingEvents';
import StaffCalendar from './StaffCalendar';

function StaffDashboardContent() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Staff-specific appointments (consultations they need to handle)
    const [staffConsultations, setStaffConsultations] = useState([
      {
        id: 1,
        date: 'November 15, 2025',
        dateObj: new Date(2025, 10, 15),
        office: 'Guidance and Counseling',
        time: '10:00 AM',
        studentName: 'John Doe',
        topic: 'Academic Advising',
        status: 'Scheduled'
      },
      {
        id: 2,
        date: 'November 15, 2025',
        dateObj: new Date(2025, 10, 15),
        office: 'Guidance and Counseling',
        time: '11:00 AM',
        studentName: 'Jane Smith',
        topic: 'Career Planning',
        status: 'Scheduled'
      },
      {
        id: 3,
        date: 'November 16, 2025',
        dateObj: new Date(2025, 10, 16),
        office: 'Guidance and Counseling',
        time: '2:00 PM',
        studentName: 'Mike Johnson',
        topic: 'Personal Counseling',
        status: 'Scheduled'
      },
      {
        id: 4,
        date: 'November 18, 2025',
        dateObj: new Date(2025, 10, 18),
        office: 'Guidance and Counseling',
        time: '3:00 PM',
        studentName: 'Sarah Wilson',
        topic: 'Academic Support',
        status: 'Pending'
      }
    ]);

    // Staff events (meetings, training, etc.)
    const [staffEvents, setStaffEvents] = useState([
      {
        id: 1,
        date: new Date(2025, 10, 16),
        title: 'Staff Meeting',
        time: '9:00 AM',
        type: 'Meeting',
        location: 'Conference Room A'
      },
      {
        id: 2,
        date: new Date(2025, 10, 17),
        title: 'Training Workshop',
        time: '1:00 PM',
        type: 'Training',
        location: 'Training Center'
      },
      {
        id: 3,
        date: new Date(2025, 10, 20),
        title: 'Department Review',
        time: '10:00 AM',
        type: 'Review',
        location: 'Office'
      }
    ]);

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
            <StaffCalendarHeader 
                currentDate={currentDate}
                navigateMonth={handleDateNavigation}
                setShowReminderModal={() => {}} // Add placeholder function
                goToToday={goToToday}
                isAnimating={isAnimating}
            />
            <StaffCalendar 
              currentDate={currentDate}
              bookedAppointments={staffConsultations}
              setBookedAppointments={setStaffConsultations}
              isAnimating={isAnimating}
            />
          </div>
          
          {/* Right Column - Upcoming Consultations and Events */}
          <div className="w-80 flex flex-col gap-4 shrink-0 min-h-0">
            {/* Upcoming Consultations */}
            <div className="flex-1 min-h-0 mt-2">
              <StaffUpcomingAppointments upcomingEvents={staffConsultations} />
            </div>
            
            {/* Upcoming Events */}
            <div className="flex-1 min-h-0">
              <StaffUpcomingEvents events={staffEvents} />
            </div>
          </div>
        </div>
      </div>
    );
}

export default StaffDashboardContent;