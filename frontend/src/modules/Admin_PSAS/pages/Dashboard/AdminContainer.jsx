import React, { useState } from 'react';
import { NavigationProvider, useNavigation } from '../../../../contexts/NavigationContext.jsx';
import AdminNav from './AdminNav';
import AdminHeader from './AdminHeader';
import AdminDashboardContent from './AdminDashboardContent';
import AdminAnalytics from '../Analytics/AdminAnalytics.jsx';

// Import the other page components for Admin
import AdminConsultationSummary from '../Consultation Summary/AdminConsultationSummary';
import OfficeManagement from '../Office Management/OfficeManagement';

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
        return <AdminDashboardContent />;
      case 'OfficeManagement':
        return <OfficeManagement />;
      case 'ConsultationSummary':
        return <AdminConsultationSummary />;
      case 'Analytics':
        return <AdminAnalytics />;
      default:
        return <AdminDashboardContent />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Navigation Component */}
      <AdminNav />
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0">
          <AdminHeader 
            showEditProfileModal={showEditProfileModal}
            setShowEditProfileModal={setShowEditProfileModal}
            editProfileData={editProfileData}
            handleEditProfileSubmit={handleEditProfileSubmit}
            handleEditProfileCancel={handleEditProfileCancel}
            handleEditProfileChange={handleEditProfileChange}
          />
        </div>

        {/* Dynamic Content Based on Active Page */}
        <div className="flex-1 overflow-hidden bg-[#E9E9E9]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
//Default 
// Dashboard container with all the state management
function AdminContainer() {
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowBookingModal(false);
    setShowSuccessModal(true);
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
        <NavigationProvider module="Admin_PSAS">
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

export default AdminContainer;