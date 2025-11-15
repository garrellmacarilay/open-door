import React from 'react';

function StaffCalendarHeader({ 
  currentDate, 
  isAnimating, 
  navigateMonth, 
  setShowReminderModal,
  goToToday
}) {
  const getMonthName = (date) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };
  return (
    /* Calendar Header - Following Figma Design */
    <div className="bg-[#142240] mx-0 my-2 text-white rounded-[10px] border border-[#ffffff] flex h-[55px]">
      {/* Today Button - Left */}
      {/* <button onClick={goToToday} className="flex items-center justify-center gap-2 border border-white! bg-[#142240]! rounded-[10px] px-4 py-2 h-[30px] text-white font-semibold text-[16px] transition-all duration-200 hover:bg-white/10 active:scale-95" style={{ fontFamily: 'Poppins', lineHeight: '1.5em' }}>
        <div className="w-[18px] h-5 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2V6M4 2V6M1 10H17M3 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H3C1.89543 18 1 17.1046 1 16V6C1 4.89543 1.89543 4 3 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span className='text-[13px]'>Today</span>
      </button> */}

      {/* Month Navigation - Center */}
      <div className="flex items-center gap-90 justify-center">
        {/* Left Button */}
        <button 
          onClick={() => navigateMonth('prev')}
          disabled={isAnimating}
          className={`text-white text-3xl font-bold transition-all duration-150 bg-transparent! border-0 ${
            isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          }`}
        >
          ‹
        </button>
        
        <span className={`font-bold text-[15px] text-white transition-all duration-150 ${
          isAnimating ? 'opacity-50 scale-85' : 'opacity-100 scale-100'
        }`} style={{ fontFamily: 'Inter', lineHeight: '1.0em' }}>
          {getMonthName(currentDate)}
        </span>

        {/* Right Button */}
        <button 
          onClick={() => navigateMonth('next')}
          disabled={isAnimating}
          className={`text-white text-2xl font-bold transition-all duration-150 bg-transparent! border-0 ${
            isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          }`}
        >
          ›
        </button>
      </div>
      
     
    </div>
  );
}

export default StaffCalendarHeader;