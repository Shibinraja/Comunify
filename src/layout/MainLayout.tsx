import { getResolution } from '@/lib/resolution';
import { maximum_screen_height } from 'constants/constants';
import React, { Fragment } from 'react';
import { Outlet } from 'react-router';
import SideNav from '../common/sideNav/SideNav';
import TopBar from '../common/topBar/TopBar';
import ResolutionLayout from './ResolutionLayout';

const MainLayout: React.FC = () => {
    const {width:screenWidth} = getResolution();

    return (
        <Fragment>
            {screenWidth < maximum_screen_height ? (
                <ResolutionLayout />
            ) : (
                <div className="flex w-full h-full">
                    <SideNav />
                    <div className="w-[83%] px-16">
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
