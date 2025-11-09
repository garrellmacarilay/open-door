import React from 'react'
import { useState } from 'react';
import StudentNav from '../Dashboard/StudentNav.jsx';
import Header from '../Dashboard/Header.jsx';

function FAQs() {
      const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    
      // Edit Profile form data
      const [editProfileData, setEditProfileData] = useState({
        username: '',
        email: 'garrell.macarilay@student.laverdad.edu.ph',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profilePicture: null
      });
    
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
        // Reset form data
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
      <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
        {/* Sidebar Navigation Component */}
        <StudentNav />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header 
            showEditProfileModal={showEditProfileModal}
            setShowEditProfileModal={setShowEditProfileModal}
            editProfileData={editProfileData}
            handleEditProfileChange={handleEditProfileChange}
            handleEditProfileSubmit={handleEditProfileSubmit}
            handleEditProfileCancel={handleEditProfileCancel}
            />
            
        </div>
      </div>
    </>
  )
}

export default FAQs