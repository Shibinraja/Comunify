import React from 'react';
import { Outlet } from 'react-router';

const MainLayout: React.FC = () => {
  return (
    <div className='font-bold bg-blue-400'>
      <Outlet />
    </div>
  );
};

export default MainLayout;
