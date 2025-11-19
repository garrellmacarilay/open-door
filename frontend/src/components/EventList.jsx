import React, { useState } from "react";
import { Pencil } from "lucide-react"

export default function EventList({ events = [], isAdmin, isStaff, onCreateEvent, onEditEvent }) {


  const formatTime = (dateString, timeString) => {
    const dateTime = new Date(`${dateString}T${timeString}`);
    return dateTime.toLocaleTimeString("en-US" ,{
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>

        {/* ✅ Show Create Event button only for Admin */}
        {(isAdmin || isStaff) && (
          <button
            onClick={onCreateEvent}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            + Create Event
          </button>
        )}
      </div>

      <ul className="space-y-3 overflow-y-auto">
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.id} className="border rounded p-3  relative">
              <p className="font-medium">{event.event_title}</p>
              <p className="text-sm text-gray-500">{event.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>{formatDate(event.event_date)}</p>
                <p className="text-gray-400">
                  {formatTime(event.event_date, event.event_time)}
                </p>
              </div>
              {isAdmin ||isStaff && (
                <button
                  onClick={() => onEditEvent(event)}
                  className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center">No events found.</p>
        )}
      </ul>
    </div>
  );
}
