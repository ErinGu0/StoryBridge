import React, { useState } from 'react';

export const Tabs = ({ value, onValueChange, defaultValue, children }) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;
  const handleChange = onValueChange || setInternalValue;

  return (
    <div className="flex flex-col">
      {React.Children.map(children, child => 
        React.cloneElement(child, { value: currentValue, onValueChange: handleChange })
      )}
    </div>
  );
};

export const TabsList = ({ children, value, onValueChange, className }) => {
  return (
    <div className={`inline-flex rounded-lg bg-[#F5EDE6] p-1 ${className}`}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { currentValue: value, onValueChange })
      )}
    </div>
  );
};

export const TabsTrigger = ({ value, currentValue, children, onValueChange, className }) => {
  const isActive = currentValue === value;
  
  return (
    <button
      onClick={() => onValueChange(value)}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        isActive 
          ? 'bg-white text-[#C4785A] shadow-sm' 
          : 'text-[#6B6B6B] hover:text-[#3D3D3D]'
      } ${className}`}
    >
      {children}
    </button>
  );
};