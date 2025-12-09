import React, { useEffect, useState } from 'react';
import CalendarHeader from './CalendarHeader';
import UpcomingAppointments from './UpcomingAppointments';
import UpcomingEvents from './UpcomingEvents';
import Calendar from './Calendar';
import { useAppointments, useBooking, useRecent, useCalendarAppointments } from '../../../../hooks/studentHooks'
import { useBookingModal } from '../../../../hooks/bookingModal'
import { useEvents } from '../../../../hooks/globalHooks';
import BookConsultationModal from '../Booking_Consultation_Form/BookConsultationModal'
import BookingReminderModal from '../Booking_Consultation_Form/BookingReminderModal'
import SuccessModal from '../Booking_Consultation_Form/SuccessModal';

function DashboardContent({ refreshAppointments = 0 }) {
    
    const { appointments, fetchAppointments, refreshNow, hasMore, loading} = useAppointments();;
    const { calendarAppointments, error, refresh: fetchCalendarAppointments } = useCalendarAppointments()
    const { events, fetchEvents } = useEvents()
    const { form, setForm, errors, offices, handleSubmit } = useBooking()
    const { recentBookings, fetchRecentBookings } = useRecent() 
    const { showReminderModal, showBookingModal, showSuccessModal,
      openReminder, closeReminder, openBooking, closeBooking, 
      openSuccess, closeSuccess
    } = useBookingModal()
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAnimating, setIsAnimating] = useState(false);
    const [bookedAppointments, setBookedAppointments] = useState([])

    useEffect(() => {
      if (
        appointments.length === 0 &&
        calendarAppointments.length === 0 &&
        events.length === 0
      ) {
        fetchAppointments(1);
        fetchCalendarAppointments();
        fetchEvents();   
      }
    }, []);

    // Refresh appointments when a new booking is created
    useEffect(() => {
      if (refreshAppointments > 0) {
        fetchAppointments(1);
        fetchCalendarAppointments();
      }
    }, [refreshAppointments])
  
    // Edit Profile form data
    const [editProfileData, setEditProfileData] = useState({
      username: '',
      email: 'garrell.macarilay@student.laverdad.edu.ph',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      profilePicture: null
    });
    
  
    const navigateMonth = (direction) => {
      if (isAnimating) return;
      
      setIsAnimating(true);
      const newDate = new Date(currentDate);
      
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      
      setTimeout(() => {
        setCurrentDate(newDate);
        setIsAnimating(false);
      }, 150);
    };
  
    const getMonthName = (date) => {
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
  
    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };
  

  
    const handleCancel = () => {
      closeBooking()
      // Reset form
      setFormData({
        office: '',
        serviceType: '',
        date: '',
        topic: '',
        groupMembers: '',
        attachment: null
      });
    };
  
    const handleContinueToBooking = () => {
      closeReminder()
      openBooking()
    };
  
    const handleCancelReminder = () => {
      closeReminder()
    };
  
    const handleSuccessContinue = () => {
      closeSuccess()
    };
  
    const handleEditProfileChange = (field, value) => {
      setEditProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    };
  
    const handleEditProfileSubmit = (e) => {
      e.preventDefault();
      // Handle edit profile logic here
      console.log('Edit Profile submitted:', editProfileData);
      setShowEditProfileModal(false);
      // Reset form or show success message
    };
  
    const handleEditProfileCancel = () => {
      setShowEditProfileModal(false);
      // Reset form data setShowReminderModal
      setEditProfileData({
        username: '',
        email: 'garrell.macarilay@student.laverdad.edu.ph',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profilePicture: null
      });
    };

  return (
    <>
    <div className="flex flex-col h-full">
        {/* Calendar Header */}
          <CalendarHeader
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            isAnimating={isAnimating}
            navigateMonth={navigateMonth}
            getMonthName={getMonthName}
            showReminderModal={showReminderModal}
            openReminder={openReminder}
            closeReminder={closeReminder}
          />
        {/* Main Content Grid */}
      <div className="flex-1 px-4 pb-4 flex gap-2 overflow-hidden min-h-0">
        {/*Left Sidebar - Calendar Section */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          {/* Calendar Section */}
          <Calendar 
            currentDate={currentDate}
            isAnimating={isAnimating}
            bookedAppointments={calendarAppointments}
            setBookedAppointments={() => {}}
          />
        </div>

        {/* Right Sidebar - Upcoming Appointments */} 
        <div className="w-80 flex flex-col gap-2 shrink-0 min-h-0 h-full">
          {/* Upcoming Appointments Component */}
          <div className="flex-1 min-h-0 flex">
            <UpcomingAppointments upcomingEvents={appointments} fetchMore={fetchAppointments} hasMore={hasMore}/>
          </div>
          {/* Upcoming Events Component */}
          <div className="flex-1 min-h-0 flex">
            <UpcomingEvents upcomingEvents={events || [] } />
          </div>
        </div>
      </div>
    </div>

      <BookConsultationModal 
        isOpen={showBookingModal}
        onCancel={closeBooking}
        form={form}
        setForm={setForm}
        errors={errors}
        handleSubmit={async (e) => {
          const res = await handleSubmit(e)

          if (res.success) {
            closeBooking();
            openSuccess();

            refreshNow();

            fetchCalendarAppointments()
          }
        }}
        offices={offices}

      />

      <BookingReminderModal 
        isOpen={showReminderModal}
        onContinue={ () => {
          closeReminder();
          openBooking();
        }}
        onCancel={closeReminder}
      />  

      <SuccessModal 
        isOpen={showSuccessModal}
        onContinue={closeSuccess}
      />
      
    </>
  );
}

export default DashboardContent;