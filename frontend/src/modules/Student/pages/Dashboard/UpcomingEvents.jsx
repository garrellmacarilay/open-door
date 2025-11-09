import React from 'react';

function UpcomingEvents() {
  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col h-[354px]">
      {/* Header */}
      <div className="bg-[#142240] rounded-t-lg h-[58px] flex items-center px-4 shrink-0">
        <h2 className="text-white text-lg font-bold" style={{ fontFamily: 'Inter' }}>Upcoming Events</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Event Item */}
        <div className="border border-gray-400 rounded-[5px] p-3 mb-4 bg-[rgba(207,226,255,0.25)]">
          {/* Event Title Row */}
          <div className="flex items-center gap-2 mb-2">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8C8.65685 8 10 6.65685 10 5C10 3.34315 8.65685 2 7 2C5.34315 2 4 3.34315 4 5C4 6.65685 5.34315 8 7 8Z" fill="white"/>
              <path d="M7 10C4.79086 10 3 11.7909 3 14H11C11 11.7909 9.20914 10 7 10Z" fill="white"/>
              <path d="M7 8C8.65685 8 10 6.65685 10 5C10 3.34315 8.65685 2 7 2C5.34315 2 4 3.34315 4 5C4 6.65685 5.34315 8 7 8Z" stroke="#360055" strokeWidth="2"/>
              <path d="M7 10C4.79086 10 3 11.7909 3 14H11C11 11.7909 9.20914 10 7 10Z" stroke="#360055" strokeWidth="2"/>
            </svg>
            <span className="font-semibold text-xs text-black" style={{ fontFamily: 'Inter' }}>Mental Health Break</span>
          </div>

          {/* Date Row */}
          <div className="flex items-center gap-2 mb-2">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 3H3C1.89543 3 1 3.89543 1 5V13C1 14.1046 1.89543 15 3 15H11C12.1046 15 13 14.1046 13 13V5C13 3.89543 12.1046 3 11 3Z" fill="white"/>
              <path d="M9 1V5M5 1V5M1 7H13" stroke="#360055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>October 30, 2025</span>
          </div>

          {/* Time Row */}
          <div className="flex items-center gap-2">
            <svg width="14.5" height="14.5" viewBox="0 0 14.5 14.5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7.25" cy="7.25" r="6.25" stroke="#9D4400" strokeWidth="2"/>
              <path d="M7.25 3.625V7.25L9.625 9.625" stroke="#9D4400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs text-black" style={{ fontFamily: 'Inter' }}>8:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpcomingEvents;