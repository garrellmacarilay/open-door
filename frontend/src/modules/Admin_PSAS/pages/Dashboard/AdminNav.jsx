import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../../../contexts/NavigationContext';
import PSASLogo from '../../../Student/components/img/PSAS-Logo.png';
import { useLogin } from '../../../../hooks/authHooks';

function AdminNav() {
  const navigate = useNavigate();
  const { activePage, navigateToPage } = useNavigation();

  const handleNavigation = (page) => {
    navigateToPage(page);
  };

  const {handleLogout, loading} = useLogin()

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

          {/* Office Management */}
          <div 
            className={`h-14 flex items-center cursor-pointer transition-all duration-300 ease-out m-0 relative overflow-hidden group ${
              activePage === 'OfficeManagement' 
                ? 'bg-linear-to-r from-purple-600/20 to-transparent border-l-4 border-purple-500 translate-x-2' 
                : 'hover:translate-x-2 hover:bg-linear-to-r hover:from-purple-600/10 hover:to-transparent'
            }`}
            onClick={() => handleNavigation('OfficeManagement')}
          >
            {/* Gradient left border for hover */}
            <div className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b from-purple-400 to-purple-600 transition-all duration-300 ${
              activePage === 'OfficeManagement' ? 'scale-y-100 w-1' : 'scale-y-0 group-hover:scale-y-100 group-hover:w-1'
            }`}></div>
            
            <div className="flex items-center gap-3 px-5 relative z-10">
              <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${
                activePage === 'OfficeManagement' ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-12'
              }`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4H18C18.5523 4 19 4.44772 19 5V17C19 17.5523 18.5523 18 18 18H2C1.44772 18 1 17.5523 1 17V5C1 4.44772 1.44772 4 2 4Z" 
                    className={`transition-all duration-300 ${
                      activePage === 'OfficeManagement' ? 'stroke-purple-400' : 'stroke-white group-hover:stroke-purple-400'
                    }`} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 1V4M13 1V4M1 8H19" 
                    className={`transition-all duration-300 ${
                      activePage === 'OfficeManagement' ? 'stroke-purple-400' : 'stroke-white group-hover:stroke-purple-400'
                    }`} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12H7M5 15H9" 
                    className={`transition-all duration-300 ${
                      activePage === 'OfficeManagement' ? 'stroke-purple-400' : 'stroke-white group-hover:stroke-purple-400'
                    }`} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span 
                className={`font-bold transition-all duration-300 whitespace-nowrap ${
                  activePage === 'OfficeManagement' 
                    ? 'text-white text-[12px]' 
                    : 'text-white text-[12px] group-hover:text-[14px]'
                }`} 
                style={{ fontFamily: 'Poppins', letterSpacing: '-0.02em', lineHeight: '1.5em' }}
              >
                Office Management
              </span>
            </div>
          </div>

          {/* Consultation Summary */}
          <div 
            className={`h-14 flex items-center cursor-pointer transition-all duration-300 ease-out m-0 relative overflow-hidden group ${
              activePage === 'ConsultationSummary' 
                ? 'bg-linear-to-r from-purple-600/20 to-transparent border-l-4 border-purple-500 translate-x-2' 
                : 'hover:translate-x-2 hover:bg-linear-to-r hover:from-purple-600/10 hover:to-transparent'
            }`}
            onClick={() => handleNavigation('ConsultationSummary')}
          >
            {/* Gradient left border for hover */}
            <div className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b from-purple-400 to-purple-600 transition-all duration-300 ${
              activePage === 'ConsultationSummary' ? 'scale-y-100 w-1' : 'scale-y-0 group-hover:scale-y-100 group-hover:w-1'
            }`}></div>
            
            <div className="flex items-center gap-3 px-5 relative z-10">
              <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${
                activePage === 'ConsultationSummary' ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-12'
              }`}>
                <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.89543 3 3 3.89543 3 5V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V5C21 3.89543 20.1046 3 19 3Z" 
                    className={`transition-all duration-300 ${
                      activePage === 'ConsultationSummary' ? 'fill-purple-400' : 'fill-white group-hover:fill-purple-400'
                    }`}/>
                  <path d="M16 1V5M8 1V5M3 9H21" stroke="#122141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span 
                className={`font-bold transition-all duration-300 whitespace-nowrap ${
                  activePage === 'ConsultationSummary' 
                    ? 'text-white text-[14px]' 
                    : 'text-white text-[12px] group-hover:text-[14px]'
                }`} 
                style={{ fontFamily: 'Poppins', letterSpacing: '-0.02em', lineHeight: '1.5em' }}
              >
                Consultation Summary
              </span>
            </div>
          </div>

          {/* Analytics */}
          <div 
            className={`h-14 flex items-center cursor-pointer transition-all duration-300 ease-out m-0 relative overflow-hidden group ${
              activePage === 'Analytics' 
                ? 'bg-linear-to-r from-purple-600/20 to-transparent border-l-4 border-purple-500 translate-x-2' 
                : 'hover:translate-x-2 hover:bg-linear-to-r hover:from-purple-600/10 hover:to-transparent'
            }`}
            onClick={() => handleNavigation('Analytics')}
          >
            {/* Gradient left border for hover */}
            <div className={`absolute left-0 top-0 h-full w-1 bg-linear-to-b from-purple-400 to-purple-600 transition-all duration-300 ${
              activePage === 'Analytics' ? 'scale-y-100 w-1' : 'scale-y-0 group-hover:scale-y-100 group-hover:w-1'
            }`}></div>
            
            <div className="flex items-center gap-3 px-5 relative z-10">
              <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${
                activePage === 'Analytics' ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-12'
              }`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 13L9 7L13 11L17 7" 
                    className={`transition-all duration-300 ${
                      activePage === 'Analytics' ? 'stroke-purple-400' : 'stroke-white group-hover:stroke-purple-400'
                    }`} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 7H13V11" 
                    className={`transition-all duration-300 ${
                      activePage === 'Analytics' ? 'stroke-purple-400' : 'stroke-white group-hover:stroke-purple-400'
                    }`} 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span 
                className={`font-bold transition-all duration-300 whitespace-nowrap ${
                  activePage === 'Analytics' 
                    ? 'text-white text-[14px]' 
                    : 'text-white text-[12px] group-hover:text-[14px]'
                }`} 
                style={{ fontFamily: 'Poppins', letterSpacing: '-0.02em', lineHeight: '1.5em' }}
              >
                Analytics
              </span>
            </div>
          </div>
        </nav>
      </div>

      {/* Logout Section - Bottom */}
      <div className="bg-[#142240] h-[72px] flex items-center justify-center border-y-2 border-white">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 bg-[#142240]! hover:bg-[#122141] transition-colors rounded-lg py-2"
        >
          <span className="font-bold text-[15px] text-white" style={{ fontFamily: 'Poppins', letterSpacing: '-0.02em', lineHeight: '1.5em' }}>{loading ? "Logging out..." : "Logout"}</span>
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

export default AdminNav;