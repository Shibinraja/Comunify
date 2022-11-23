/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { convertEndDate, convertStartDate } from '@/lib/helper';
import Button from 'common/button';
import { SearchSuggestionArgsType } from 'common/topBar/TopBarTypes';
import { SubscriptionPackages } from 'modules/authentication/interface/auth.interface';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendarIcon from '../../../assets/images/calandar.svg';
import downArrow from '../../../assets/images/sub-down-arrow.svg';
import dropdownIcon from '../../../assets/images/Vector.svg';
import '../../members/pages/Members.css';
import { GetUsersListQueryParams, platformData, UserMembersListData, UserMemberTypesProps, UserPlatformResponse } from '../interface/users.interface';
import { getPlatformsData, getUsersListService } from '../services/users.services';

const domainOptions = ['Marketing', 'Sales', 'Customer Support', 'Customer Success', 'Others'];

const UsersFilter: FC<UserMemberTypesProps> = ({ page, limit, searchText, filteredDate, memberFilterExport, setMembersList, setPage }) => {
  const [isFilterDropdownActive, setIsFilterDropdownActive] = useState<boolean>(false);
  const [isPlatformActive, setPlatformActive] = useState<boolean>(true);
  const [isSubscriptionActive, setSubscriptionActive] = useState<boolean>(false);
  const [isExpiryActive, setExpiryActive] = useState<boolean>(false);
  const [isDomainActive, setDomainActive] = useState<boolean>(false);
  const [isDateOfJoiningActive, setDateOfJoiningActive] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [isDateOfSubscriptionActive, setDateOfSubscriptionActive] = useState<boolean>(false);
  const [PlatformFilterResponse, setPlatformFilterResponse] = useState<UserPlatformResponse>({
    result: [],
    nextCursor: null
  });
  const [checkedPlatform, setCheckedPlatform] = useState<Record<string, unknown>>({});
  const [checkedSubscription, setCheckedSubscription] = useState<Record<string, unknown>>({});
  const [checkedDomain, setCheckedDomain] = useState<Record<string, unknown>>({});

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [expiryStart, setExpiryStart] = useState<Date>();
  const [expiryEnd, setExpiryEnd] = useState<Date>();
  const [fetchLoader, setFetchLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  //   const [isActiveBetween, setActiveBetween] = useState<boolean>(false);
  const datePickerRefStart = useRef<ReactDatePicker>(null);
  const datePickerRefEnd = useRef<ReactDatePicker>(null);

  const dispatch = useAppDispatch();
  const dropDownRef = useRef<HTMLDivElement>(null);
  const subscriptionData = useAppSelector((state) => state.auth.subscriptionData);

  const UserFilterList = Object.values(checkedPlatform).concat(Object.values(checkedSubscription)).concat(Object.values(checkedDomain));

  // Function to dispatch the search text and to hit api of member list.
  // eslint-disable-next-line space-before-function-paren
  const getFilteredMembersList = async (args:GetUsersListQueryParams) => {
    setFetchLoader(true);
    const data = await getUsersListService(args);
    setFetchLoader(false);
    setPage(1);
    setMembersList({
      data: data?.data as unknown as UserMembersListData[],
      totalPages: data?.totalPages as number,
      previousPage: data?.previousPage as number,
      nextPage: data?.nextPage as number
    });
  };

  const getPlatformsList = async(props: Partial<SearchSuggestionArgsType>) => {
    setLoading(true);
    const data = await getPlatformsData({
      cursor: props.cursor ? props.cursor : props.suggestionListCursor ? (props.prop ? '' : props.suggestionListCursor) : '',
      search: props.search as string
    });
    setLoading(false);
    setPlatformFilterResponse({
      result: data?.result as platformData[],
      nextCursor: data?.nextCursor as string | null
    });
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    dispatch(authSlice.actions.getSubscriptions());
    getPlatformsList({
      cursor: null,
      prop: 'search',
      search: '',
      suggestionListCursor: PlatformFilterResponse.nextCursor
    });
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setIsFilterDropdownActive(false);
    }
  };

  const handleFilterDropdown = (): void => {
    setIsFilterDropdownActive((prev) => !prev);
  };

  const handlePlatformActive = (val: boolean) => {
    setPlatformActive(val);
  };

  const handleDateOfJoiningActive = (val: boolean) => {
    setDateOfJoiningActive(val);
  };

  const handleSubscriptionActive = (val: boolean) => {
    setSubscriptionActive(val);
  };

  const handleExpiryActive = (val: boolean) => {
    setExpiryActive(val);
  };

  const handleDateOfSubscriptionActive = (val: boolean) => {
    setDateOfSubscriptionActive(val);
  };

  const handleDomainActive = (val: boolean) => {
    setDomainActive(val);
  };

  const handlePlatformsCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const platform: string = event.target.id;
    setCheckedPlatform((preValue) => ({ ...preValue, [platform]: event.target.checked }));
  };

  const handleSubscriptionCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const subscription: string = event.target.id;
    setCheckedSubscription((preValue) => ({ ...preValue, [subscription]: event.target.checked }));
  };

  const handleDomainCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const domain: string = event.target.id;
    setCheckedDomain((preValue) => ({ ...preValue, [domain]: event.target.checked }));
  };

  const selectActiveBetweenDate = (event: ChangeEvent<Date>, date: Date, dateTime: string, type: string) => {
    event.stopPropagation();
    if (type === 'joining') {
      if (dateTime === 'start') {
        setStartDate(date);
        setIsFilterDropdownActive(true);
      }

      if (dateTime === 'end') {
        setEndDate(date);
        setIsFilterDropdownActive(true);
      }
    } else if (type === 'expiry') {
      if (dateTime === 'start') {
        setExpiryStart(date);
        setIsFilterDropdownActive(true);
      }

      if (dateTime === 'end') {
        setExpiryEnd(date);
        setIsFilterDropdownActive(true);
      }
    }
  };

  const handleClickDatePickerIcon = (type: string) => {
    if (type === 'start') {
      const datePickerElement = datePickerRefStart.current;
      datePickerElement!.setFocus();
    }
    if (type === 'end') {
      const datePickerElement = datePickerRefEnd.current;
      datePickerElement!.setFocus();
    }
  };

  // function for scroll event
  const handleScroll = async(event: React.UIEvent<HTMLElement>) => {
    event.preventDefault();
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 2 && !loading) {
      if (PlatformFilterResponse.nextCursor) {
        setLoading(true);
        await getPlatformsList({
          cursor: PlatformFilterResponse.nextCursor,
          prop: '',
          search: '',
          suggestionListCursor: null
        });
        setLoading(false);
      }
    }
  };

  // Function to dispatch the search text to hit api of member filter list.
  const disableApplyBtn = useMemo(() => {
    if (startDate === undefined && endDate === undefined && expiryStart === undefined && expiryEnd === undefined && UserFilterList.length === 0) {
      return true;
    }

    if (startDate && endDate) {
      return false;
    }

    if (expiryStart && expiryEnd) {
      return false;
    }

    if (startDate || endDate) {
      return true;
    }

    if (expiryStart || expiryEnd) {
      return true;
    }

    return false;
  }, [startDate, endDate, UserFilterList, expiryStart, expiryEnd]);

  // console.log('err', disableApplyBtn, startDate, endDate, expiryStart, expiryEnd,  UserFilterList)

  // eslint-disable-next-line space-before-function-paren
  const submitFilterChange = async (): Promise<void> => {
    const checkPlatform: Array<string> = [];
    const checkSubscription: Array<string> = [];
    const checkDomain: Array<string> = [];

    if (UserFilterList[0] === Boolean(false)) {
      setCheckedPlatform({});
      setCheckedSubscription({});
      setCheckedDomain({});
    }

    if (Object.keys(checkedPlatform).length > 0) {
      Object.keys(checkedPlatform).map((platform: string) => {
        if (checkedPlatform[platform] === true) {
          checkPlatform.push(platform);
        }
      });
    }

    if (Object.keys(checkedSubscription).length > 0) {
      Object.keys(checkedSubscription).map((subscription: string) => {
        if (checkedSubscription[subscription] === true) {
          checkSubscription.push(subscription);
        }
      });
    }

    if (Object.keys(checkedDomain).length > 0) {
      Object.keys(checkedDomain).map((domain: string) => {
        if (checkedDomain[domain] === true) {
          checkDomain.push(domain);
        }
      });
    }

    memberFilterExport({
      platform: checkPlatform,
      domain: checkDomain,
      subscription: checkSubscription,
      joinedAtLte: endDate ? endDate && convertEndDate(endDate) : '',
      joinedAtGte: startDate ? startDate && convertStartDate(startDate) : '',
      expiryAtLte: expiryEnd ? expiryEnd && convertEndDate(expiryEnd) : '',
      expiryAtGte: expiryStart ? expiryStart && convertStartDate(expiryStart) : ''
    });

    if (!disableApplyBtn) {
      getFilteredMembersList({
        page,
        limit,
        search: searchText,
        ...(filteredDate.filterStartDate ? { 'createdAT.gte': filteredDate.filterStartDate } : {}),
        ...(filteredDate.filterEndDate ? { 'createdAT.lte': filteredDate.filterEndDate } : {}),
        ...(checkPlatform.length ? { platformId: checkPlatform } : {}),
        ...(checkDomain.length ? { domain: checkDomain } : {}),
        ...(checkSubscription.length ? { subscriptionPlanId: checkSubscription } : {}),
        ...(endDate ? { 'joinedAt.lte': endDate && convertEndDate(endDate) } : {}),
        ...(startDate ? { 'joinedAt.gte': startDate && convertStartDate(startDate) } : {}),
        ...(expiryEnd ? { 'expiryAt.lte': expiryEnd && convertEndDate(expiryEnd) } : {}),
        ...(expiryStart ? { 'expiryAt.gte': expiryStart && convertStartDate(expiryStart) } : {})
      });
    }
    handleFilterDropdown();
  };

  return (
    <div className="box-border cursor-pointer rounded-0.6 shadow-contactCard app-input-card-border relative " ref={dropDownRef}>
      <div className="flex h-3.06  items-center justify-between px-5 " onClick={handleFilterDropdown}>
        <div className="box-border rounded-0.6 shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12">Filters {''}</div>
        <div>
          <img src={dropdownIcon} alt="" className={isFilterDropdownActive ? 'rotate-180' : 'rotate-0'} />
        </div>
      </div>
      {isFilterDropdownActive && (
        <div className="absolute w-16.56 pb-0 bg-white border z-40 rounded-0.3">
          <div className="flex flex-col pb-5">
            <div
              className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06  px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handlePlatformActive(isPlatformActive ? false : true);
                handleDateOfSubscriptionActive(false);
                handleDomainActive(false);
                handleExpiryActive(false);
                handleExpiryActive(false);
                handleSubscriptionActive(false);
                handleDateOfJoiningActive(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Choose Platform</div>
              <div>
                <img src={downArrow} alt="" className={isPlatformActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isPlatformActive && (
              <div
                id="scrollableDiv"
                onScroll={handleScroll}
                className="flex flex-col gap-y-5 p-3 max-h-[11.25rem] overflow-scroll">
                {
                  PlatformFilterResponse.result.map(
                    (platform: platformData, index: number) =>
                      <div className="flex items-center" key={index}>
                        <div className="mr-2">
                          <input
                            type="checkbox"
                            className="checkbox"
                            id={platform.id as string}
                            name={platform.name as string}
                            checked={(checkedPlatform[platform.id] as boolean) || false}
                            onChange={handlePlatformsCheckBox}
                          />
                        </div>
                        <label
                          className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial cursor-pointer"
                          htmlFor={platform.id as string}
                        >
                          {platform?.name}
                        </label>
                      </div>
                  )}
              </div>
            )}

            <div
              className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06  px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handlePlatformActive(false);
                handleDateOfSubscriptionActive(false);
                handleDomainActive(false);
                handleExpiryActive(false);
                handleSubscriptionActive(isSubscriptionActive ? false : true);
                handleDateOfJoiningActive(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Choose Subscription</div>
              <div>
                <img src={downArrow} alt="" className={isSubscriptionActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isSubscriptionActive && (
              <div className="flex flex-col gap-y-5 p-3 max-h-[11.25rem] overflow-scroll">
                {subscriptionData &&
                  subscriptionData.map((subscription: SubscriptionPackages, index: number) => (
                    <div className="flex items-center" key={index}>
                      <div className="mr-2">
                        <input
                          type="checkbox"
                          className="checkbox"
                          id={subscription.id as string}
                          name={subscription.name as string}
                          checked={(checkedSubscription[subscription.id] as boolean) || false}
                          onChange={handleSubscriptionCheckBox}
                        />
                      </div>
                      <label
                        className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial cursor-pointer"
                        htmlFor={subscription.id as string}
                      >
                        {subscription?.name}
                      </label>
                    </div>
                  ))}
              </div>
            )}

            <div
              className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06 px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handlePlatformActive(false);
                handleDateOfSubscriptionActive(false);
                handleDomainActive(false);
                handleExpiryActive(false);
                handleSubscriptionActive(false);
                handleDateOfJoiningActive(isDateOfJoiningActive ? false : true);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Date of Joining</div>
              <div>
                <img src={downArrow} alt="" className={isDateOfJoiningActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isDateOfJoiningActive && (
              <>
                <div className="flex flex-col px-3 pt-4">
                  <label htmlFor="Start Date p-1 font-Inter font-normal leading-4 text-trial text-searchBlack">Start Date</label>
                  <div className="relative flex items-center">
                    <DatePicker
                      selected={startDate}
                      maxDate={endDate}
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'start', 'joining')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                      ref={datePickerRefStart}
                      dateFormat="dd/MM/yyyy"
                    />
                    <img
                      className="absolute icon-holder right-6 cursor-pointer"
                      src={calendarIcon}
                      alt=""
                      onClick={() => handleClickDatePickerIcon('start')}
                    />
                  </div>
                </div>
                <div className="flex flex-col px-3 pb-4 pt-3">
                  <label htmlFor="Start Date p-1 font-Inter font-Inter font-normal leading-4 text-trial text-searchBlack">End Date</label>
                  <div className="relative flex items-center">
                    <DatePicker
                      selected={endDate}
                      minDate={startDate}
                      maxDate={endDate}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'end', 'joining')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                      ref={datePickerRefEnd}
                      dateFormat="dd/MM/yyyy"
                    />
                    <img
                      className="absolute icon-holder right-6 cursor-pointer"
                      src={calendarIcon}
                      alt=""
                      onClick={() => handleClickDatePickerIcon('end')}
                    />
                  </div>
                </div>
              </>
            )}

            <div
              className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06 px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handlePlatformActive(false);
                handleDateOfSubscriptionActive(false);
                handleDomainActive(false);
                handleExpiryActive(isExpiryActive ? false : true);
                handleSubscriptionActive(false);
                handleDateOfJoiningActive(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Date of Expiry</div>
              <div>
                <img src={downArrow} alt="" className={isExpiryActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isExpiryActive && (
              <>
                <div className="flex flex-col px-3 pt-4">
                  <label htmlFor="Start Date p-1 font-Inter font-normal leading-4 text-trial text-searchBlack">Start Date</label>
                  <div className="relative flex items-center">
                    <DatePicker
                      selected={expiryStart}
                      maxDate={expiryEnd}
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'start', 'expiry')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                      ref={datePickerRefStart}
                      dateFormat="dd/MM/yyyy"
                    />
                    <img
                      className="absolute icon-holder right-6 cursor-pointer"
                      src={calendarIcon}
                      alt=""
                      onClick={() => handleClickDatePickerIcon('start')}
                    />
                  </div>
                </div>
                <div className="flex flex-col px-3 pb-4 pt-3">
                  <label htmlFor="Start Date p-1 font-Inter font-Inter font-normal leading-4 text-trial text-searchBlack">End Date</label>
                  <div className="relative flex items-center">
                    <DatePicker
                      selected={expiryEnd}
                      minDate={expiryStart}
                      // maxDate={expiryEnd}
                      selectsEnd
                      startDate={startDate}
                      endDate={expiryEnd}
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'end', 'expiry')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                      ref={datePickerRefEnd}
                      dateFormat="dd/MM/yyyy"
                    />
                    <img
                      className="absolute icon-holder right-6 cursor-pointer"
                      src={calendarIcon}
                      alt=""
                      onClick={() => handleClickDatePickerIcon('end')}
                    />
                  </div>
                </div>
              </>
            )}


            <div
              className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06  px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handlePlatformActive(false);
                handleDateOfSubscriptionActive(false);
                handleDomainActive(isDomainActive ? false : true);
                handleExpiryActive(false);
                handleSubscriptionActive(false);
                handleDateOfJoiningActive(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Choose Domain</div>
              <div>
                <img src={downArrow} alt="" className={isDomainActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isDomainActive && (
              <div className="flex flex-col gap-y-5 p-3 max-h-[11.25rem] overflow-scroll">
                {domainOptions &&
                  domainOptions.map((domain: string, index: number) => (
                    <div className="flex items-center" key={index}>
                      <div className="mr-2">
                        <input
                          type="checkbox"
                          className="checkbox"
                          id={domain as string}
                          name={domain as string}
                          checked={(checkedDomain[domain] as boolean) || false}
                          onChange={handleDomainCheckBox}
                        />
                      </div>
                      <label className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial cursor-pointer" htmlFor={domain as string}>
                        {domain}
                      </label>
                    </div>
                  ))}
              </div>
            )}

            <div className="buttons px-2 flex mt-1.56">
              <Button
                disabled={fetchLoader ? true : false}
                type="button"
                text="Reset"
                className="border border-backdropColor text-black rounded-0.31 h-2.063 w-1/2 mr-1 cursor-pointer text-card font-Manrope font-semibold leading-1.31 hover:text-white hover:bg-backdropColor"
                onClick={() => {
                  setCheckedPlatform({});
                  setCheckedSubscription({});
                  setCheckedDomain({});
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setExpiryStart(undefined);
                  setExpiryEnd(undefined);
                  // setFilterCount(0);
                  getFilteredMembersList({
                    page, limit
                  });
                }}
              />
              <Button
                disabled={fetchLoader ? true : false}
                onClick={submitFilterChange}
                type="button"
                text="Apply"
                className={`border-none btn-save-modal rounded-0.31 h-2.063 w-1/2 ml-1 cursor-pointer text-card font-Manrope font-semibold leading-1.31 text-white ${
                  fetchLoader ? 'cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersFilter;
