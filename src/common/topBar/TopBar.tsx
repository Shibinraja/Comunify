import React, { useEffect, useRef, useState } from 'react';
import searchIcon from '../../assets/images/search.svg';
import profilePic from '../../assets/images/profile image.svg';
import slackIcon from '../../assets/images/slack.svg';
import unplashMjIcon from '../../assets/images/unsplash.svg';
import unplashMj from '../../assets/images/unsplash_mj.svg';
import unionIcon from '../../assets/images/Union.svg';
import sunIcon from '../../assets/images/sun.svg';
import ellipseIcon from '../../assets/images/Ellipse 39.svg';
import { useAppDispatch } from '../../hooks/useRedux';
import authSlice from '../../modules/authentication/store/slices/auth.slice';
import { AppDispatch } from '../../store';
import Input from 'common/input';
import { useNavigate } from 'react-router';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);
  const options: string[] = ['Profile Settings', 'Sign Out'];
  const dispatch: AppDispatch = useAppDispatch();
  const dropDownRef: any = useRef();

  const handleDropDownActive = async(data?: string): Promise<void> => {
    switch (data) {
      case 'Sign Out':
        dispatch(authSlice.actions.signOut());
      case 'Profile Settings':
        navigate('/account');
        break;
      default:
        break;
    }
    setIsDropdownActive((prev) => !prev);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && dropDownRef.current.contains(event.target)) {
      setIsDropdownActive(true);
    } else {
      setIsDropdownActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className=" mt-6 px-12 xl:px-20">
      <div className="flex justify-between items-center ">
        <div className="relative">
          <Input
            name="search"
            id="searchId"
            type="text"
            placeholder="Search..."
            className="app-input-card-border focus:outline-none font-normal pl-4.18 box-border text-search bg-white rounded-0.6 h-16 w-34.3 placeholder:font-Poppins placeholder:font-normal placeholder:leading-snug placeholder:text-search opacity-40 placeholder:text-searchGray shadow-profileCard"
          />
          <img src={searchIcon} alt="" className="absolute pl-7 top-[1.3rem]" />
        </div>
        <div className="flex items-center">
          <div className="cursor-pointer">
            <img src={sunIcon} alt="" />
          </div>
          <div className="pl-1.68 relative cursor-pointer">
            <img src={unionIcon} alt="" />
            <div className="absolute top-0 right-0 overflow-hidden">
              <img src={ellipseIcon} alt="" />
            </div>
          </div>
          <div className="pl-2.56 relative">
            <img
              src={profilePic}
              alt=""
              className="rounded-full bg-cover bg-center relative cursor-pointer"
              ref={dropDownRef}
              onClick={() => handleDropDownActive()}
            />
            {isDropdownActive && (
              <div className="absolute border-box w-9.62 rounded-0.3 app-result-card-border bg-white cursor-pointer top-10 right-0 shadow-trialButtonShadow">
                {options.map((options, i: number) => (
                  <div className="flex flex-col" onClick={() => handleDropDownActive(options)} key={i}>
                    <div className="h-3.06 p-2 flex items-center text-searchBlack font-Poppins font-normal text-trial leading-1.31 hover:font-medium hover:bg-signUpDomain transition ease-in duration-300">
                      {options}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-[3px] scroll-auto box-border rounded-0.3 shadow-reportInput w-34.37 app-result-card-border hidden">
        <div className="flex flex-col mt-[13px] pl-4 pb-5 opacity-40">
          <div className="flex">
            <div>
              <img src={unplashMjIcon} alt="" />
            </div>
            <div className="pl-6 font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
              John posted a “Latest Release” on channel “Updates”
            </div>
          </div>
          <div className="flex  mt-1.625">
            <div>
              <img src={unplashMj} alt="" />
            </div>
            <div className="pl-6 font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
              Nishitha commented a post “Latest Release” on channel “Updates”
            </div>
          </div>
          <div className="flex mt-1.625">
            <div>
              <img src={slackIcon} alt="" />
            </div>
            <div className="pl-6 font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
              Nishitha started a discussion “Latest Release” of our product”
            </div>
          </div>
          <div className="flex mt-1.625">
            <div>
              <img src={unplashMjIcon} alt="" />
            </div>
            <div className="pl-6 font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
              John posted a “Latest Release” on channel “Updates”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
