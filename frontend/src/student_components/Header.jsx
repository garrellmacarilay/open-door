import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-4">
      <h2 className="text-xl font-semibold">Student Dashboard</h2>

      <div className="flex items-center gap-3">
        <button className="relative">
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5.098M9 21h6"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium">Garrell Macatol</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
          <img
            src="/profile.png"
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        </div>
      </div>
    </header>
  );
}
