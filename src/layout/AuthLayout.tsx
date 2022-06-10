import React from 'react';
import { Outlet } from 'react-router';

const AuthLayout: React.FC = () => {
  return (
    <div className='bg-yellow-300'>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
