import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children, module = 'Student' }) => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [currentModule, setCurrentModule] = useState(module);

  // Define page titles mapping for different modules
  const modulePageTitles = {
    Student: {
      'Dashboard': 'Student Dashboard',
      'BookedConsultation': 'Booked Consultation',
      'BookingHistory': 'Booking History',
      'FAQs': 'Frequently Asked Questions'
    },
    Staff: {
      'Dashboard': 'Office Dashboard',
      'ConsultationSummary': 'Consultation Summary'
    },
    Admin_PSAS: {
      'Dashboard': 'Admin Dashboard',
      'OfficeManagement': 'Office Management',
      'ConsultationSummary': 'Consultation Summary',
      'Analytics': 'Analytics'
    }
  };

  // Get current module's page titles
  const getCurrentModulePages = () => {
    return modulePageTitles[currentModule] || modulePageTitles.Student;
  };

  const navigateToPage = (page) => {
    setActivePage(page);
  };

  const switchModule = (newModule) => {
    setCurrentModule(newModule);
    setActivePage('Dashboard'); // Reset to dashboard when switching modules
  };

  const getCurrentPageTitle = () => {
    const currentPages = getCurrentModulePages();
    return currentPages[activePage] || `${currentModule} Dashboard`;
  };

  const getModuleHomeTitle = () => {
    return `${currentModule} Dashboard`;
  };

  return (
    <NavigationContext.Provider value={{
      activePage,
      currentModule,
      navigateToPage,
      setActivePage,
      switchModule,
      getCurrentPageTitle,
      getModuleHomeTitle,
      getCurrentModulePages,
      pageTitles: getCurrentModulePages(), // For backward compatibility
      modulePageTitles
    }}>
      {children}
    </NavigationContext.Provider>
  );
};