import React, { useRef, useState } from 'react';
import UplaodIcon from "../../../../components/global-img/upload.svg";

function EditProfile({ 
  showEditProfileModal, 
  editProfileData, 
  handleEditProfileSubmit,
  handleEditProfileCancel,
  handleEditProfileChange 
}) {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle file selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, JPG, PNG, or GIF)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Notify parent component about the image change
      if (handleEditProfileChange) {
        handleEditProfileChange('profileImage', file);
      }
    }
  };

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!showEditProfileModal) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
      <div className="edit-profile-modal bg-white rounded-lg w-[532px] h-[649px] relative shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#142240] rounded-t-lg h-[70px] flex items-center px-8">
          <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Inter' }}>Edit Profile</h2>
        </div>

        {/* Modal Content */}
        <div className="p-4 px-7 h-full overflow-y-auto">
          <form onSubmit={handleEditProfileSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              {/* Profile Picture */}
              <div className="w-25 h-25 bg-gray-300 rounded-full border-3 border-[#D0D0D0] bg-cover bg-center overflow-hidden mt-6"
                   style={{
                     backgroundImage: imagePreview 
                       ? `url(${imagePreview})` 
                       : editProfileData.profileImage 
                       ? `url(${editProfileData.profileImage})` 
                       : 'url(${profile})'
                   }}>
              </div>
              
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                className="hidden"
              />
              
              {/* Upload Button */}
              <button
                type="button"
                onClick={handleUploadClick}
                className="flex items-center gap-2 px-4 py-1! border-2 border-[#E3E3E3] rounded-5 bg-white! hover:bg-gray-50 transition-colors"
              >
                <img src={UplaodIcon} alt="Upload Icon" className="w-4 h-4" />
                <span className="text-black text-sm font-medium" style={{ fontFamily: 'Inter' }}>
                  {imagePreview ? 'Change Picture' : 'Upload New Picture'}
                </span>
              </button>
              
            </div>

            {/* Divider Line */}
            <hr className="border-[#D0D0D0] my-6" />

            {/* Username Field */}
            <div className="space-y-0 m-2">
              <label className="block text-black text-sm font-medium" style={{ fontFamily: 'Inter' }}>
                Username
              </label>
              <input
                type="text"
                value={editProfileData.username}
                onChange={(e) => handleEditProfileChange('username', e.target.value)}
                className="w-full h-10 px-3 border border-[#E2E8F0] rounded-md text-sm text-[#62748E] bg-white"
                style={{ fontFamily: 'Inter' }}
                placeholder="Enter username"
              />
            </div>

            {/* Email Address Field */}
            <div className="space-y-0 m-2">
              <label className="block text-black text-sm font-medium" style={{ fontFamily: 'Inter' }}>
                Email Address
              </label>
              <input
                type="email"
                value={editProfileData.email}
                onChange={(e) => handleEditProfileChange('email', e.target.value)}
                className="w-full h-10 px-3 border border-[#E2E8F0] rounded-md text-sm text-[#020618] bg-white"
                style={{ fontFamily: 'Inter' }}
                placeholder="Enter email address"
              />
            </div>

            {/* Change Password Field */}
            <div className="space-y-0 m-2">
              <label className="block text-black text-sm font-medium" style={{ fontFamily: 'Inter' }}>
                Change Password
              </label>
              <input
                type="password"
                value={editProfileData.newPassword}
                onChange={(e) => handleEditProfileChange('newPassword', e.target.value)}
                className="w-full h-10 px-3 border border-[#E2E8F0] rounded-md text-sm text-[#62748E] bg-white"
                style={{ fontFamily: 'Inter' }}
                placeholder="Enter new password"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-0 m-2">
              <label className="block text-black text-sm font-medium" style={{ fontFamily: 'Inter' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={editProfileData.confirmPassword}
                onChange={(e) => handleEditProfileChange('confirmPassword', e.target.value)}
                className="w-full h-10 px-3 border border-[#E2E8F0] rounded-md text-sm text-[#62748E] bg-white"
                style={{ fontFamily: 'Inter' }}
                placeholder="Confirm new password"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleEditProfileCancel}
                className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-[#0F172B] text-sm font-medium bg-white! hover:bg-gray-50 transition-colors shadow-sm"
                style={{ fontFamily: 'Inter' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 bg-[#155DFC]! rounded-lg text-[#F8FAFC] text-sm font-medium hover:bg-[#0d47c4] transition-colors"
                style={{ fontFamily: 'Inter' }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;