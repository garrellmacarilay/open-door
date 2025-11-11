// src/office/OfficeEventList.jsx
import React from "react";

export default function OfficeEventList({ events = [] }) {
  const formatTime = (dateString, timeString) => {
    const dateTime = new Date(`${dateString}T${timeString}`);
    return dateTime.toLocaleTimeString("en-US", {
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
      <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>

      <ul className="space-y-3 overflow-y-auto">
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.id} className="border rounded p-3">
              <p className="font-medium">{event.event_title}</p>
              <p className="text-sm text-gray-500">{event.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>{formatDate(event.event_date)}</p>
                <p className="text-gray-400">
                  {formatTime(event.event_date, event.event_time)}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center">No events found.</p>
        )}
      </ul>
    </div>
  );
}
