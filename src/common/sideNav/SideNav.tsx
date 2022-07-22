import comunifyLogo from '../../assets/images/Group 2 (1).svg';
import dashboardIcon from '../../assets/images/dashboard.svg';
import dashboardDarkIcon from '../../assets/images/svg/dashboard_black_icon.svg'
import memberIcon from '../../assets/images/members.svg';
import memberDarkIcon from '../../assets/images/svg/members_black_icon.svg'
import settingsIcon from '../../assets/images/settings.svg';
import settingsDarkIcon from '../../assets/images/svg/settings_black_icon.svg'
import streamIcon from '../../assets/images/stream.svg';
import activeStreamDarkIcon from '../../assets/images/svg/activities_black_icon.svg'
import chartIcon from '../../assets/images/pie_chart.svg';
import reportsDarkIcon from '../../assets/images/svg/reports_black_icon.svg'
import dropdownIcon from '../../assets/images/dropdown.svg';
import Button from 'common/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ActiveState } from '../../interface/interface';

const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<ActiveState>({dashboard:false, members:false, activity:false, reports:false, settings:false})

  const navigateRoute = (route:string):void => {
        switch (route) {
            case '/dashboard':
                setActive({dashboard:true})
                navigate('/dashboard')
                break;
            case '/members':
                setActive({members:true})
                navigate('/members')
                break
            case '/activity':
                setActive({activity:true})
                navigate('/activity')
                break
            case '/reports':
                setActive({reports:true})
                navigate('/reports')
                break   
            case '/settings':
                setActive({settings:true})
                navigate('/settings')
                break     
        
            default:
                break;
        }
  };

  return (
    <nav className="h-screen bg-brightGray w-2/12">
      <div className="flex flex-col pl-2.58 mt-3.01">
        <div className="flex items-center">
          <div>
            <img src={comunifyLogo} alt="" />
          </div>
          <div className="pl-0.66 font-Outfit font-bold text-dashboardLogo text-lightBlack leading-1.43">
            COMUNIFY
          </div>
        </div>
        <div className="mt-5.8 flex items-center ">
          <div>
            <img src={active.dashboard || window.location.href.includes('/dashboard') ? dashboardDarkIcon : dashboardIcon} alt="" />
          </div>
          <div className={`pl-1.24 font-Poppins font-medium text-desc leading-1.68 cursor-pointer ${active.dashboard || window.location.href.includes('/dashboard') ? 'text-black' : 'text-slimGray'}`}
            onClick={() => navigateRoute("/dashboard")}>
            Dashboard
          </div>
        </div>
        <div className="flex mt-2.18 items-center">
          <img src={active.members ? memberDarkIcon : memberIcon} alt="" />
          <div className={`pl-1.24 font-Poppins font-medium text-desc leading-1.68 cursor-pointer ${active.members ? 'text-black' : 'text-slimGray'}`}
            onClick={() => navigateRoute("/members")}>
            Members
          </div>
        </div>
        <div className="flex mt-2.18 items-center">
          <img src={active.activity? activeStreamDarkIcon : streamIcon} alt="" />
          <div className={`pl-1.24 font-Poppins font-medium text-desc leading-1.68 cursor-pointer ${active.activity ? 'text-black' : 'text-slimGray'}`}
            onClick={() => navigateRoute("/activity")}>
            Active Stream
          </div>
        </div>
        <div className="flex mt-2.18 items-center">
          <img src={active.reports ? reportsDarkIcon : chartIcon} alt="" />
          <div className={`pl-1.24 font-Poppins font-medium text-desc leading-1.68 cursor-pointer ${active.reports ? 'text-black' : 'text-slimGray'}`}
            onClick={() => navigateRoute("/reports")}>
            Reports
          </div>
        </div>
        <div
          className="flex mt-2.18 items-center"
          onClick={() => navigateRoute("/settings")} >
          <img src={active.settings ? settingsDarkIcon : settingsIcon} alt="" />
          <div className={`pl-1.24 font-Poppins font-medium text-desc leading-1.68 cursor-pointer ${active.settings ? 'text-black' : 'text-slimGray'}`}>
            Settings
          </div>
        </div>
      </div>
      <div className="mt-[300px]  w-13.5 mx-auto h-8.75 rounded-xl bg-sidenavCard">
        <div className="flex flex-col pt-1.43">
          <h3 className="text-center font-Poppins text-trial font-semibold text-black leading-1.31">
            10 days left{" "}
          </h3>
          <h5 className="text-center font-Poppins text-trial font-normal text-black leading-1.31">
            in your free trial
          </h5>
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
      <div className="absolute bottom-0 bg-lightBlack w-2/12 h-[50px] flex items-center justify-center rounded-t-lg cursor-pointer">
        <div className="flex pl-9 items-center">
          <div className="text-white  font-Poppins font-medium leading-6 text-base">
            Platforms
          </div>
          <div className="text-white pl-0.81 font-Poppins font-medium leading-6 text-base">
            4/10
          </div>
          <div className="pl-5.06">
            <img src={dropdownIcon} alt="" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
