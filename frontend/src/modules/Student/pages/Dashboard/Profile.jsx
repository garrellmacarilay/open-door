import React, { useState, useEffect } from 'react';
import userProfile from '../../../../components/global-img/user.png';

function Profile({ setShowEditProfileModal, profileImageUrl, fullName, email }) {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleProfileClick = () => {
    setShowProfileModal(!showProfileModal);
  };

  const handleEditProfileClick = () => {
    setShowProfileModal(false);
    setShowEditProfileModal(true);
  };

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-modal') && !event.target.closest('.profile-button')) {
        setShowProfileModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const imageToShow = profileImageUrl || `https://ui-avatars.com/api/?name=${fullName || 'User'}`;


  return (
    <div className="relative">
        <button 
          onClick={handleProfileClick}
          className="profile-button flex items-center gap-4 bg-white! p-1"
        >
          {/* User Icon */}
          <img
            src={imageToShow}
            alt="Profile"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = userProfile; }}
            className="w-10 h-10 rounded-full object-cover"
          />
        <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 4L9 1" stroke="#0A090B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="profile-modal absolute top-14 -right-2 w-64 bg-white rounded-lg shadow-2xl border z-50 overflow-hidden">
          {/* Modal Header - Dark Blue Section */}
          <div className="bg-[#142240] h-17 relative">
            {/* User Info */}
            <div className="flex flex-row items-center p-4">
            {/* User Icon */}
            <img
              src={imageToShow}
              alt="Profile"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = userProfile; }}
              className="w-10 ml-1 h-10 bg-gray-300 rounded-full overflow-hidden object-cover"
            />
            {/* User Info */}
              <div className="flex ml-2 flex-col">
                <p className="font-normal text-xs text-white" style={{ fontFamily: 'Poppins' }}>{fullName || "No Name Set"}</p>
                <p className="text-[8px] text-white" style={{ fontFamily: 'Poppins' }}>{email || "No Email"}</p>
              </div>
            </div>
          </div>

          {/* Modal Content - White Section */}
          <div className="p-4">
            {/* Edit Profile Button */}
            <button 
              onClick={handleEditProfileClick}
              className="flex items-center gap-2 p-2 bg-white! hover:bg-gray-100 rounded transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 16H4L13.5 6.5C13.8978 6.10217 14.1213 5.56261 14.1213 5C14.1213 4.43739 13.8978 3.89783 13.5 3.5C13.1022 3.10217 12.5626 2.87868 12 2.87868C11.4374 2.87868 10.8978 3.10217 10.5 3.5L1 13V16Z" stroke="#008CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5 3.5L13.5 6.5" stroke="#008CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-black text-sm font-medium" style={{ fontFamily: 'Poppins' }}>Edit Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;