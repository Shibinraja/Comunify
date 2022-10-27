import { decodeToken } from '@/lib/decodeToken';
import { getLocalRefreshToken } from '@/lib/request';
import { getResolution } from '@/lib/resolution';
import SuperAdminSideNav from 'common/sideNav/SuperAdminSideNav';
import { maximum_screen_height } from 'constants/constants';
import { ThemeContextProvider } from 'contexts/ThemeContext';
import React, { Fragment } from 'react';
import { Outlet } from 'react-router';
import SideNav from '../common/sideNav/SideNav';
import TopBar from '../common/topBar/TopBar';
import ResolutionLayout from './ResolutionLayout';

const MainLayout: React.FC = () => {
  const { width: screenWidth } = getResolution();
  const tokenData = getLocalRefreshToken() || null;
  const decodedToken =  decodeToken(tokenData as string);

  return (
    <ThemeContextProvider>
      <Fragment>
        {screenWidth < maximum_screen_height ? (
          <ResolutionLayout />
        ) : (
          <div className="flex h-screen">
            <div className="w-1/4 xl:w-1/5">
              {!decodedToken?.isAdmin ? <SideNav /> : <SuperAdminSideNav/>}
            </div>
            <div className="w-3/4 xl:w-4/5 dark:bg-primaryDark">
              <TopBar />
              <div className="px-12 xl:px-20  overflow-y-auto layout-screen bg-background-pattern bg-right-top bg-no-repeat">
                <Outlet />
              </div>
            </div>
          </div>
        )}
      </Fragment>
    </ThemeContextProvider>
  );
};

export default MainLayout;
