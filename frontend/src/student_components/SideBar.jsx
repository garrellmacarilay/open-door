import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0f172a] text-white flex flex-col justify-between">
      <div>
        <div className="p-6 text-center border-b border-gray-700">
          <img
            src="/logo.png"
            alt="School Logo"
            className="w-20 h-20 mx-auto mb-2"
          />
          <h1 className="text-lg font-semibold">Student Dashboard</h1>
        </div>

        <nav className="mt-6 space-y-2 px-4">
          {["Dashboard", "Booked Consultation", "Booking History", "FAQ"].map(
            (item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {item}
              </button>
            )
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-sm">
          Logout
        </button>
      </div>
    </aside>
  );
}
