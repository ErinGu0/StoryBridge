import React from 'react';
import { X } from 'lucide-react';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
};

export const DialogContent = ({ children, className }) => {
  return (
    <div className={`relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 ${className}`}>
      {children}
    </div>
  );
};

export const DialogHeader = ({ children }) => {
  return (
    <div className="border-b border-[#E8DFD5] p-6">
      {children}
    </div>
  );
};

export const DialogTitle = ({ children, className }) => {
  return (
    <h2 className={`font-serif text-2xl text-[#3D3D3D] ${className}`}>
      {children}
    </h2>
  );
};