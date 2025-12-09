import React from 'react';
import { useNavigation } from '../../../../contexts/NavigationContext';
import StaffNotification from './StaffNotification';
import StaffProfile from './StaffProfile';
import StaffEditProfile from './StaffEditProfile';
import { useProfile } from '../../../../hooks/globalHooks';
import { useState } from 'react';

function StaffHeader() {
  const { getCurrentPageTitle } = useNavigation();
  const {
      user,
      fullName,
      setFullName,
      setProfileAndPreview,
      preview,
      profileImageUrl,
      message,
      handleSubmit
  } = useProfile()

  const [showEditProfileModal, setShowEditProfileModal] = useState(false)

  return (
    <>
      {/* Header */}
      <header className="bg-white h-19! shadow-lg p-4 flex items-center justify-between shrink-0 relative">
        <h1 className="text-black text-3xl! md:text-3xl font-bold" style={{ fontFamily: 'Poppins' }}>
          {getCurrentPageTitle()}
        </h1>
        <div className="flex items-center gap-2!">
          {/* Notification Component */}
          <StaffNotification />
          
          {/* Profile Component */}
          <StaffProfile 
            setShowEditProfileModal={setShowEditProfileModal} 
            profileImageUrl={profileImageUrl || preview} 
            fullName={fullName}
            email={user?.email}
          />
        </div>
      </header>

      {/* Edit Profile Modal Component */}
      <StaffEditProfile 
        showEditProfileModal={showEditProfileModal}
        editProfileData={{
          username: fullName,
          email: user?.email,
          profileImage: preview // live preview
        }}
        handleEditProfileSubmit={handleSubmit}
        handleEditProfileCancel={() => setShowEditProfileModal(false)}
        handleEditProfileChange={(field, value) => {
          if (field === 'username') setFullName(value);
          if (field === 'profileImage') setProfileAndPreview(value); // <-- use the new function
        }}
      />
    </>
  );
}

export default StaffHeader;