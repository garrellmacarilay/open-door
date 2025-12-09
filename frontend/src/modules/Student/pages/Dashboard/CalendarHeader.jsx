import React from 'react';

function CalendarHeader({ 
  currentDate, 
  isAnimating, 
  navigateMonth, 
  getMonthName, 
  openReminder,
  setCurrentDate // Add this prop to directly set the current date
}) {
  const handleTodayClick = () => {
    const today = new Date();
    
    // If setCurrentDate is available, use it to navigate directly
    if (setCurrentDate) {
      setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    } else {
      // Fallback: Calculate the difference in months between current displayed date and today
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      
      const monthDifference = (todayYear - currentYear) * 12 + (todayMonth - currentMonth);
      
      // If not in current month, navigate to today's month
      if (monthDifference !== 0) {
        // Navigate step by step to today's month
        const direction = monthDifference > 0 ? 'next' : 'prev';
        const steps = Math.abs(monthDifference);
        
        // Navigate one month at a time
        for (let i = 0; i < steps; i++) {
          setTimeout(() => {
            navigateMonth(direction);
          }, i * 100); // Reduced delay for faster navigation
        }
      }
    }
  };

  return (
    /* Calendar Header - Following Figma Design */
    <div className="bg-[#142240] mx-4 my-2 text-white rounded-[10px] border border-[#ffffff] flex items-center justify-between h-[55px] px-8 shrink-0">
      {/* Today Button - Left */}
      <button onClick={handleTodayClick} className="flex items-center justify-center gap-2 border border-white! bg-[#142240]! rounded-[10px] px-4 py-2 h-[30px] text-white font-semibold text-[16px] transition-all duration-200 hover:bg-white/10 active:scale-95" style={{ fontFamily: 'Poppins', lineHeight: '1.5em' }}>
        <div className="w-[18px] h-5 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2V6M4 2V6M1 10H17M3 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H3C1.89543 18 1 17.1046 1 16V6C1 4.89543 1.89543 4 3 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span className='text-[13px]'>Today</span>
      </button>

      {/* Month Navigation - Center */}
      <div className="flex items-center gap-8 ">
        {/* Left Button */}
        <button 
          onClick={() => navigateMonth('prev')}
          disabled={isAnimating}
          className={`text-white text-3xl mb-2 font-bold transition-all duration-150 bg-transparent! border-0 ${
            isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          }`}
        >
          ‹
        </button>
        
        <span className={`font-bold text-[18px] text-white transition-all duration-150 ${
          isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`} style={{ fontFamily: 'Inter', lineHeight: '0.5em' }}>
          {getMonthName(currentDate)}
        </span>

        {/* Right Button */}
        <button 
          onClick={() => navigateMonth('next')}
          disabled={isAnimating}
          className={`text-white text-3xl mb-2 font-bold transition-all duration-150 bg-transparent! border-0 ${
            isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          }`}
        >
          ›
        </button>
      </div>
      
      {/* Book Consultation Button - Right */}
      <button 
        onClick={ openReminder }
        className="bg-[#1156E8]! hover:bg-[#0d47c4] rounded-[5px] flex items-center justify-center gap-2 px-2! py-4 h-[38px] transition-colors"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4Z" fill="white"/>
            <path d="M16 2V6M8 2V6M3 10H21" stroke="#1156E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-semibold text-[13px] text-white" style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}>Book a Consultation</span>
      </button>
    </div>
  );
}

export default CalendarHeader;