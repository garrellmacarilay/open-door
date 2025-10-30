import React from 'react';

export default function AdminActions({ user, onLogout }) {
  return (
    <div className="w-72 bg-white border-r border-gray-300 p-6 flex flex-col h-full shadow-lg">
      <h2 className="text-xl font-semibold mb-6">
        👋 {user?.full_name || 'Admin'}
      </h2>

      <div className="mt-auto">
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
