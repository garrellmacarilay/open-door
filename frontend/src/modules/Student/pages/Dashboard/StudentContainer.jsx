import React, { useState } from 'react';
import { NavigationProvider, useNavigation } from '../../../../contexts/NavigationContext.jsx';
import StudentNav from './StudentNav';
import Header from './Header';
import DashboardContent from './DashboardContent';

// Import the other page components
import BookedConsultation from '../../pages/Booked Consultation/BookedConsultation';
import BookingHistory from '../Booking History/BookingHistory.jsx';
import FAQsContent from '../../pages/FAQs/FAQsContent';

import api from '../../../../utils/api.js';
import { useNavigate } from 'react-router-dom'

// Main content component that switches based on active page
function MainContent({ 
  showEditProfileModal, 
  setShowEditProfileModal, 
  editProfileData, 
  handleEditProfileSubmit,
  handleEditProfileCancel,
  handleEditProfileChange,
  showReminderModal,
  setShowReminderModal,
  showBookingModal,
  setShowBookingModal,
  showSuccessModal,
  setShowSuccessModal,
  formData,
  handleInputChange,
  handleSubmit,
  handleCancel,
  handleContinueToBooking,
  handleCancelReminder,
  handleSuccessContinue
}) {
  const { activePage } = useNavigation();

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardContent  />;
      case 'BookedConsultation':
        return <BookedConsultation />;
      case 'BookingHistory':
        return <BookingHistory />;
      case 'FAQs':
        return <FAQsContent />;
      default:
        return <DashboardContent />;
    }
  };

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await api.post('/logout')

      if (res.data.success) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    } catch (err) {
      console.error(err)
      alert('Failed to log out')    
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Navigation Component */}
      <StudentNav onLogout={handleLogout}/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          showEditProfileModal={showEditProfileModal}
          setShowEditProfileModal={setShowEditProfileModal}
          editProfileData={editProfileData}
          handleEditProfileSubmit={handleEditProfileSubmit}
          handleEditProfileCancel={handleEditProfileCancel}
          handleEditProfileChange={handleEditProfileChange}
        />

        {/* Dynamic Content Based on Active Page */}
        {renderContent()}
      </div>

     
    </div>
  );
}
//Default 
// Dashboard container with all the state management
function StudentContainer() {
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState([])
  const [editProfileData, setEditProfileData] = useState({
    username: '',
    email: 'garrell.macarilay@student.laverdad.edu.ph',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePicture: null
  });
  const [formData, setFormData] = useState({
    office: '',
    serviceType: '',
    date: '',
    time: '',
    topic: '',
    groupMembers: '',
    attachment: null
  });

  const handleEditProfileSubmit = () => {
    setShowEditProfileModal(false);
    // Handle profile update logic here
  };

  const handleEditProfileCancel = () => {
    setShowEditProfileModal(false);
    setEditProfileData({
      username: '',
      email: 'garrell.macarilay@student.laverdad.edu.ph',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      profilePicture: null
    });
  };

  const handleEditProfileChange = (field, value) => {
    setEditProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Booking process handlers
  const handleContinueToBooking = () => {
    setShowReminderModal(false);
    setShowBookingModal(true);
  };

  const handleCancelReminder = () => {
    setShowReminderModal(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Form submitted:', formData);
  //   setShowBookingModal(false);
  //   setShowSuccessModal(true);
  //   // Reset form
  //   setFormData({
  //     office: '',
  //     serviceType: '',
  //     date: '',
  //     time: '',
  //     topic: '',
  //     groupMembers: '',
  //     attachment: null
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowBookingModal(false);
    setShowSuccessModal(true);
    try {
      const formData = new FormData()

      formData.append('office_id', form.office_id)
      formData.append('service_type', form.service_type);
      formData.append('consultation_date', form.consultation_date)
      formData.append('concern_description', form.concern_description)
      formData.append('group_members', form.group_members)

      if (form.uploaded_file_url instanceof File){
        formData.append('uploaded_file_url', form.uploaded_file_url)
      }

      await api.post('/bookings', formData, {
        headers: { "Content-Type": 'multipart/form-data'}
      })

      
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert (err.response?.data?.message || 'Failed to book consultation. ');
      }
    }
  }

  const handleCancel = () => {
    setShowBookingModal(false);
    // Reset form
    setFormData({
      office: '',
      serviceType: '',
      date: '',
      time: '',
      topic: '',
      groupMembers: '',
      attachment: null
    });
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
        <NavigationProvider module="Student">
        <MainContent 
            showEditProfileModal={showEditProfileModal}
            setShowEditProfileModal={setShowEditProfileModal}
            editProfileData={editProfileData}
            handleEditProfileSubmit={handleEditProfileSubmit}
            handleEditProfileCancel={handleEditProfileCancel}
            handleEditProfileChange={handleEditProfileChange}
            showReminderModal={showReminderModal}
            setShowReminderModal={setShowReminderModal}
            showBookingModal={showBookingModal}
            setShowBookingModal={setShowBookingModal}
            showSuccessModal={showSuccessModal}
            setShowSuccessModal={setShowSuccessModal}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            handleContinueToBooking={handleContinueToBooking}
            handleCancelReminder={handleCancelReminder}
            handleSuccessContinue={handleSuccessContinue}
        />
        </NavigationProvider>
     
    </>
  );
}

export default StudentContainer;