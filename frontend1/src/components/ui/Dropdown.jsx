import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../common/utils/cn';

const Dropdown = ({ 
  trigger, 
  children, 
  align = 'left',
  className,
  onOpenChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onOpenChange]);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md animate-slide-down',
            alignClasses[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ 
  children, 
  onClick, 
  className,
  disabled = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownSeparator = ({ className }) => (
  <div className={cn('my-1 h-px bg-secondary-200', className)} />
);

export { Dropdown, DropdownItem, DropdownSeparator };
