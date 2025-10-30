import React from "react";

export default function EventList() {
  const sampleEvents = [
    {
      id: 1,
      student: "Garrell Macatol",
      office: "Communications",
      status: "Pending",
      color: "bg-yellow-400",
      date: "October 28, 2025",
      time: "10:00 AM",
    },
    {
      id: 2,
      student: "Vincent Duriga",
      office: "Guidance & Counseling",
      status: "Cancelled",
      color: "bg-red-500",
      date: "October 24, 2025",
      time: "11:00 AM",
    },
  ];

  return (
    <aside className="w-[350px] bg-white shadow-lg m-4 rounded-lg p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
      <ul className="space-y-3">
        {sampleEvents.map((event) => (
          <li key={event.id} className="border rounded p-3">
            <p className="font-medium text-gray-800">{event.student}</p>
            <p className="text-sm text-gray-500">{event.office}</p>
            <span
              className={`inline-block ${event.color} text-white px-2 py-1 text-xs rounded mt-1`}
            >
              {event.status}
            </span>
            <div className="mt-2 text-sm text-gray-500">
              <p>{event.date}</p>
              <p className="text-gray-400">{event.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
