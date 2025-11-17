import React from 'react';
import { useNavigation } from '../../../../contexts/NavigationContext';
import StaffNotification from './StaffNotification';
import StaffProfile from './StaffProfile';
import StaffEditProfile from './StaffEditProfile';

function StaffHeader({ 
  showEditProfileModal, 
  setShowEditProfileModal, 
  editProfileData, 
  handleEditProfileSubmit,
  handleEditProfileCancel,
  handleEditProfileChange,
  profileImageUrl 
}) {
  const { getCurrentPageTitle } = useNavigation();

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-lg p-4 flex items-center justify-between shrink-0 relative">
        <h1 className="text-black text-3xl! md:text-3xl font-bold" style={{ fontFamily: 'Poppins' }}>
          {getCurrentPageTitle()}
        </h1>
        <div className="flex items-center gap-2!">
          {/* Notification Component */}
          <StaffNotification />
          
          {/* Profile Component */}
          <StaffProfile 
            setShowEditProfileModal={setShowEditProfileModal} 
            profileImageUrl={profileImageUrl}
          />
        </div>
      </header>

      {/* Edit Profile Modal Component */}
      <StaffEditProfile 
        showEditProfileModal={showEditProfileModal}
        editProfileData={editProfileData}
        handleEditProfileSubmit={handleEditProfileSubmit}
        handleEditProfileCancel={handleEditProfileCancel}
        handleEditProfileChange={handleEditProfileChange}
      />
    </>
  );
}

export default StaffHeader;