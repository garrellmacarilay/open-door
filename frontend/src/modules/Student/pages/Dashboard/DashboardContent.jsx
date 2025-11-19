import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import UpcomingAppointments from './UpcomingAppointments';
import UpcomingEvents from './UpcomingEvents';
import Calendar from './Calendar';

function DashboardContent() {
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAnimating, setIsAnimating] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [bookedAppointments, setBookedAppointments] = useState([
      // Multiple appointments on November 15th to test the "View all" functionality
      { 
        date: new Date(2025, 10, 15), 
        office: 'Communications',
        time: '10:00 AM',
        studentName: 'Garrell Macarilay'
      }, // November 15, 2025
      { 
        date: new Date(2025, 10, 15), 
        office: 'Student Organization',
        time: '11:00 AM',
        studentName: 'Garrell Macarilay'
      }, // November 15, 2025
      { 
        date: new Date(2025, 10, 15), 
        office: 'Guidance and Counseling',
        time: '1:00 PM',
        studentName: 'Garrell Macarilay'
      }, // November 15, 2025
      { 
        date: new Date(2025, 10, 15), 
        office: 'Medical and Dental',
        time: '2:00 PM',
        studentName: 'Garrell Macarilay'
      }, // November 15, 2025
      { 
        date: new Date(2025, 10, 15), 
        office: 'Library Services',
        time: '3:00 PM',
        studentName: 'Garrell Macarilay'
      }, // November 15, 2025
      { 
        date: new Date(2025, 10, 15), 
        office: 'IT Support',
        time: '4:00 PM',
        studentName: 'Garrell Macarilay'
      }, // November 15, 2025
      { 
        date: new Date(2025, 10, 20), 
        office: 'Student Organization',
        time: '11:00 AM',
        studentName: 'Garrell Macarilay'
      }, // November 20, 2025
      { 
        date: new Date(2025, 10, 22), 
        office: 'Communications',
        time: '9:00 AM',
        studentName: 'Garrell Macarilay'
      }, // November 22, 2025
    ]);
    const [formData, setFormData] = useState({
      office: '',
      serviceType: '',
      date: '',
      topic: '',
      groupMembers: '',
      attachment: null
    });
  
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
      {
        id: 1,
        studentName: 'Garrell Macarilay',
        office: 'Communications',
        date: 'October 20, 2025',
        time: '10:00 AM',
        status: 'Pending',
        statusColor: 'bg-orange-500'
      },
      {
        id: 2,
        studentName: 'Eunice Lugtu',
        office: 'Student Organization',
        date: 'October 22, 2025',
        time: '11:00 AM',
        status: 'Approved',
        statusColor: 'bg-green-500'
      },
      {
        id: 3,
        studentName: 'Vincent Duriga',
        office: 'Guidance and Counseling',
        date: 'October 24, 2025',
        time: '1:00 PM',
        status: 'Cancelled',
        statusColor: 'bg-red-500'
      },
      {
        id: 4,
        studentName: 'Margarette Calumpiano',
        office: 'Medical and Dental Services',
        date: 'October 27, 2025',
        time: '2:00 PM',
        status: 'Approved',
        statusColor: 'bg-green-500'
      }
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
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission logic here
      console.log('Form submitted:', formData);
      
      // Add the new appointment to the calendar
      if (formData.date && formData.office) {
        const appointmentDate = new Date(formData.date);
        const newAppointment = {
          date: appointmentDate,
          office: formData.office,
          time: '9:00 AM', // Default time, can be made dynamic
          studentName: 'Garrell Macarilay'
        };
        setBookedAppointments(prev => [...prev, newAppointment]);
      }
      
      setShowBookingModal(false);
      setShowSuccessModal(true);
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
  
    const handleCancel = () => {
      setShowBookingModal(false);
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
      setShowReminderModal(false);
      setShowBookingModal(true);
    };
  
    const handleCancelReminder = () => {
      setShowReminderModal(false);
    };
  
    const handleSuccessContinue = () => {
      setShowSuccessModal(false);
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
        setShowReminderModal={setShowReminderModal}
      />
      
      <div className="flex-1 px-4 pb-4 flex gap-4 overflow-hidden rounded-lg -mr-0.5">
        {/* Calendar Section */}
        <Calendar className="shadow-lg"
          currentDate={currentDate}
          isAnimating={isAnimating}
          bookedAppointments={bookedAppointments}
          setBookedAppointments={setBookedAppointments}
        />

        {/* Right Sidebar - Two Modals */}
        <div className="w-80 flex flex-col gap-4 shrink-0 min-h-0">
          {/* Upcoming Appointments Component */}
          <UpcomingAppointments upcomingEvents={upcomingEvents} />
          
          {/* Upcoming Events Component */}
          <UpcomingEvents upcomingEvents={upcomingEvents} />
        </div>
      </div>

      {/* Booking Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-[#00000080]  flex items-center justify-center z-50">
          <div className="bg-white rounded-t-[15px] rounded-b-[10px] w-[488px] h-60 relative shadow-lg">
            {/* Modal Header */}
            <div className="bg-[#122141] rounded-t-[10px] w-full h-[84px] flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14" cy="14" r="10.5" stroke="white" strokeWidth="2"/>
                    <path d="M14 9V14L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Inter' }}>
                  Booking Reminder
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 flex flex-col h-40 justify-between">
              <div className="text-center">
                <p className="text-black text-xl font-medium leading-6 mb-0" style={{ fontFamily: 'Inter' }}>
                  Booking a schedule must be done 2 days before the scheduled date.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-0">
                <button
                  onClick={handleCancelReminder}
                  className="border-black! rounded-lg text-[#000000] text-sm font-medium bg-white! hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: 'Inter' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinueToBooking}
                  className=" bg-[#155DFC]! rounded-lg text-white text-sm font-medium hover:bg-[#0d47c4] transition-colors"
                  style={{ fontFamily: 'Inter' }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Consultation Modal */}
      {showBookingModal && (
        <div className="fixed bg-[#00000080] inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px]! w-full max-w-200 max-h-165 overflow-y-auto relative flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#122141] rounded-t-[10px] px-12 py-5 shrink-0">
              <h2 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>
                Book a Consultation
              </h2>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto ">
              <form onSubmit={handleSubmit} className="space-y-2 px-6 ">
                {/* Office Selection */}
                <div className="space-y-1 -pt-3">
                  <label className="block text-black  text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                    Office <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.office}
                      onChange={(e) => handleInputChange('office', e.target.value)}
                      className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] appearance-none"
                      style={{ fontFamily: 'Inter' }}
                      required
                    >
                      <option value="">Select Office</option>
                      <option value="Prefect of Student and Services">Prefect of Student and Services</option>
                      <option value="Guidance and Counseling">Guidance and Counseling</option>
                      <option value="Medical and Dental Services">Medical and Dental Services</option>
                      <option value="Sports Development and Management">Sports Development and Management</option>
                      <option value="Student Assistance and Experiential Education">Student Assistance and Experiential Education</option>
                      <option value="Student Discipline">Student Discipline</option>
                      <option value="Student Internship">Student Internship</option>
                      <option value="Student IT Support and Services">Student IT Support and Services</option>
                      <option value="Student Organization A">Student Organization A</option>
                      <option value="Student Publication">Student Publication</option>
                    </select>
                    
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 16L17.5 20.5L22 16" stroke="#8C8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Type of Service */}
                <div className="space-y-1">
                  <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                    Type of Service <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.serviceType}
                      onChange={(e) => handleInputChange('serviceType', e.target.value)}
                      className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] appearance-none"
                      style={{ fontFamily: 'Inter' }}
                      required
                    >
                      <option value="">Select Service Type</option>
                      <option value="Individual Consultation">Individual Consultation</option>
                      <option value="Group Consultation">Group Consultation</option>
                      <option value="Emergency Consultation">Emergency Consultation</option>
                    </select>
                  </div>
                </div>

                <div className ="flex gap-3 flex-row">
                    {/* Date */}
                  <div className="space-y-1 flex-4">
                    <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm [&::-webkit-calendar-picker-indicator]:filter-[invert(50)]"
                        style={{ fontFamily: 'Inter' }}
                        required
                      />
                    </div>
                  </div>
                    {/* Time */}
                  <div className="space-y-1 flex-1">
                      <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => handleInputChange('startTime', e.target.value)}
                          className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                          style={{ fontFamily: 'Inter' }}
                          required
                        />
                      </div>
                  </div>
                  <div className="space-y-1 flex-2">
                      <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => handleInputChange('endTime', e.target.value)}
                          className="w-full h-9 px-6 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
                          style={{ fontFamily: 'Inter' }}
                          required
                        />
                      </div>
                  </div>

                </div>

                {/* Topic */}
                <div className="space-y-1">
                  <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    placeholder="Provide a brief overview of your concern."
                    className="w-full h-12 px-6 py-3 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] resize-none"
                    style={{ fontFamily: 'Inter' }}
                    required
                  />
                </div>

                {/* Group Members (Optional) */}
                <div className="space-y-1">
                  <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                    Group Members (Optional)
                  </label>
                  <textarea
                    value={formData.groupMembers}
                    onChange={(e) => handleInputChange('groupMembers', e.target.value)}
                    placeholder="Enter your group members' names."
                    className="w-full h-[45px] px-6 py-3 border border-[#9B9999] rounded-[7px] text-[#8C8B8B] text-sm bg-[#FFFCFC] resize-none"
                    style={{ fontFamily: 'Inter' }}
                  />
                </div>

                {/* Attachment (Optional) */}
                <div className="space-y-1">
                  <label className="block text-black text-base font-semibold" style={{ fontFamily: 'Inter' }}>
                    Attachment (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => handleInputChange('attachment', e.target.files[0])}
                      className="w-full h-9 border border-[#9B9999] rounded-10 text-[#8C8B8B] text-sm bg-[#FFFCFC] file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      style={{ fontFamily: 'Inter' }}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 sticky pb-2 rounded-b-[10px]! ">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="border border-[#000000]! rounded-lg text-black! text-xs font-medium bg-white! hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: 'Inter' }}
                  >
                   Cancel
                  </button>
                  <button
                    type="submit"
                    className="justify-center items-center bg-[#155DFC]! rounded-lg text-white text-xs font-medium hover:bg-[#0d47c4] transition-colors"
                    style={{ fontFamily: 'Inter' }}
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-[#00000080] bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[523px] h-[307px] relative shadow-2xl flex flex-col items-center justify-center">
            {/* Success Icon */}
            <div className="w-[60px] h-[60px] flex items-center justify-center mb-4">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="30" fill="#14AE5C"/>
                <path d="M20 30L26.6667 36.6667L40 23.3333" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Success Title */}
            <h2 className="text-[#2ECC71] text-2xl font-bold mb-4" style={{ fontFamily: 'Roboto' }}>
              SUCCESS
            </h2>

            {/* Success Message */}
            <p className="text-[#4A4A4A] text-xl text-center leading-6 mb-8" style={{ fontFamily: 'Roboto' }}>
              Your consultation request has been received.
            </p>

            {/* Continue Button */}
            <button
              onClick={handleSuccessContinue}
              className="w-50 h-12 bg-[#2ECC71]! rounded-lg text-white text-base font-bold hover:bg-[#27AE60] transition-colors"
              style={{ fontFamily: 'Roboto' }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      
    </>
  );
}

export default DashboardContent;