import React from 'react';

export const Progress = ({ value, className }) => {
  return (
    <div className={`h-2 w-full bg-[#F5EDE6] rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-[#C4785A] to-[#E8A98A] rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};