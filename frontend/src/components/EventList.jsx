import React from "react";

export default function EventList({ events = [] }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>

      <ul className="space-y-3 overflow-y-auto">
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.id} className="border rounded p-3">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-500">{event.details.office}</p>
              <span
                className="inline-block px-2 py-1 mt-1 rounded text-xs font-semibold capitalize"
                style={{
                  backgroundColor: event.color,
                  color: "white",
                }}
              >
                {event.details.status}
              </span>
              <div className="mt-2 text-sm text-gray-500">
                <p>{formatDate(event.start)}</p>
                <p className="text-gray-400">{formatTime(event.start)}</p>
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
