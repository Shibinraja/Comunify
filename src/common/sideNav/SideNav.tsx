import { getLocalWorkspaceId } from '@/lib/helper';
import Button from 'common/button';
import Input from 'common/input';
import QuickInfo from 'common/quickInfo/QuickInfo';
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import dashboardIcon from '../../assets/images/dashboard.svg';
import dropdownIcon from '../../assets/images/dropdown.svg';
import comunifyLogo from '../../assets/images/Group 2 (1).svg';
import memberIcon from '../../assets/images/members.svg';
import chartIcon from '../../assets/images/pie_chart.svg';
import settingsIcon from '../../assets/images/settings.svg';
import slackIcon from '../../assets/images/slack.svg';
import streamIcon from '../../assets/images/stream.svg';
import activeStreamDarkIcon from '../../assets/images/svg/activities_black_icon.svg';
import dashboardDarkIcon from '../../assets/images/svg/dashboard_black_icon.svg';
import memberDarkIcon from '../../assets/images/svg/members_black_icon.svg';
import reportsDarkIcon from '../../assets/images/svg/reports_black_icon.svg';
import settingsDarkIcon from '../../assets/images/svg/settings_black_icon.svg';
import unsplashIcon from '../../assets/images/unsplash.svg';
import unsplashMGIcon from '../../assets/images/unsplash_mj.svg';
import widgetSearchIcon from '../../assets/images/widget-search.svg';

const SideNav: React.FC = () => {
  const location = useLocation();
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const workspaceId = getLocalWorkspaceId();

  const [cls, setCls] = useState('platform-layout-close');

  return (
    <nav className="h-screen bg-secondary dark:bg-secondaryDark relative overflow-y-hidden side-nav-layout">
      {isDrawerOpen && (
        <div className="w-full widgetDrawerGradient h-full px-7 absolute z-40 opacity-90">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="text-center font-Poppins font-semibold text-2xl pt-24">Add Widget</div>
              <div className="pt-4 relative">
                <Input
                  type="text"
                  name="search"
                  id="searchId"
                  placeholder="Search widgets"
                  className="py-3 bg-white text-xs focus:outline-none px-4 rounded-0.6 pr-8 placeholder:font-Poppins placeholder:font-normal placeholder:text-widgetSearch placeholder:text-xs"
                />
                <div className="absolute top-8 right-5">
                  <img src={widgetSearchIcon} alt="" />
                </div>
              </div>
            </div>
            <div className="hidden">
              <QuickInfo />
            </div>
            <Button
              text="Request for a Widget"
              type="submit"
              className="font-Poppins rounded-lg text-base font-semibold text-white py-3.5 mt-7 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
            />
          </div>
        </div>
      )}
      <div className="flex flex-col pl-2.58 pt-12 " onClick={() => setDrawerOpen(false)}>
        <div className="flex items-center">
          <div className="w-1.81 h-1.81">
            <img src={comunifyLogo} alt="" />
          </div>
          <div className="pl-0.66 font-Outfit font-bold text-dashboardLogo text-lightBlack dark:text-white leading-1.43">COMUNIFY</div>
        </div>
        <div className="flex flex-col mt-5.8 menu-box overflow-y-auto">
          <div className={window.location.href.includes('/dashboard') ? 'flex flex-center active-menu' : 'flex flex-center inactive-menu'}>
            <div>
              <img src={location.pathname === `/${workspaceId}/dashboard` ? dashboardDarkIcon : dashboardIcon} alt="" />
            </div>
            <NavLink
              to={`${workspaceId}/dashboard`}
              className={({ isActive }) =>
                `pl-1.24 font-Poppins font-medium text-base xl:text-lg  leading-1.68 cursor-pointer ${
                  isActive ? 'text-black dark:text-white' : 'text-slimGray'
                }`
              }
            >
              Dashboard
            </NavLink>
          </div>
          <div
            className={window.location.href.includes('/members') ? 'flex flex-center active-menu mt-2.18' : 'flex flex-center inactive-menu mt-2.18'}
          >
            <img src={location.pathname === `/${workspaceId}/members` ? memberDarkIcon : memberIcon} alt="" />
            <NavLink
              to={`${workspaceId}/members`}
              className={({ isActive }) =>
                `pl-1.24 font-Poppins font-medium text-base xl:text-lg  leading-1.68 cursor-pointer ${
                  isActive ? 'text-black dark:text-white' : 'text-slimGray'
                }`
              }
            >
              Members
            </NavLink>
          </div>
          <div
            className={window.location.href.includes('/activity') ? 'flex flex-center active-menu mt-2.18' : 'flex flex-center inactive-menu mt-2.18'}
          >
            <img src={location.pathname === `/${workspaceId}/activity` ? activeStreamDarkIcon : streamIcon} alt="" />
            <NavLink
              to={`${workspaceId}/activity`}
              className={({ isActive }) =>
                `pl-1.24 font-Poppins font-medium text-base xl:text-lg  leading-1.68 cursor-pointer ${
                  isActive ? 'text-black dark:text-white' : 'text-slimGray'
                }`
              }
            >
              Active Stream
            </NavLink>
          </div>
          <div
            className={window.location.href.includes('/reports') ? 'flex flex-center active-menu mt-2.18' : 'flex flex-center inactive-menu mt-2.18'}
          >
            <img src={location.pathname === `/${workspaceId}/reports` ? reportsDarkIcon : chartIcon} alt="" />
            <NavLink
              to={`${workspaceId}/reports`}
              className={({ isActive }) =>
                `pl-1.24 font-Poppins font-medium text-base xl:text-lg  leading-1.68 cursor-pointer ${
                  isActive ? 'text-black dark:text-white' : 'text-slimGray'
                }`
              }
            >
              Reports
            </NavLink>
          </div>
          <div
            className={window.location.href.includes('/settings') ? 'flex flex-center active-menu mt-2.18' : 'flex flex-center inactive-menu mt-2.18'}
          >
            <img src={location.pathname === `/${workspaceId}/settings` ? settingsDarkIcon : settingsIcon} alt="" />
            <NavLink
              to={`${workspaceId}/settings`}
              className={({ isActive }) =>
                `pl-1.24 font-Poppins font-medium text-base xl:text-lg  leading-1.68 cursor-pointer ${
                  isActive ? 'text-black dark:text-white' : 'text-slimGray'
                }`
              }
            >
              Settings
            </NavLink>
          </div>
        </div>
      </div>
      <div className="absolute subcribe-box w-full">
        <div className="w-13.5 mx-auto h-8.75 rounded-xl bg-[#f1f5eb] dark:bg-[#3d473a] flex justify-center">
          <div className="flex flex-col pt-1.43">
            <h3 className="text-center  text-sm font-semibold text-black dark:text-white leading-1.31">10 days left </h3>
            <h5 className="text-center  text-sm font-normal text-black dark:text-white leading-1.31">in your free trial</h5>
            <div className="mt-5 flex justify-center pb-1.37 text-white  ">
              <Button
                text="Subscribe Now"
                type="button"
                className="w-11.43 h-2.063 cursor-pointer font-Manrope text-xs font-semibold leading-4 rounded-0.31 border-none btn-gradient hover:shadow-buttonShadowHover transition ease-in duration-300"
              >
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0  w-full  flex items-center">
        <div className="flex flex-col w-full dark:bg-secondaryDark">
          <div className="flex justify-between items-center bg-lightBlack h-[60px] w-full rounded-t-lg pl-10 pr-6">
            <div className="flex items-center">
              <div className="text-white  font-Poppins font-medium leading-6 text-base">Platforms</div>
              <div className="text-white pl-0.81 font-Poppins font-medium leading-6 text-base relative">4/10</div>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setCls((cls) => (cls === 'platform-layout-open' ? 'platform-layout-close' : 'platform-layout-open'))}
            >
              <img
                src={dropdownIcon}
                alt=""
                style={{
                  transform: cls === 'platform-layout-open' ? '' : 'rotate(180deg)'
                }}
              />
            </div>
          </div>

          <div className={cls}>
            <div className="flex flex-col pl-9 pr-4 list-platform pt-4 dark:bg-secondaryDark">
              <div className="flex items-center mb-3">
                <div className="w-16 h-16 bg-subIntegrationGray dark:bg-black flex justify-center items-center">
                  <img src={unsplashIcon} alt="" className="w-[30px]" />
                </div>
                <div className="flex flex-col  pl-3">
                  <span className="capitalize text-xs font-semibold text-integrationGray dark:text-white">Khoros</span>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1"></span>
                    <span className="capitalize text-xs font-normal pl-1 pt-1 text-integrationGray dark:text-greyDark">Connected</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-3">
                <div className="w-16 h-16 bg-subIntegrationGray dark:bg-black flex justify-center items-center">
                  <img src={unsplashMGIcon} alt="" className="w-[30px]" />
                </div>
                <div className="flex flex-col  pl-3">
                  <span className="capitalize text-xs font-semibold text-integrationGray dark:text-white">Higher Logic</span>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1"></span>
                    <span className="capitalize text-xs font-normal pl-1 pt-1 text-integrationGray dark:text-greyDark">Disconnected</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center pb-3">
                <div className="w-16 h-16 bg-subIntegrationGray dark:bg-black flex justify-center items-center">
                  <img src={slackIcon} alt="" className="w-[30px]" />
                </div>
                <div className="flex flex-col  pl-3">
                  <span className="capitalize text-xs font-semibold text-integrationGray dark:text-white">slack</span>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1"></span>
                    <span className="capitalize text-xs font-normal pl-1 pt-1 text-integrationGray dark:text-greyDark">not active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;

{
  /* <div
className={
  active.members || window.location.href.includes('/members')
    ? 'flex mt-2.18 items-center active-menu'
    : 'flex mt-2.18 items-center inactive-menu'
}
>
<img src={active.members || window.location.href.includes('/members') ? memberDarkIcon : memberIcon} alt="" />
<div
  className={`pl-1.24 font-Poppins font-medium text-base xl:text-lg  leading-1.68 cursor-pointer ${
    active.members || window.location.href.includes('/members') ? 'text-black dark:text-white' : 'text-slimGray'
  }`}
  onClick={() => navigateRoute('/members')}
<div className="flex mt-2.18 items-center">
<img src={location.pathname === `/${workspaceId}/members` ? memberDarkIcon : memberIcon} alt="" />
<NavLink
  to={`${workspaceId}/members`}
  className={({ isActive }) =>
    `pl-1.24 font-Poppins font-medium text-base xl:text-lg  leading-1.68 cursor-pointer ${isActive ? 'text-black' : 'text-slimGray'}`
  }

>
  Members
</NavLink>
</div> */
}
