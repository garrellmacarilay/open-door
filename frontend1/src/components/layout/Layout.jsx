import React, { useState } from 'react';
import { cn } from '../../common/utils/cn';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ 
  children, 
  user = null,
  navigation = [],
  className 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header 
        user={user}
        onMenuToggle={handleMenuToggle}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          navigation={navigation}
        />
        
        <main className={cn(
          'flex-1 lg:ml-0',
          className
        )}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
