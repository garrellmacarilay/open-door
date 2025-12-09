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

const renderContent = () => (
    <>
      {/* ------------------------------------------------------ */}
      {/* 1. PERSISTENT PAGES (Hidden when inactive, never unmounted) */}
      {/* ------------------------------------------------------ */}
      
      {/* Dashboard: Keep this mounted so appointments/stats don't refetch */}
      <div className={`h-full w-full ${activePage === 'Dashboard' || !activePage ? 'block' : 'hidden'}`}>
        <AdminDashboardContent />
      </div>

      {/* Analytics: Keep this mounted so charts don't re-animate/fetch every time */}
      <div className={`h-full w-full ${activePage === 'Analytics' ? 'block' : 'hidden'}`}>
        <AdminAnalytics />
      </div>

      {/* ------------------------------------------------------ */}
      {/* 2. DYNAMIC PAGES (Unmounts when inactive) */}
      {/* ------------------------------------------------------ */}
      
      {/* These will destroy and recreate every time you click them. */}
      {/* Good for ensuring tables show the absolute latest data on click */}
      
      <div className={`h-full w-full ${activePage === 'OfficeManagement' ? 'block' : 'hidden'}`}>
        <OfficeManagement />
      </div>

      <div className={`h-full w-full ${activePage === 'ConsultationSummary' ? 'block' : 'hidden'}`}>
        <AdminConsultationSummary />
      </div>
    </>
  );

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