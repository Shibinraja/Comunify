import Input from 'common/input';
import React, { useEffect, useRef, useState } from 'react';
import ellipseIcon from '../../assets/images/Ellipse 39.svg';
import profilePic from '../../assets/images/user-image.svg';
import slackIcon from '../../assets/images/slack.svg';
import sunIcon from '../../assets/images/sun.svg';
import unplashMjIcon from '../../assets/images/unsplash.svg';
import unplashMj from '../../assets/images/unsplash_mj.svg';
import { useAppDispatch } from '../../hooks/useRedux';
import authSlice from '../../modules/authentication/store/slices/auth.slice';
import { AppDispatch } from '../../store';
import { useNavigate } from 'react-router';
import { getLocalWorkspaceId } from '@/lib/helper';
import { userProfileDataService } from 'modules/account/services/account.services';
import { DecodeToken } from 'modules/authentication/interface/auth.interface';
import cookie from 'react-cookies';
import { decodeToken } from '@/lib/decodeToken';
// import { useTheme } from 'contexts/ThemeContext';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);
  const options: string[] = ['Profile Settings', 'Sign Out'];
  const dispatch: AppDispatch = useAppDispatch();
  const dropDownRef = useRef<HTMLImageElement | null>(null);
  const workspaceId = getLocalWorkspaceId();
  const [profileImage, setProfileImage] = useState<string>('');
  const accessToken = localStorage.getItem('accessToken') || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = accessToken && decodeToken(accessToken);

  // eslint-disable-next-line space-before-function-paren
  const handleDropDownActive = async (data?: string): Promise<void> => {
    switch (data) {
      case 'Sign Out':
        dispatch(authSlice.actions.signOut());
        break;
      case 'Profile Settings':
        if (!decodedToken.isAdmin) {
          navigate(`${workspaceId}/account`);
        }

        if (decodedToken.isAdmin) {
          navigate(`admin/settings`);
        }
        break;
      default:
        break;
    }
    setIsDropdownActive((prev) => !prev);
  };

  const fetchProfileData = async() => {
    const userId = decodedToken.id.toString();
    const response = await userProfileDataService(userId);
    if (response.profilePhotoUrl) {
      setProfileImage(response.profilePhotoUrl);
    }
  };

  useEffect(() => {
    fetchProfileData();
  });

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setIsDropdownActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // const { theme, setTheme } = useTheme();

  // function handleToggleTheme() {
  //   //reverse the theme value every time that "handleToggleTheme" is called
  //   setTheme(!theme);
  // }

  return (
    <div className=" mt-6 px-12 xl:px-20">
      <div className="flex justify-between items-center ">
        <div className="relative dark:bg-primaryDark`">
          <Input
            name="search"
            id="searchId"
            type="text"
            placeholder="Search..."
            className="bg-transparent border border-borderPrimary focus:outline-none font-normal pl-4.18 box-border text-inputText text-search rounded-0.6 h-16 w-34.3  placeholder:font-normal placeholder:leading-snug placeholder:text-search placeholder:text-searchGray shadow-profileCard"
          />
          <div className="absolute pl-7 top-[1.3rem]">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20.8474 20.1109L17.2407 16.5042C18.8207 14.7499 19.7917 12.437 19.7917 9.8958C19.7917 4.43931 15.3524 0 9.89585 0C4.43931 0 0 4.43931 0 9.89585C0 15.3524 4.43931 19.7917 9.89585 19.7917C12.437 19.7917 14.7499 18.8207 16.5042 17.2407L20.1109 20.8474C20.2127 20.9491 20.346 21 20.4792 21C20.6125 21 20.7457 20.9491 20.8475 20.8474C21.0509 20.6439 21.0509 20.3144 20.8474 20.1109ZM9.89585 18.75C5.01406 18.75 1.0417 14.7781 1.0417 9.89585C1.0417 5.01358 5.01406 1.04165 9.89585 1.04165C14.7776 1.04165 18.75 5.01353 18.75 9.89585C18.75 14.7782 14.7776 18.75 9.89585 18.75Z"
                fill="#7C8DB5"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center">
          <div className="cursor-pointer">
            <img src={sunIcon} alt="" />
            {/* {theme ? (
              <img src={sunIcon} alt="" onClick={handleToggleTheme} />
            ) : (
              <div onClick={handleToggleTheme}>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.1465 0.0899292C12.035 0.14889 11.9258 0.261243 11.8658 0.378921C11.7758 0.555364 11.7676 0.665861 11.7676 1.69892C11.7676 2.73248 11.7758 2.84239 11.8659 3.01912C11.9764 3.23587 12.2577 3.40865 12.5 3.40865C12.7423 3.40865 13.0236 3.23587 13.1341 3.01912C13.2242 2.84239 13.2324 2.73248 13.2324 1.69892C13.2324 0.665373 13.2242 0.555462 13.1341 0.378726C12.954 0.0253994 12.5129 -0.103563 12.1465 0.0899292ZM3.92822 3.52623C3.56719 3.68352 3.39575 4.0878 3.53521 4.45304C3.65488 4.76651 5.07227 6.15813 5.35962 6.24425C5.75303 6.36217 6.20103 6.08871 6.27686 5.68439C6.33892 5.35324 6.2335 5.18842 5.45024 4.39213C4.55264 3.47958 4.32822 3.35188 3.92822 3.52623ZM20.4834 3.55055C20.1958 3.6845 18.829 5.08803 18.7515 5.32915C18.5758 5.87539 19.0925 6.40716 19.6411 6.24478C19.9266 6.16027 21.3457 4.76509 21.4656 4.45099C21.6062 4.08281 21.4295 3.6782 21.061 3.52413C20.8489 3.43547 20.7177 3.44147 20.4834 3.55055ZM11.499 5.46251C9.19756 5.81887 7.21538 7.24947 6.18896 9.29498C5.90483 9.86124 5.69175 10.4688 5.55835 11.0932C5.41333 11.772 5.40264 13.0293 5.53589 13.7403C6.08496 16.6704 8.36978 18.9357 11.3037 19.4589C11.9582 19.5756 13.0413 19.5756 13.6963 19.459C16.6351 18.9358 18.9139 16.6763 19.4641 13.7403C19.5974 13.0293 19.5867 11.772 19.4417 11.0932C18.85 8.32444 16.7982 6.21718 14.0679 5.57438C13.6415 5.47399 13.3943 5.44927 12.6709 5.43477C12.1875 5.42509 11.6602 5.43755 11.499 5.46251ZM13.8755 7.03873C14.8944 7.30569 15.7917 7.82764 16.5061 8.56908C17.0022 9.084 17.2642 9.45774 17.5551 10.0658C18.2688 11.5576 18.2966 13.1997 17.634 14.7373C16.9017 16.4367 15.2968 17.6889 13.4277 18.0193C12.9646 18.1011 12.049 18.1004 11.5723 18.0179C9.65049 17.6853 8.03252 16.3857 7.29893 14.5853C6.70947 13.139 6.76367 11.4895 7.44751 10.0604C7.75386 9.42018 8.08955 8.95645 8.60938 8.45545C9.44014 7.65482 10.2547 7.22367 11.4148 6.97063C12.0427 6.83366 13.2169 6.86615 13.8755 7.03873ZM0.378955 11.8626C0.172803 11.9715 0 12.2597 0 12.4946C0 12.737 0.172705 13.0184 0.389355 13.129C0.566016 13.2191 0.675879 13.2273 1.70898 13.2273C2.74209 13.2273 2.85195 13.2191 3.02861 13.129C3.24526 13.0184 3.41797 12.737 3.41797 12.4946C3.41797 12.2522 3.24526 11.9708 3.02861 11.8602C2.85142 11.7698 2.74458 11.7621 1.69873 11.764C0.663184 11.766 0.545215 11.7748 0.378955 11.8626ZM21.961 11.8626C21.7548 11.9715 21.582 12.2597 21.582 12.4946C21.582 12.737 21.7547 13.0184 21.9714 13.129C22.148 13.2191 22.2579 13.2273 23.291 13.2273C24.3241 13.2273 24.434 13.2191 24.6106 13.129C24.8273 13.0184 25 12.737 25 12.4946C25 12.2522 24.8273 11.9708 24.6106 11.8602C24.4334 11.7698 24.3266 11.7621 23.2808 11.764C22.2452 11.766 22.1272 11.7748 21.961 11.8626ZM5.24902 18.7911C4.99546 18.9085 3.53525 20.3862 3.48848 20.5727C3.46992 20.6467 3.46606 20.8074 3.47988 20.9301C3.52764 21.3538 3.96919 21.6246 4.42559 21.51C4.63823 21.4566 6.13096 19.9546 6.23047 19.6939C6.37178 19.3237 6.196 18.9195 5.82661 18.7651C5.61475 18.6765 5.48354 18.6824 5.24902 18.7911ZM19.1626 18.7672C18.8016 18.9245 18.6301 19.3288 18.7695 19.6939C18.869 19.9546 20.3618 21.4566 20.5744 21.51C21.0308 21.6246 21.4724 21.3538 21.5201 20.9301C21.5339 20.8074 21.5301 20.6467 21.5115 20.5727C21.4911 20.4914 21.176 20.1316 20.7121 19.66C19.7856 18.7182 19.5657 18.5915 19.1626 18.7672ZM12.1465 21.6813C12.035 21.7402 11.9258 21.8526 11.8658 21.9703C11.7758 22.1467 11.7676 22.2572 11.7676 23.2903C11.7676 24.3238 11.7758 24.4337 11.8659 24.6105C11.9764 24.8272 12.2577 25 12.5 25C12.7423 25 13.0236 24.8272 13.1341 24.6105C13.2242 24.4337 13.2324 24.3238 13.2324 23.2903C13.2324 22.2567 13.2242 22.1468 13.1341 21.9701C12.954 21.6168 12.5129 21.4878 12.1465 21.6813Z"
                    fill="white"
                  />
                </svg>
              </div>
            )} */}
          </div>
          <div className="pl-1.68 relative cursor-pointer">
            <div className="notification-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14 16H18.5858C19.3668 16 20 15.3668 20 14.5858C20 14.2107 19.851 13.851 19.5858 13.5858L18.5858 12.5858C18.2107 12.2107 18 11.702 18 11.1716L18 7.97067C18 3.56859 14.4314 0 10.0293 0C5.61789 0 2.04543 3.58319 2.05867 7.9946L2.06814 11.1476C2.06977 11.6922 1.84928 12.2139 1.45759 12.5922L0.428635 13.586C0.154705 13.8506 2.07459e-06 14.2151 0 14.5959C0 15.3714 0.628628 16 1.40408 16H6C6 18.2091 7.79086 20 10 20C12.2091 20 14 18.2091 14 16ZM17.5251 13.6464L18.3787 14.5H1.64147L2.49967 13.6711C3.18513 13.009 3.57099 12.0961 3.56813 11.1431L3.55867 7.9901C3.54792 4.40887 6.44807 1.5 10.0293 1.5C13.603 1.5 16.5 4.39702 16.5 7.97067L16.5 11.1716C16.5 12.0998 16.8687 12.9901 17.5251 13.6464ZM12.5 16H7.5C7.5 17.3807 8.61929 18.5 10 18.5C11.3807 18.5 12.5 17.3807 12.5 16Z"
                  fill="none"
                />
              </svg>
            </div>
            <div className="absolute top-0 right-0 overflow-hidden">
              <img src={ellipseIcon} alt="" />
            </div>
          </div>
          <div className="pl-2.56 relative">
            <img
              src={profileImage.length ? profileImage : profilePic}
              alt=""
              className="rounded-full bg-cover h-12 w-12 bg-center relative cursor-pointer"
              ref={dropDownRef}
              onClick={() => handleDropDownActive()}
            />
            {isDropdownActive && (
              <div className="absolute border-box w-9.62 rounded-0.3 app-result-card-border bg-white cursor-pointer top-10 right-0 shadow-trialButtonShadow z-10">
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
