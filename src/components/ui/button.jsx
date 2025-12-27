import React from 'react';

export const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-[#C4785A] text-white hover:bg-[#A86045]',
    outline: 'border border-[#E8DFD5] bg-transparent hover:bg-[#F5EDE6] text-[#3D3D3D]',
    secondary: 'bg-[#8FAE8B] text-white hover:bg-[#7A9A76]',
    ghost: 'hover:bg-[#F5EDE6] text-[#3D3D3D]',
    destructive: 'bg-red-500 text-white hover:bg-red-600'
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-8',
    icon: 'h-10 w-10'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};