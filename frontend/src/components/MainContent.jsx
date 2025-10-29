import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import BookAConsultation from '../testing/BookAConsultation.jsx';

export default function MainContent({ events, isBookingOpen, onCloseBooking }) {
  return (
    <div className="flex-1 p-6 overflow-auto ml-0 md:ml-72">
      <p className="text-gray-600 mb-5 text-center">Here’s your consultation calendar.</p>

      <div className="h-full">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events.map(event => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            color: event.color,
          }))}
          height="100%"          // takes full height of parent
          contentHeight="auto"   // adjusts to content
        />
      </div>

      {isBookingOpen && (
        <BookAConsultation isOpen={isBookingOpen} onClose={onCloseBooking} />
      )}
    </div>
  );
}