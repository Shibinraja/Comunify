import { getResolution } from '@/lib/resolution';
import Footer from 'common/footer';
import Header from 'common/header';
import { maximum_screen_height } from 'constants/constants';
import React, { Fragment } from 'react';
import { Outlet } from 'react-router';
import ResolutionLayout from './ResolutionLayout';

const AuthLayout: React.FC = () => {
  const {width:screenWidth} = getResolution();

    return (
        <Fragment>
            {screenWidth < maximum_screen_height ? (
                <ResolutionLayout />
            ) : (
                <div>
                    <Header />
                    <Outlet />
                    <Footer />
                </div>
            )}
        </Fragment>
    );
};

export default AuthLayout;
