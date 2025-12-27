import React from 'react';

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-lg border border-[#E8DFD5] bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-[#6B6B6B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4785A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';