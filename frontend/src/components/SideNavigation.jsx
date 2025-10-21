import { useState } from 'react';
import './SideNavigation.css';
import lvlogo from '../assets/lv-logo.png';
import home from '../assets/home.png';
import calendar from '../assets/calendar.png';
import analytics from '../assets/analytics.png';
import staff from '../assets/staff.png';
import student from '../assets/students.png';

function SideNavigation() {
  const [activeTab, setActiveTab] = useState('calendar');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: home },
    { id: 'calendar', label: 'Calendar', icon: calendar },
    { id: 'analytics', label: 'Analytics', icon: analytics },
    { id: 'staff', label: 'Staff', icon: staff },
    { id: 'student', label: 'Student', icon: student }
  ];

  return (
    <div className="side-navigation">
      <div className="nav-background">
        <div className="nav-content">
          <div className="nav-top">
            <div className="profile-image">
              <img 
                src={lvlogo} 
                alt="Admin Profile" 
                className="profile-img"
              />
            </div>
          </div>
          
          <div className="nav-items">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">
                  <img src={item.icon} alt={item.label} className="nav-icon-img" />
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="nav-bottom">
            <div className="user-profile">
              <img 
                src="https://via.placeholder.com/38x38/4A90E2/FFFFFF?text=EL" 
                alt="User Profile" 
                className="user-img"
              />
              <span className="user-name">Willen Alba</span>
            </div>
            <div className="settings-icon">
              <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
                <path d="M8.5 12.5C10.433 12.5 12 10.933 12 9C12 7.067 10.433 5.5 8.5 5.5C6.567 5.5 5 7.067 5 9C5 10.933 6.567 12.5 8.5 12.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.5 15.5V12.5L3 11L1.5 9.5V6.5L3 5L1.5 3.5V0.5H15.5V3.5L14 5L15.5 6.5V9.5L14 11L15.5 12.5V15.5H1.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;
