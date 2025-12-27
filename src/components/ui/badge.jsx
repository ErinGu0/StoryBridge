import React from 'react';

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-[#C4785A] text-white',
    outline: 'border border-[#E8DFD5] text-[#6B6B6B]',
    secondary: 'bg-[#8FAE8B] text-white'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};