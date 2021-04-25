import React from 'react'

interface PopoverProps {
  children: React.ReactNode;
  text: string;
}

export default function Popover({ children, text }: PopoverProps) {
  return (
    <div className="flex flex-col group">
      <div>
        {children}
      </div>
      <div className="fixed transform -translate-y-full -mt-1 invisible opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 group-hover:delay-700">
        <div className="bg-nord-1 p-2 rounded flex justify-center shadow-xl">
          {text}
        </div>
      </div>
    </div>
  )
}
