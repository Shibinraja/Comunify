import * as React from 'react';

export const TabSelector = ({
  isActive,
  children,
  onClick,
  style,
  styleInActive,
  styleActive
}: {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  style?: string;
  styleInActive?: string;
  styleActive?: string;
}) => (
  <button
    className={` bg-none shadow-none group inline-flex items-center  border-b-2 font-medium leading-5 
    cursor-pointer whitespace-nowrap  font-Poppins ${style} ${
    isActive ? ` ${styleActive} focus:outline-none` : ` ${styleInActive}  text-gray-500  focus:text-gray-600 focus:border-gray-300`
  }`}
    onClick={onClick}
  >
    {children}
  </button>
);
