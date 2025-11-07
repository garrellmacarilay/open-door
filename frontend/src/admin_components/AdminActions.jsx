import React from 'react';
import AdminConsultationSummary from './AdminConsultationSummary';

export default function AdminActions({ user, onLogout, onSelect }) {
  return (
    <div className="w-72 bg-white border-r border-gray-300 p-6 flex flex-col h-full shadow-lg">
      <h2 className="text-xl font-semibold mb-6">
        👋 {user?.full_name || 'Admin'}
      </h2>

      <div className="mt-6 flex flex-col gap-3">

        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
          onClick={() => onSelect("dashboard")}
        >
          Dashboard
        </button>

        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
        >
          Office Management
        </button>

        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
          onClick={() => onSelect("consultation_summary")}
        >
          Consultation Summary
        </button>

        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
        >
          Analytics
        </button>

        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
