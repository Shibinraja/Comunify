import comunifyLogo from '../../assets/images/Group 2 (1).svg';
import dashboardIcon from '../../assets/images/dashboard.svg';
import memberIcon from '../../assets/images/members.svg';
import settingsIcon from '../../assets/images/settings.svg';
import streamIcon from '../../assets/images/stream.svg';
import chartIcon from '../../assets/images/pie_chart.svg';
import dropdownIcon from '../../assets/images/dropdown.svg';
import Button from 'common/button';
import { Link, useNavigate } from 'react-router-dom';

const SideNav: React.FC = () => {
  const navigate = useNavigate();
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
            <img src={dashboardIcon} alt="" />
          </div>
          <div className="pl-1.24 font-Poppins font-medium text-desc text-slimGray leading-1.68 cursor-pointer" 
            onClick={() => {navigate("/dashboard")}}>
            Dashboard
          </div>
        </div>
        <div className="flex mt-2.18 items-center">
          <img src={memberIcon} alt="" />
          <div className="pl-1.24 font-Poppins font-medium text-desc text-slimGray leading-1.68 cursor-pointer">
            Members
          </div>
        </div>
        <div className="flex mt-2.18 items-center">
          <img src={streamIcon} alt="" />
          <div className="pl-1.24 font-Poppins font-medium text-desc text-slimGray leading-1.68 cursor-pointer">
            Active Stream
          </div>
        </div>
        <div className="flex mt-2.18 items-center">
          <img src={chartIcon} alt="" />
          <div className="pl-1.24 font-Poppins font-medium text-desc text-slimGray leading-1.68 cursor-pointer">
            Reports
          </div>
        </div>
        <div
          className="flex mt-2.18 items-center"
          onClick={() => {
            navigate("/dashboard/settings");
          }}
        >
          <img src={settingsIcon} alt="" />
          <div className="pl-1.24 font-Poppins font-medium text-desc text-slimGray leading-1.68 cursor-pointer">
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
