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
          {loader && <Loader />}
          <div className="w-1/4 xl:w-1/5">
            <SideNav />
          </div>
          <div className="w-3/4 xl:w-4/5">
            <TopBar />
            <div className="px-12 xl:px-20  overflow-y-auto layout-screen bg-background-pattern bg-right-top bg-no-repeat">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default MainLayout;
