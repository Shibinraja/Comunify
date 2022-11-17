/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/prop-types */
import React, { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import Skeleton from 'react-loading-skeleton';
import cookie from 'react-cookies';

import { DecodeToken } from 'modules/authentication/interface/auth.interface';
import {
  ActivityEnum,
  GlobalSearchDataResponse,
  GlobalSearchDataResult,
  NotificationData,
  NotificationList,
  NotificationListQuery,
  SearchSuggestionArgsType
} from './TopBarTypes';

import useDebounce from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { AppDispatch, State } from '../../store';
import history from '@/lib/history';
import { decodeToken } from '@/lib/decodeToken';
import { getTimeSince } from '@/lib/helper';
import { userProfileDataService } from 'modules/account/services/account.services';

import {
  getGlobalSearchRequest,
  getNotificationCount,
  getNotificationListData,
  updateNotification
} from 'modules/dashboard/services/dashboard.services';

import ellipseIcon from '../../assets/images/Ellipse 39.svg';
import sunIcon from '../../assets/images/sun.svg';
import authSlice from '../../modules/authentication/store/slices/auth.slice';
import profilePic from '../../assets/images/user-image.svg';

// import { useTheme } from 'contexts/ThemeContext';

const TopBar: React.FC = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const profilePictureUrl = useAppSelector((state: State) => state.accounts.profilePictureUrl);

  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);
  const [searchSuggestion, setSearchSuggestion] = useState<string>('');
  const [suggestionList, setSuggestionList] = useState<GlobalSearchDataResponse>({
    result: [],
    nextCursor: null
  });
  const [loading, setLoading] = useState<{
    fetchLoading: boolean;
    scrollLoading: boolean;
    notificationLoading: boolean;
    notificationScrollLoading: boolean;
  }>({
    fetchLoading: false,
    scrollLoading: false,
    notificationLoading: false,
    notificationScrollLoading: false
  });
  const [isSuggestionListDropDown, setIsSuggestionListDropDown] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [, setActivityNextCursor] = useState<string | null>('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [unReadStatus, setUnReadStatus] = useState('false');
  const [notificationList, setNotificationList] = useState<NotificationList>({
    result: [],
    nextCursor: null
  });
  const [isNotificationActive, setIsNotificationActive] = useState<boolean>(false);

  const dropDownRef = useRef<HTMLImageElement | null>(null);
  const suggestionListDropDownRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLImageElement | null>(null);

  const options: string[] = ['Profile Settings', 'Sign Out'];
  const accessToken = localStorage.getItem('accessToken') || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = accessToken && decodeToken(accessToken);
  const debouncedValue = useDebounce(searchSuggestion, 300);

  // Function to call the api and list the membersSuggestionList
  const getGlobalSearchItem = async (props: Partial<SearchSuggestionArgsType>) => {
    setLoading((prev) => ({ ...prev, fetchLoading: true }));
    const data = await getGlobalSearchRequest({
      workspaceId: workspaceId!,
      cursor: props.cursor ? props.cursor : props.suggestionListCursor ? (props.prop ? '' : props.suggestionListCursor) : '',
      search: props.search as string
    });
    setLoading((prev) => ({ ...prev, fetchLoading: false }));
    setSuggestionList((prevState) => ({
      result: prevState.result.concat(data?.result as unknown as GlobalSearchDataResult[]),
      nextCursor: data?.nextCursor as string | null
    }));
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setIsDropdownActive(false);
    }

    if (suggestionListDropDownRef && suggestionListDropDownRef.current && !suggestionListDropDownRef.current.contains(event.target as Node)) {
      setIsSuggestionListDropDown(false);
    }

    if (notificationRef && notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
      setIsNotificationActive(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    if (profilePictureUrl) {
      setProfileImage(profilePictureUrl.profilePic);
    }

    // Event functionality which checks the route changes in the app and triggers the possible route callback functionality.
    const listen = history.listen((location) => {
      if (!location.location.pathname.includes('/activity')) {
        setSearchSuggestion('');
      }
    });

    if (!decodedToken.isAdmin) {
      notificationCount(workspaceId as string);
    }

    // Event Listener to check/listen to notification subscription event
    window.addEventListener('storage', () => {
      const newNotification = localStorage.getItem('newNotification');
      if (newNotification) {
        setUnReadStatus(newNotification);
      }
    });

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      listen();
    };
  }, []);

  useEffect(() => {
    if (profilePictureUrl) {
      setProfileImage(profilePictureUrl.profilePic);
    }
  }, [profilePictureUrl]);

  useEffect(() => {
    if (debouncedValue) {
      getGlobalSearchItem({
        cursor: null,
        prop: 'search',
        search: debouncedValue,
        suggestionListCursor: suggestionList.nextCursor
      });
    }
  }, [debouncedValue]);

  const fetchProfileData = async () => {
    const userId = decodedToken.id.toString();
    const response = await userProfileDataService(userId);
    if (response.profilePhotoUrl) {
      setProfileImage(response.profilePhotoUrl);
    }
  };

  /****************************Global Search*********************************/

  //Function to search of the desired suggestionList.
  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    setSuggestionList({
      result: [],
      nextCursor: null
    });

    if (!searchText) {
      setSearchSuggestion('');
    } else {
      setSearchSuggestion(searchText);
    }
  };

  // function for scroll event
  const handleScroll = async (event: React.UIEvent<HTMLElement>) => {
    event.preventDefault();
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 2 && !loading.fetchLoading) {
      setActivityNextCursor(suggestionList.nextCursor);
      if (suggestionList.nextCursor) {
        setLoading((prev) => ({ ...prev, scrollLoading: true }));
        await getGlobalSearchItem({
          cursor: suggestionList.nextCursor,
          prop: '',
          search: debouncedValue,
          suggestionListCursor: null
        });
        setLoading((prev) => ({ ...prev, scrollLoading: false }));
      }
    }
  };

  const navigateToActivity = (activityId: string, activityType: string, searchText: string) => {
    setSearchSuggestion('');
    if (activityType === ActivityEnum.Activity) {
      navigate(`/${workspaceId}/activity?activityId=${activityId}`);
      setSearchSuggestion(searchText);
    }

    if (activityType === ActivityEnum.Member) {
      navigate(`/${workspaceId}/members/${activityId}/profile`);
    }
  };

  /****************************UserProfileDropdown*********************************/

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

  /****************************Notifications*********************************/

  const getNotificationList = async (params: NotificationListQuery, isInitialLoad: boolean) => {
    setLoading((prev) => ({ ...prev, notificationLoading: true }));
    const data = await getNotificationListData(params);
    if (data.result[0] && data.result[0]?.isRead === false && isInitialLoad) {
      localStorage.setItem('newNotification', 'true');
      setUnReadStatus('true');
    }
    setLoading((prev) => ({ ...prev, notificationLoading: false }));

    setNotificationList((prevState) => ({
      result: prevState.result.concat(data?.result as NotificationData[]),
      nextCursor: data.nextCursor
    }));
  };

  // Get unread notification count
  const notificationCount = async (workspaceId: string) => {
    const { count } = await getNotificationCount(workspaceId);
    if (count > 0) {
      setUnReadStatus('true');
    } else {
      localStorage.setItem('newNotification', 'false');
      setUnReadStatus('false');
    }
  };

  const handleNotificationActive = () => {
    setIsNotificationActive((prev) => !prev);
    setNotificationList({
      result: [],
      nextCursor: null
    });
    getNotificationList(
      {
        workspaceId: workspaceId as string,
        limit: 10,
        cursor: null,
        type: 'all'
      },
      true
    );
  };

  // Change notification status to read
  const handleNotificationUpdate = async (notificationId: string, index: number) => {
    await updateNotification({ notificationId, workspaceId: workspaceId as string });
    setNotificationList((prev) => {
      const values = [...prev.result];
      values[index].isRead = true;
      return {
        result: values,
        nextCursor: prev.nextCursor
      };
    });
    await notificationCount(workspaceId as string);
  };

  // function for scroll event for notification
  const handleScrollNav = async (event: React.UIEvent<HTMLElement>) => {
    event.preventDefault();
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 2 && !loading.fetchLoading) {
      if (notificationList.nextCursor) {
        setLoading((prev) => ({ ...prev, notificationScrollLoading: true }));
        await getNotificationList(
          {
            cursor: notificationList.nextCursor,
            workspaceId: workspaceId as string,
            type: 'all',
            limit: 10
          },
          false
        );
        setLoading((prev) => ({ ...prev, notificationScrollLoading: false }));
      }
    }
  };

  /***************************************************************************/
  // const { theme, setTheme } = useTheme();

  // function handleToggleTheme() {
  //   //reverse the theme value every time that "handleToggleTheme" is called
  //   setTheme(!theme);
  // }

  return (
    <div className=" mt-6 px-12 xl:px-20">
      <div className="flex justify-between items-center ">
        <div className="relative dark:bg-primaryDark`" ref={suggestionListDropDownRef}>
          {!decodedToken.isAdmin && (
            <Fragment>
              <input
                name="search"
                id="searchId"
                type="text"
                placeholder="Search..."
                className="bg-transparent border border-borderPrimary focus:outline-none font-normal pl-4.18 box-border text-inputText text-search rounded-0.6 h-16 w-34.3  placeholder:font-normal placeholder:leading-snug placeholder:text-search placeholder:text-searchGray shadow-profileCard"
                onChange={handleSearchTextChange}
                value={searchSuggestion}
                onClick={() => {
                  setIsSuggestionListDropDown(true);
                }}
              />
              <div className="absolute pl-7 top-[1.3rem]">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20.8474 20.1109L17.2407 16.5042C18.8207 14.7499 19.7917 12.437 19.7917 9.8958C19.7917 4.43931 15.3524 0 9.89585 0C4.43931 0 0 4.43931 0 9.89585C0 15.3524 4.43931 19.7917 9.89585 19.7917C12.437 19.7917 14.7499 18.8207 16.5042 17.2407L20.1109 20.8474C20.2127 20.9491 20.346 21 20.4792 21C20.6125 21 20.7457 20.9491 20.8475 20.8474C21.0509 20.6439 21.0509 20.3144 20.8474 20.1109ZM9.89585 18.75C5.01406 18.75 1.0417 14.7781 1.0417 9.89585C1.0417 5.01358 5.01406 1.04165 9.89585 1.04165C14.7776 1.04165 18.75 5.01353 18.75 9.89585C18.75 14.7782 14.7776 18.75 9.89585 18.75Z"
                    fill="#7C8DB5"
                  />
                </svg>
              </div>
            </Fragment>
          )}
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
          {!decodedToken.isAdmin && (
            <div className="pl-1.68 relative cursor-pointer" ref={notificationRef}>
              <div className="notification-icon" onClick={handleNotificationActive}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14 16H18.5858C19.3668 16 20 15.3668 20 14.5858C20 14.2107 19.851 13.851 19.5858 13.5858L18.5858 12.5858C18.2107 12.2107 18 11.702 18 11.1716L18 7.97067C18 3.56859 14.4314 0 10.0293 0C5.61789 0 2.04543 3.58319 2.05867 7.9946L2.06814 11.1476C2.06977 11.6922 1.84928 12.2139 1.45759 12.5922L0.428635 13.586C0.154705 13.8506 2.07459e-06 14.2151 0 14.5959C0 15.3714 0.628628 16 1.40408 16H6C6 18.2091 7.79086 20 10 20C12.2091 20 14 18.2091 14 16ZM17.5251 13.6464L18.3787 14.5H1.64147L2.49967 13.6711C3.18513 13.009 3.57099 12.0961 3.56813 11.1431L3.55867 7.9901C3.54792 4.40887 6.44807 1.5 10.0293 1.5C13.603 1.5 16.5 4.39702 16.5 7.97067L16.5 11.1716C16.5 12.0998 16.8687 12.9901 17.5251 13.6464ZM12.5 16H7.5C7.5 17.3807 8.61929 18.5 10 18.5C11.3807 18.5 12.5 17.3807 12.5 16Z"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="absolute top-0 right-0 overflow-hidden">{unReadStatus === 'true' ? <img src={ellipseIcon} alt="" /> : null}</div>
              {isNotificationActive && (
                <div className="absolute border-box w-[363px] rounded-[10px] border border-[#DBD8FC] bg-white cursor-pointer top-10 -right-[20px]  z-10 px-[14px] py-[18px] notification notification-box">
                  <div className="flex flex-col font-Poppins">
                    <div className="text-base font-semibold">Notifications</div>
                    <div className="flex flex-col notify-list min-h-[80px] max-h-[325px] overflow-auto ">
                      {loading.notificationLoading && !loading.notificationScrollLoading && (
                        <div className="flex flex-col gap-5 overflow-y-scroll member-section mt-1.8 max-h-96 height-member-merge ">
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((type: number) => (
                            <Fragment key={type}>
                              <div className="flex py-[10px] border-b border-[#E6E6E6] items-center">
                                <Skeleton width={40} height={40} borderRadius={'50%'} className="rounded-full" />
                                <div className="flex flex-col pl-2">
                                  <span className="text-[#070707] text-sm">
                                    <Skeleton width={250} height={20} />
                                  </span>
                                  <span className="text-[10px] text-[#808080]">
                                    <Skeleton width={50} height={10} />
                                  </span>
                                </div>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      )}
                      {notificationList.result.length > 0 && (
                        <div
                          id="scrollableDiv"
                          className="flex flex-col gap-5 overflow-y-scroll member-section mt-1.8 max-h-96 height-member-merge "
                          onScroll={handleScrollNav}
                        >
                          {notificationList.result.map((item: NotificationData, index: number) => (
                            <div className="flex py-[10px] border-b border-[#E6E6E6] items-center" key={index}>
                              <img
                                src={
                                  (item.notification.notificationPayload?.imageUrl as string) ||
                                  'https://comunify-dev-assets.s3.amazonaws.com/common/Comunfy_logo.png'
                                }
                                alt=""
                                className="w-[26px] h-[26px] rounded-full"
                              />
                              <div className="flex flex-col pl-2 w-[300px]" onClick={() => handleNotificationUpdate(item.notificationId, index)}>
                                <span className="text-[#070707] text-sm">{item?.notification?.message}</span>
                                <span className="text-[10px] text-[#808080]">{getTimeSince(new Date(item?.createdAt).toISOString())}</span>
                              </div>
                              <div className="flex items-center justify-center mb-[15px] w-[25px] ">
                                {!item.isRead && <img src={ellipseIcon} alt="" className="h-[12px] " />}
                              </div>
                            </div>
                          ))}
                          {loading.notificationLoading && (
                            <div className="flex py-[10px] border-b border-[#E6E6E6] items-center">
                              <Skeleton width={40} height={40} borderRadius={'50%'} className="rounded-full" />
                              <div className="flex flex-col pl-2">
                                <span className="text-[#070707] text-sm">
                                  <Skeleton width={250} height={20} />
                                </span>
                                <span className="text-[10px] text-[#808080]">
                                  <Skeleton width={50} height={10} />
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
      {suggestionList?.result?.length > 0 && isSuggestionListDropDown && (
        <div
          className="mt-[3px] box-border rounded-0.3 shadow-reportInput w-34.37 app-result-card-border h-12.375 overflow-auto absolute z-10 bg-white"
          onScroll={handleScroll}
        >
          {suggestionList.result.map((searchResult: GlobalSearchDataResult) => (
            <div
              className="flex flex-col mt-[13px] pl-4 pb-5 overflow-auto cursor-pointer"
              key={searchResult.id}
              onClick={() => navigateToActivity(searchResult.id, searchResult.resultType, searchResult.displayValue)}
            >
              <div className="flex">
                <Fragment>
                  <img
                    className="h-[1.835rem] w-[1.9175rem] rounded-full"
                    src={searchResult.resultType === ActivityEnum.Activity ? searchResult.icon : searchResult.icon ?? profilePic}
                    alt=""
                  />
                </Fragment>
                <div className="pl-6 font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                  {searchResult.resultType === ActivityEnum.Activity ? `${searchResult.memberName} ${searchResult.displayValue}` : searchResult.memberName}
                </div>
              </div>
            </div>
          ))}
          {loading.fetchLoading && (
            <div className="flex flex-col mt-[13px] pl-4 pb-5 overflow-auto">
              <div className="flex">
                <Fragment>
                  <Skeleton width={40} height={40} borderRadius={'50%'} className="rounded-full" />
                </Fragment>
                <Skeleton width={300} height={20} className={'ml-5'} />
              </div>
            </div>
          )}
        </div>
      )}
      {searchSuggestion && suggestionList.result.length === 0 && !loading.fetchLoading && (
        <div className="mt-[3px] scroll-auto box-border rounded-0.3 shadow-reportInput w-34.37 app-result-card-border absolute z-10 bg-white">
          <div className="flex flex-col mt-[13px] pl-4 pb-5">
            <h3 className="font-Poppins font-normal text-base text-infoBlack mt-6 text-center">No data found</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
