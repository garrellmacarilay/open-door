import React, { useEffect, useState } from 'react';
import CalendarHeader from './CalendarHeader';
import UpcomingAppointments from './UpcomingAppointments';
import UpcomingEvents from './UpcomingEvents';
import Calendar from './Calendar';
import { useAppointments, useEvents, useBooking, useRecent } from '../../../../hooks/studentDashboard'
import { useBookingModal } from '../../../../hooks/bookingModal'
import BookConsultationModal from '../Booking Consultation Form/BookConsultationModal'
import BookingReminderModal from '../Booking Consultation Form/BookingReminderModal'
import SuccessModal from '../Booking Consultation Form/SuccessModal';

function DashboardContent() {
    
    const { appointments, fetchAppointments, upcomingAppointments } = useAppointments()
    const { events, fetchEvents } = useEvents()
    const { form, setForm, errors, offices, handleSubmit, showSuccessModal, setShowSuccessModal} = useBooking()
    const { recentBookings, fetchRecentBookings } = useRecent() 
    const { showReminderModal, showBookingModal,
      openReminder, closeReminder, openBooking, closeBooking, 
      openSuccess, closeSuccess
    } = useBookingModal()
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAnimating, setIsAnimating] = useState(false);
    const [bookedAppointments, setBookedAppointments] = useState([])

    useEffect(() => {
      fetchAppointments()
    }, [])

  // Sync bookedAppointments state with upcomingAppointments
    useEffect(() => {
      if (upcomingAppointments.length > 0) {
        const mappedAppointments = upcomingAppointments.map(a => ({
          id: a.id,
          date: a.date,
          dateString: a.dateString,
          studentName: a.student, // matches Calendar hover
          office: a.office,
          time: a.time
        }));
        setBookedAppointments(mappedAppointments);
      }
    }, [upcomingAppointments]);

    
    // const [errors, setErrors] = useState([])
    // const [offices, setOffices] = useState([])
    // const [form, setForm] = useState({
    //   office_id: '',
    //   service_type: '',
    //   consultation_date: '',
    //   concern_description: '',
    //   uploaded_file_url: null,
    //   group_members: ''
    // })
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    // const [bookedAppointments, setBookedAppointments] = useState([
      // Multiple appointments on November 15th to test the "View all" functionality
      // { 
      //   date: new Date(2025, 10, 15), 
      //   office: 'Communications',
      //   time: '10:00 AM',
      //   studentName: 'Garrell Macarilay'
      // }, // November 15, 2025
      // { 
      //   date: new Date(2025, 10, 15), 
      //   office: 'Student Organization',
      //   time: '11:00 AM',
      //   studentName: 'Garrell Macarilay'
      // }, // November 15, 2025
      // { 
      //   date: new Date(2025, 10, 15), 
      //   office: 'Guidance and Counseling',
      //   time: '1:00 PM',
      //   studentName: 'Garrell Macarilay'
      // }, // November 15, 2025
      // { 
      //   date: new Date(2025, 10, 15), 
      //   office: 'Medical and Dental',
      //   time: '2:00 PM',
      //   studentName: 'Garrell Macarilay'
      // }, // November 15, 2025
      // { 
      //   date: new Date(2025, 10, 15), 
      //   office: 'Library Services',
      //   time: '3:00 PM',
      //   studentName: 'Garrell Macarilay'
      // }, // November 15, 2025
      // { 
      //   date: new Date(2025, 10, 15), 
      //   office: 'IT Support',
      //   time: '4:00 PM',
      //   studentName: 'Garrell Macarilay'
      // }, // November 15, 2025
      // { 
      //   date: new Date(2025, 10, 20), 
      //   office: 'Student Organization',
      //   time: '11:00 AM',
      //   studentName: 'Garrell Macarilay'
      // }, // November 20, 2025
      // { 
      //   date: new Date(2025, 10, 22), 
      //   office: 'Communications',
      //   time: '9:00 AM',
      //   studentName: 'Garrell Macarilay'
      // }, // November 22, 2025
    // ]);
    // const [formData, setFormData] = useState({
    //   office: '',
    //   serviceType: '',
    //   date: '',
    //   topic: '',
    //   groupMembers: '',
    //   attachment: null
    // });
  
    // Edit Profile form data
    const [editProfileData, setEditProfileData] = useState({
      username: '',
      email: 'garrell.macarilay@student.laverdad.edu.ph',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      profilePicture: null
    });
    
    
    const upcomingEvents = [
      // {
      //   id: 1,
      //   studentName: 'Garrell Macarilay',
      //   office: 'Communications',
      //   date: 'October 20, 2025',
      //   time: '10:00 AM',
      //   status: 'Pending',
      //   statusColor: 'bg-orange-500'
      // },
      // {
      //   id: 2,
      //   studentName: 'Eunice Lugtu',
      //   office: 'Student Organization',
      //   date: 'October 22, 2025',
      //   time: '11:00 AM',
      //   status: 'Approved',
      //   statusColor: 'bg-green-500'
      // },
      // {
      //   id: 3,
      //   studentName: 'Vincent Duriga',
      //   office: 'Guidance and Counseling',
      //   date: 'October 24, 2025',
      //   time: '1:00 PM',
      //   status: 'Cancelled',
      //   statusColor: 'bg-red-500'
      // },
      // {
      //   id: 4,
      //   studentName: 'Margarette Calumpiano',
      //   office: 'Medical and Dental Services',
      //   date: 'October 27, 2025',
      //   time: '2:00 PM',
      //   status: 'Approved',
      //   statusColor: 'bg-green-500'
      // }
    ];
  
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
  
    // const handleSubmit = (e) => {
    //   e.preventDefault();
    //   // Handle form submission logic here
    //   console.log('Form submitted:', formData);
      
    //   // Add the new appointment to the calendar
    //   if (formData.date && formData.office) {
    //     const appointmentDate = new Date(formData.date);
    //     const newAppointment = {
    //       date: appointmentDate,
    //       office: formData.office,
    //       time: '9:00 AM', // Default time, can be made dynamic
    //       studentName: 'Garrell Macarilay'
    //     };
    //     setBookedAppointments(prev => [...prev, newAppointment]);
    //   }
      
    //   setShowBookingModal(false);
    //   setShowSuccessModal(true);
    //   // Reset form
    //   setFormData({
    //     office: '',
    //     serviceType: '',
    //     date: '',
    //     topic: '',
    //     groupMembers: '',
    //     attachment: null
    //   });
    // }
  
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
      {/* Calendar Header */}
      <CalendarHeader
        currentDate={currentDate}
        isAnimating={isAnimating}
        navigateMonth={navigateMonth}
        getMonthName={getMonthName}
        showReminderModal={showReminderModal}
        openReminder={openReminder}
        closeReminder={closeReminder}
      />
      
      <div className="flex-1 px-4 pb-4 flex gap-4 overflow-hidden rounded-lg -mr-0.5">
        {/* Calendar Section */}
        <Calendar 
          currentDate={new Date()}
          isAnimating={false}
          bookedAppointments={bookedAppointments}
          setBookedAppointments={setBookedAppointments}
          
        />

        {/* Right Sidebar - Two Modals */}
        <div className="w-80 flex flex-col gap-4 shrink-0 min-h-0">
          {/* Upcoming Appointments Component */}
          <UpcomingAppointments upcomingEvents={appointments} />
          
          {/* Upcoming Events Component */}
          <UpcomingEvents upcomingEvents={events || [] } />
        </div>
      </div>

      {/* Booking Reminder Modal */}
      <BookingReminderModal 
        isOpen={showReminderModal}
        onCancel={closeReminder}
        onContinue={() => {
          closeReminder()
          openBooking()
        }}
      />

      <BookConsultationModal
        isOpen={showBookingModal}
        onCancel={closeBooking}
        form={form}                     
        setForm={setForm}  
        handleSubmit={handleSubmit}
        offices={offices}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onContinue={() => {
          closeBooking()
          closeSuccess()
          window.location.reload()
        } }
      />

      
    </>
  );
}

export default DashboardContent;