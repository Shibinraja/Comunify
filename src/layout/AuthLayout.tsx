import useLoading from '@/hooks/useLoading';
import { getResolution } from '@/lib/resolution';
import Footer from 'common/footer';
import Header from 'common/header';
import Loader from 'common/Loader/Loader';
import { maximum_screen_height } from 'constants/constants';
import React, { Fragment } from 'react';
import { Outlet } from 'react-router';
import ResolutionLayout from './ResolutionLayout';

const AuthLayout: React.FC = () => {
  const { width: screenWidth } = getResolution();
  const loader = useLoading();

  return (
    <Fragment>
      {screenWidth < maximum_screen_height ? (
        <ResolutionLayout />
      ) : (
        <div>
          <Header />
          {loader && <Loader />}
          <Outlet />
          {/* <Footer /> */}
        </div>
      )}
    </Fragment>
  );
};

export default AuthLayout;
