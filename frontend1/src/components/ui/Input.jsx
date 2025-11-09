import React from 'react';
import { cn } from '../../common/utils/cn';

const Input = React.forwardRef(({ 
  className, 
  type = 'text', 
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'input',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-accent-500 focus-visible:ring-accent-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-accent-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
