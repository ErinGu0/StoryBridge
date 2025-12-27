import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './button';

export const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (val) => {
    onValueChange(val);
    setOpen(false);
  };
  
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { 
            value, 
            onClick: () => setOpen(!open) 
          });
        }
        if (child.type === SelectContent && open) {
          return (
            <div className="absolute z-50 min-w-[200px] w-full mt-1 bg-white border border-[#E8DFD5] rounded-lg shadow-lg">
              {React.cloneElement(child, { onSelect: handleSelect })}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export const SelectTrigger = ({ value, onClick, children }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full justify-between"
    >
      {children}
      <ChevronDown className="w-4 h-4 ml-2" />
    </Button>
  );
};

export const SelectContent = ({ children, onSelect }) => {
  return (
    <div className="py-1">
      {React.Children.map(children, child => 
        React.cloneElement(child, { onSelect })
      )}
    </div>
  );
};

export const SelectItem = ({ value, children, onSelect }) => {
  return (
    <div
      className="px-3 py-2 text-sm hover:bg-[#F5EDE6] cursor-pointer"
      onClick={() => onSelect?.(value)}
    >
      {children}
    </div>
  );
};

export const SelectValue = ({ placeholder, children }) => {
  return <span>{children || placeholder}</span>;
};