import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import comunifyLogo from '../../assets/images/Group 2 (1).svg';
import dashboardIcon from '../../assets/images/dashboard.svg';
import dashboardDarkIcon from '../../assets/images/svg/dashboard_black_icon.svg';
import settingsIcon from '../../assets/images/settings.svg';
import settingsDarkIcon from '../../assets/images/svg/settings_black_icon.svg';


const SuperAdminSideNav = () => {
  const location = useLocation();

  return (
    <nav className="h-screen bg-secondary dark:bg-secondaryDark relative overflow-y-hidden side-nav-layout">
      <div className="flex flex-col pl-2.58 pt-12 ">
        <div className="flex items-center">
          <div className="w-1.81 h-1.81">
            <NavLink to={`/admin/users`}>
              <img src={comunifyLogo} alt="" />
            </NavLink>
          </div>
          <NavLink to={`/admin/users`}>
            <div className="pl-0.66 font-Outfit font-bold text-dashboardLogo text-lightBlack dark:text-white leading-1.43">COMUNIFY</div>
          </NavLink>
        </div>
        <div className="flex flex-col mt-5.8 menu-box overflow-y-auto">
          <div className={window.location.href.includes('/users') ? 'flex flex-center active-menu' : 'flex flex-center inactive-menu'}>
            <NavLink to={`/admin/users`}>
              <div>
                <img src={location.pathname === `/admin/users` ? dashboardDarkIcon : dashboardIcon} alt="" />
              </div>
            </NavLink>

            <NavLink
              to={`/admin/users`}
              className={({ isActive }) =>
                `pl-1.24 font-Poppins font-medium text-base xl:text-lg  leading-1.68 cursor-pointer ${
                  isActive ? 'text-black dark:text-white' : 'text-tableDuration'
                }`
              }
            >
              Comunify Users
            </NavLink>
          </div>
          <div
            className={window.location.href.includes('/settings') ? 'flex flex-center active-menu mt-2.18' : 'flex flex-center inactive-menu mt-2.18'}
          >
            <NavLink to={`/admin/settings`}>
              <img className="inline-flex" src={location.pathname === `/admin/settings` ? settingsDarkIcon : settingsIcon} alt="" />
            </NavLink>
            <NavLink
              to={`/admin/settings`}
              className={({ isActive }) =>
                `pl-1.24 font-Poppins font-medium text-base xl:text-lg  leading-1.68 cursor-pointer ${
                  isActive ? 'text-black dark:text-white' : 'text-tableDuration'
                }`
              }
            >
              Settings
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SuperAdminSideNav;
