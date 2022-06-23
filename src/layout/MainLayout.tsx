import React from 'react';
import { Outlet } from 'react-router';
import SideNav from '../common/sideNav/SideNav';
import TopBar from '../common/topBar/TopBar';

const MainLayout: React.FC = () => {
  return (
    <div className='w-full flex'>
      <SideNav />
      <div className='w-full'>
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
