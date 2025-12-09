import React, { useState } from 'react';

function AdminCalendarFilter({ selectedOffice, onOfficeChange, offices = [] }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOfficeSelect = (office) => {
    const officeId = office ? office.id : null;
    onOfficeChange?.(officeId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectedOfficeName = offices.find((office) => office.id === selectedOffice)?.office_name || "All Offices";

  return (
    <div className="relative w-full mx-0 mt-2">
      {/* Main Filter Container */}
      <div className="bg-white border border-[#C6C6C6] rounded-[10px] w-full h-13 flex items-center justify-end pr-5">
        
        {/* Dropdown Container */}
        <div className="relative">
          {/* Dropdown Button */}
          <button
            onClick={toggleDropdown}
            className="bg-[#d7d7d7]! rounded-[10px] w-66 h-[34px] flex items-center justify-center -gap-3 px-2.5 hover:bg-gray-200 transition-colors"
          >
            <span 
              className="text-[#848484]! font-medium text-[15px] flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
            >
              {selectedOfficeName}
            </span>
            
            {/* Chevron Icon */}
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            >
              <path 
                d="M7 10L12 15L17 10" 
                stroke="#848484" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-[38px] left-0 w-55 bg-white border border-[#C6C6C6] rounded-[10px] shadow-lg z-50 max-h-[300px] overflow-y-auto">
              <button
                onClick={() => handleOfficeSelect(null)} // Pass null to clear filter
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 rounded-t-[10px] ${
                  !selectedOffice ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
                style={{ fontFamily: 'Inter' }}
              >
                <span className="text-[12px] font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
                  All Offices
                </span>
              </button>
              
              {offices.map((office, index) => (
                <button
                  key={index}
                  onClick={() => handleOfficeSelect(office)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 ${
                    office.id === selectedOffice ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  } ${index === 0 ? 'rounded-t-[10px]' : ''} ${index === offices.length - 1 ? 'rounded-b-[10px]' : ''}`}
                  style={{ fontFamily: 'Inter' }}
                >
                  <span className="text-[12px] font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
                    {office.office_name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminCalendarFilter;