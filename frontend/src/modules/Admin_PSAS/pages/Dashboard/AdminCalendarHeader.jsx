import React, { useState } from 'react';

function AdminCalendarHeader({ 
  currentDate, 
  isAnimating, 
  navigateMonth, 
  setShowReminderModal,
  goToToday,
  selectedOffice = "All Offices",
  onOfficeChange,
  offices = [
    "All Offices",
    "Communications",
    "Guidance and Counseling", 
    "Medical and Dental Services",
    "Sports Development and Management",
    "Student Assistance and Experiential Education",
    "Student Discipline",
    "Student Internship",
    "Student IT Support and Services",
    "Student Organization",
    "Student Publication"
  ]
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getMonthName = (date) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleOfficeSelect = (office) => {
    onOfficeChange?.(office);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    /* Calendar Header - Following Figma Design */
    <div className="bg-[#142240] my-2 text-white rounded-[10px] border border-[#ffffff] flex h-12 items-center">
      
      {/* Left Section - Month Navigation */}
      <div className="flex-1 flex items-center justify-start relative pl-2 gap-42">
        {/* Left Button */}
        <button 
          onClick={() => navigateMonth('prev')}
          disabled={isAnimating}
          className={`text-white text-base font-bold transition-all duration-150 whitespace-nowrap overflow-hidden ${
            isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          }`}
        >
          ‹  Previous
        </button>
        
        <span className={`font-bold text-[15px] text-white transition-all duration-150 whitespace-nowrap overflow-hidden ${
          isAnimating ? 'opacity-50 scale-85' : 'opacity-100 scale-100'
        }`} style={{ fontFamily: 'Inter', lineHeight: '1.0em' }}>
          {getMonthName(currentDate)}
        </span>

        {/* Right Button */}
        <button 
          onClick={() => navigateMonth('next')}
          disabled={isAnimating}
          className={`text-white text-base font-bold transition-all duration-150 bg-transparent! border-transparent! whitespace-nowrap overflow-hidden ${
            isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          }`}
        > 
          Next  ›
        </button>
      </div>

      {/* Right Section - Office Filter */}
      <div className="flex-1 flex items-center justify-end relative pr-2">
        {/* Dropdown Container */}
        <div className="relative">
          {/* Dropdown Button */}
          <button
            onClick={toggleDropdown}
            className="bg-[#d7d7d7]! rounded-[10px] w-[282px]! h-[34px] flex items-center justify-center gap-[65px] px-2.5 hover:bg-gray-200 transition-colors"
          >
            <span 
              className="text-[#848484]! font-medium text-[15px] flex-1 text-left whitespace-nowrap overflow-hidden"
              style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
            >
              {selectedOffice}
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
              {offices.map((office, index) => (
                <button
                  key={index}
                  onClick={() => handleOfficeSelect(office)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 ${
                    office === selectedOffice ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  } ${index === 0 ? 'rounded-t-[10px]' : ''} ${index === offices.length - 1 ? 'rounded-b-[10px]' : ''}`}
                  style={{ fontFamily: 'Inter' }}
                >
                  <span className="text-[12px] font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
                    {office}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Overlay to close dropdown when clicking outside */}
        {isDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminCalendarHeader;