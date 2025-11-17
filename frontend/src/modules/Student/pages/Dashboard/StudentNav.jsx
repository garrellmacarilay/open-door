import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../../../contexts/NavigationContext';
import PSASLogo from '../../components/img/PSAS-Logo.png';

import api from '../../../../utils/api';

function StudentNav({ onLogout }) {
  const { activePage, navigateToPage } = useNavigation();
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    navigateToPage(page);
  };
  
  return (
    <div className="w-[250px] bg-[#122141] text-white flex flex-col shrink-0 relative">
      {/* Top Section with darker background */}
      <div className="bg-[#142240] h-[184px] flex items-center justify-center">
        {/* PSAS Logo */}
        <div className="w-[230px]! h-[230px]! flex items-center justify-center">
          <img src={PSASLogo} alt="PSAS Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Main Navigation Section with white border */}
      <div className="flex-1 bg-[#122141] border-t-2 border-white ">
        <nav className="pt-14 px-2 space-y-5">
          {/* Dashboard */}
          <div 
            className={`h-[55px] flex items-center m-0 cursor-pointer transition-all duration-300 ease-out relative overflow-hidden group ${
              activePage === 'Dashboard' 
                ? 'bg-linear-to-r from-purple-600/20 to-transparent border-l-4 border-purple-500 translate-x-2' 
                : 'hover:translate-x-2 hover:bg-linear-to-r hover:from-purple-600/10 hover:to-transparent'
            }`}
            onClick={() => handleNavigation('Dashboard')}
          >
            {/* Gradient left border for hover */}
            <div className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b from-purple-400 to-purple-600 transition-all duration-300 ${
              activePage === 'Dashboard' ? 'scale-y-100 w-1' : 'scale-y-0 group-hover:scale-y-100 group-hover:w-1'
            }`}></div>
            
            <div className="flex items-center gap-3 px-5 relative z-10">
              <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${
                activePage === 'Dashboard' ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-12'
              }`}>
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 8L10 2L18 8V18C18 18.5304 17.7893 19.0391 17.4142 19.4142C17.0391 19.7893 16.5304 20 16 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V8Z" 
                    className={`transition-all duration-300 ${
                      activePage === 'Dashboard' ? 'stroke-purple-400' : 'stroke-white group-hover:stroke-purple-400'
                    }`} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 20V12H12V20" 
                    className={`transition-all duration-300 ${
                      activePage === 'Dashboard' ? 'stroke-purple-400' : 'stroke-white group-hover:stroke-purple-400'
                    }`} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span 
                className={`font-bold transition-all duration-300 whitespace-nowrap ${
                  activePage === 'Dashboard' 
                    ? 'text-white text-[14px]' 
                    : 'text-white text-[12px] group-hover:text-[14px]'
                }`} 
                style={{ fontFamily: 'Poppins', letterSpacing: '-0.02em', lineHeight: '1.5em' }}
              >
                Dashboard
              </span>
            </div>
          </div>

          {/* Booked Consultation */}
          <div 
            className={`h-14 flex items-center cursor-pointer transition-all duration-300 ease-out m-0 relative overflow-hidden group ${
              activePage === 'BookedConsultation' 
                ? 'bg-linear-to-r from-purple-600/20 to-transparent border-l-4 border-purple-500 translate-x-2' 
                : 'hover:translate-x-2 hover:bg-linear-to-r hover:from-purple-600/10 hover:to-transparent'
            }`}
            onClick={() => handleNavigation('BookedConsultation')}
          >
            {/* Gradient left border for hover */}
            <div className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b from-purple-400 to-purple-600 transition-all duration-300 ${
              activePage === 'BookedConsultation' ? 'scale-y-100 w-1' : 'scale-y-0 group-hover:scale-y-100 group-hover:w-1'
            }`}></div>
            
            <div className="flex items-center gap-3 px-5 relative z-10">
              <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${
                activePage === 'BookedConsultation' ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-12'
              }`}>
                <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6L9.5 1L18 6V15C18 15.5304 17.7893 16.0391 17.4142 16.4142C17.0391 16.7893 16.5304 17 16 17H3C2.46957 17 1.96086 16.7893 1.58579 16.4142C1.21071 16.0391 1 15.5304 1 15V6Z" 
                    className={`transition-all duration-300 ${
                      activePage === 'BookedConsultation' ? 'stroke-purple-400' : 'stroke-white group-hover:stroke-purple-400'
                    }`} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span 
                className={`font-bold transition-all duration-300 whitespace-nowrap ${
                  activePage === 'BookedConsultation' 
                    ? 'text-white text-[14px]' 
                    : 'text-white text-[12px] group-hover:text-[14px]'
                }`} 
                style={{ fontFamily: 'Poppins', letterSpacing: '-0.02em', lineHeight: '1.5em' }}
              >
                Booked Consultation
              </span>
            </div>
          </div>

          {/* Booking History */}
          <div 
            className={`h-14 flex items-center cursor-pointer transition-all duration-300 ease-out m-0 relative overflow-hidden group ${
              activePage === 'BookingHistory' 
                ? 'bg-linear-to-r from-purple-600/20 to-transparent border-l-4 border-purple-500 translate-x-2' 
                : 'hover:translate-x-2 hover:bg-linear-to-r hover:from-purple-600/10 hover:to-transparent'
            }`}
            onClick={() => handleNavigation('BookingHistory')}
          >
            {/* Gradient left border for hover */}
            <div className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b from-purple-400 to-purple-600 transition-all duration-300 ${
              activePage === 'BookingHistory' ? 'scale-y-100 w-1' : 'scale-y-0 group-hover:scale-y-100 group-hover:w-1'
            }`}></div>
            
            <div className="flex items-center gap-3 px-5 relative z-10">
              <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${
                activePage === 'BookingHistory' ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-12'
              }`}>
                <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.89543 3 3 3.89543 3 5V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V5C21 3.89543 20.1046 3 19 3Z" 
                    className={`transition-all duration-300 ${
                      activePage === 'BookingHistory' ? 'fill-purple-400' : 'fill-white group-hover:fill-purple-400'
                    }`}/>
                  <path d="M16 1V5M8 1V5M3 9H21" stroke="#122141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span 
                className={`font-bold transition-all duration-300 whitespace-nowrap ${
                  activePage === 'BookingHistory' 
                    ? 'text-white text-[14px]' 
                    : 'text-white text-[12px] group-hover:text-[14px]'
                }`} 
                style={{ fontFamily: 'Poppins', letterSpacing: '-0.02em', lineHeight: '1.5em' }}
              >
                Booking History
              </span>
            </div>
          </div>

          {/* FAQs */}
          <div 
            className={`h-14 flex items-center cursor-pointer transition-all duration-300 ease-out m-0 relative overflow-hidden group ${
              activePage === 'FAQs' 
                ? 'bg-linear-to-r from-purple-600/20 to-transparent border-l-4 border-purple-500 translate-x-2' 
                : 'hover:translate-x-2 hover:bg-linear-to-r hover:from-purple-600/10 hover:to-transparent'
            }`}
            onClick={() => handleNavigation('FAQs')}
          >
            {/* Gradient left border for hover */}
            <div className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b from-purple-400 to-purple-600 transition-all duration-300 ${
              activePage === 'FAQs' ? 'scale-y-100 w-1' : 'scale-y-0 group-hover:scale-y-100 group-hover:w-1'
            }`}></div>
            
            <div className="flex items-center gap-3 px-5 relative z-10">
              <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${
                activePage === 'FAQs' ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-12'
              }`}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="8" 
                    className={`transition-all duration-300 ${
                      activePage === 'FAQs' ? 'fill-purple-400' : 'fill-white group-hover:fill-purple-400'
                    }`}/>
                  <path d="M6.09 6.78C6.32677 6.17571 6.76925 5.66824 7.34339 5.34346C7.91753 5.01869 8.58676 4.89954 9.24338 5.0058C9.89999 5.11206 10.5056 5.43713 10.9653 5.92683C11.425 6.41653 11.7143 7.04174 11.79 7.71" stroke="#122141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 13V9" stroke="#122141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span 
                className={`font-bold transition-all duration-300 whitespace-nowrap ${
                  activePage === 'FAQs' 
                    ? 'text-white text-[14px]' 
                    : 'text-white text-[12px] group-hover:text-[14px]'
                }`} 
                style={{ fontFamily: 'Poppins', letterSpacing: '-0.02em', lineHeight: '1.5em' }}
              >
                FAQs
              </span>
            </div>
          </div>
        </nav>
      </div>

      {/* Logout Section - Bottom */}
      <div className="bg-[#142240] h-[72px] flex items-center justify-center border-y-2 border-white">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-5 bg-[#142240]! hover:bg-[#122141] transition-colors rounded-lg py-2"
        >
          <span className="font-bold text-[15px] text-white" style={{ fontFamily: 'Poppins', letterSpacing: '-0.02em', lineHeight: '1.5em' }}>Logout</span>
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

export default StudentNav;
