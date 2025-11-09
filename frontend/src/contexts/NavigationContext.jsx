import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('Dashboard');

  // Define page titles mapping
  const pageTitles = {
    'Dashboard': 'Student Dashboard',
    'BookedConsultation': 'Booked Consultation',
    'BookingHistory': 'Booking History',
    'FAQs': 'Frequently Asked Questions'
  };

  const navigateToPage = (page) => {
    setActivePage(page);
  };

  const getCurrentPageTitle = () => {
    return pageTitles[activePage] || 'Student Dashboard';
  };

  return (
    <NavigationContext.Provider value={{
      activePage,
      navigateToPage,
      getCurrentPageTitle,
      pageTitles
    }}>
      {children}
    </NavigationContext.Provider>
  );
};