import React from 'react';
import { useNavigation } from '../../../../contexts/NavigationContext';
import AdminNotification from './AdminNotification';
import AdminProfile from './AdminProfile';
import AdminEditProfile from './AdminEditProfile';

function AdminHeader({ 
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
          <AdminNotification />
          
          {/* Profile Component */}
          <AdminProfile 
            setShowEditProfileModal={setShowEditProfileModal} 
            profileImageUrl={profileImageUrl}
          />
        </div>
      </header>

      {/* Edit Profile Modal Component */}
      <AdminEditProfile 
        showEditProfileModal={showEditProfileModal}
        editProfileData={editProfileData}
        handleEditProfileSubmit={handleEditProfileSubmit}
        handleEditProfileCancel={handleEditProfileCancel}
        handleEditProfileChange={handleEditProfileChange}
      />
    </>
  );
}

export default AdminHeader;