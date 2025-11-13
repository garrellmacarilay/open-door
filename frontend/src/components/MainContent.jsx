import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import BookAConsultation from '../testing/BookAConsultation.jsx';
import NotificationModal from '../testing/NotificationModal.jsx';
import EditProfile from './EditProfile.jsx';

export default function MainContent({ isBookingOpen, onCloseBooking, isEditProfileOpen, onCloseEditProfile }) {
  return (
    <div className="flex-1 p-6 overflow-auto ml-0 md:ml-72">
      <p className="text-gray-600 mb-5 text-center">Here’s your consultation calendar.</p>
      <NotificationModal />
      <div className="h-full">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          height="100%"          // takes full height of parent
          contentHeight="auto"   // adjusts to content
        />
      </div>

      {isBookingOpen && (
        <BookAConsultation isOpen={isBookingOpen} onClose={onCloseBooking} />
      )}

      {isEditProfileOpen && (
        <EditProfile isOpen={isEditProfileOpen} onClose={onCloseEditProfile} />
      )}
    </div>
  );
}