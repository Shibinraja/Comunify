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
import authSlice from '../../modules/authentication/store/slices/auth.slice';
import profilePic from '../../assets/images/user-image.svg';
import notificationIcon from '../../assets/images/notification-icon.svg';
import searchIcon from '../../assets/images/search-icon.svg';

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
  const { userProfilePictureUrl } = useAppSelector((state) => state.accounts);
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
    setSuggestionList((prevState) => {
      // Check is there is any viable duplicate items in the list and sets the distinct one.
      const CheckedDuplicateSearchList = new Set();

      const searchList = prevState.result.concat(data?.result as unknown as GlobalSearchDataResult).filter((searchItem: GlobalSearchDataResult) => {
        const duplicate = CheckedDuplicateSearchList.has(searchItem.id);
        CheckedDuplicateSearchList.add(searchItem.id);
        return !duplicate;
      });
      return {
        result: searchList,
        nextCursor: data?.nextCursor as string | null
      };
    });
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

    if (!decodedToken?.isAdmin) {
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
    if (userProfilePictureUrl) {
      setProfileImage(userProfilePictureUrl);
    }
  }, [userProfilePictureUrl]);

  useEffect(() => {
    setSuggestionList({
      result: [],
      nextCursor: null
    });
    if (debouncedValue) {
      const fetchGlobalSearchList = async () => {
        await getGlobalSearchItem({
          cursor: null,
          prop: 'search',
          search: debouncedValue,
          suggestionListCursor: suggestionList.nextCursor
        });
      };
      fetchGlobalSearchList();
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
        if (!decodedToken?.isAdmin) {
          navigate(`${workspaceId}/account`);
        }

        if (decodedToken?.isAdmin) {
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
          {decodedToken?.isAdmin && <div className="font-semibold text-[23.47px]">Comunify Users List</div>}
          {!decodedToken?.isAdmin && (
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
                <img src={searchIcon} alt="" />
              </div>
            </Fragment>
          )}
        </div>
        <div className="flex items-center">
          {!decodedToken?.isAdmin && (
            <div className="pl-1.68 relative cursor-pointer" ref={notificationRef}>
              <div className="p-2" onClick={handleNotificationActive}>
                <div className="notification-icon">
                  <img src={notificationIcon} alt="" />
                </div>
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
                              <div className="flex py-[10px] border-b border-[#E6E6E6]">
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
          className={`mt-[3px] box-border rounded-0.3 shadow-reportInput w-34.37 app-result-card-border overflow-auto absolute z-10 bg-white ${
            suggestionList.result.length > 4 ? 'h-12.375' : `h-[${suggestionList.result.length * 30}]px`
          }`}
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
                  {searchResult.resultType === ActivityEnum.Activity
                    ? `${searchResult.memberName} ${searchResult.displayValue}`
                    : searchResult.memberName}
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
