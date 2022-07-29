import useLoading from '@/hooks/useLoading';
import { getResolution } from '@/lib/resolution';
import Loader from 'common/Loader/Loader';
import { maximum_screen_height } from 'constants/constants';
import React, { Fragment } from 'react';
import { Outlet } from 'react-router';
import SideNav from '../common/sideNav/SideNav';
import TopBar from '../common/topBar/TopBar';
import ResolutionLayout from './ResolutionLayout';

const MainLayout: React.FC = () => {
  const { width: screenWidth } = getResolution();
  const loader = useLoading();

  return (
    <Fragment>
      {screenWidth < maximum_screen_height ? (
        <ResolutionLayout />
      ) : (
        <div className="flex h-screen">
          {loader && <Loader/>}
          <div className="w-[20%]">
            <SideNav />
          </div>
          <div className="w-full px-20">
            <TopBar />
            <div className="mt-10">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default MainLayout;
