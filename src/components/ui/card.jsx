import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-2xl border border-[#E8DFD5] ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};