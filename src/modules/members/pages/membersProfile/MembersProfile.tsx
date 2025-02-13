/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
import useDebounce from '@/hooks/useDebounce';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import Button from 'common/button';
import Input from 'common/input';
import MergeModal from 'common/modals/MergeModal';
import { MergeModalPropsEnum } from 'common/modals/MergeModalTypes';
import { width_90 } from 'constants/constants';
import loaderSlice from 'modules/authentication/store/slices/loader.slice';
import settingsSlice from 'modules/settings/store/slice/settings.slice';
import React, { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Skeleton from 'react-loading-skeleton';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import * as Yup from 'yup';
import calendarIcon from '../../../../assets/images/calandar.svg';
import closeIcon from '../../../../assets/images/close-member.svg';
import dropDownIcon from '../../../../assets/images/profile-dropdown.svg';
import yellowDottedIcon from '../../../../assets/images/yellow_dotted.svg';
import usePlatform from '../../../../hooks/usePlatform';
import { useAppSelector } from '../../../../hooks/useRedux';
import { convertEndDate, convertStartDate, generateDateAndTime } from '../../../../lib/helper';
import { AppDispatch } from '../../../../store';
import { AssignTypeEnum, PlatformResponse, TagResponseData } from '../../../settings/interface/settings.interface';
import { ActivityResult, MemberProfileCard } from '../../interface/members.interface';
import membersSlice from '../../store/slice/members.slice';
import MembersProfileGraph from '../membersProfileGraph/MembersProfileGraph';
import moment from 'moment';
import profileImage from '../../../../assets/images/user-image.svg';

Modal.setAppElement('#root');

const MembersProfile: React.FC = () => {
  const limit = 10;
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { workspaceId, memberId } = useParams();
  const [isSelectDropDownActive, setSelectDropDownActive] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const [isIntegrationDropDownActive, setIntegrationDropDownActive] = useState<boolean>(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [searchText, setSearchText] = useState<string>('');
  const [tags, setTags] = useState<{
    tagName: string;
    tagId: string;
  }>({
    tagName: '',
    tagId: ''
  });
  const [isFilterDropDownActive, setFilterDropdownActive] = useState<boolean>(false);
  const [activityNextCursor, setActivityNextCursor] = useState<string | null>('');
  const [platform, setPlatform] = useState<string | undefined>();
  const [tagDropDownOption, setTagDropDownOption] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | unknown>('');
  const [tagAssignLoading, setTagAssignLoading] = useState<boolean>(false);
  const [tagUnAssignLoading, setTagUnAssignLoading] = useState<boolean>(true);
  const {
    membersActivityData: activityData,
    membersProfileActivityGraphData: activityGraphData,
    memberProfileCardData
  } = useAppSelector((state) => state.members);

  const memberProfileCardLoader = useSkeletonLoading(membersSlice.actions.getMembersActivityGraphData.type);
  const activityDataLoader = useSkeletonLoading(membersSlice.actions.getMembersActivityDataInfiniteScroll.type);
  const tagsAssignLoader = useSkeletonLoading(settingsSlice.actions.assignTags.type);
  // const tagsUnAssignLoader = useSkeletonLoading(settingsSlice.actions.unAssignTags.type);

  const { PlatformFilterResponse } = usePlatform();

  const tagDropDownRef = useRef<HTMLDivElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const datePickerRefStart = useRef<ReactDatePicker>(null);
  const datePickerRefEnd = useRef<ReactDatePicker>(null);
  const integrationDropDownRef = useRef<HTMLDivElement>(null);
  const dateFilterDropDownRef = useRef<HTMLDivElement>(null);

  const {
    TagFilterResponse: { data: TagFilterResponseData },
    clearValue
  } = useAppSelector((state) => state.settings);

  const debouncedValue = useDebounce(searchText, 300);

  const TagNameValidation = Yup.string()
    .trim('WhiteSpaces are not allowed')
    .min(2, 'Tag Name must be at least 2 characters')
    .max(15, 'Tag Name should not exceed above 15 characters')
    .required('Tag Name is a required field')
    .nullable(true);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('click', handleDropDownClick);
    document.addEventListener('click', handleIntegrationDropDownClick);
    document.addEventListener('click', handleDateFilterDropDownClick);
    localStorage.removeItem('merge-membersId');
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('click', handleDropDownClick);
      document.removeEventListener('click', handleIntegrationDropDownClick);
      document.removeEventListener('click', handleDateFilterDropDownClick);
    };
  }, []);

  useEffect(() => {
    if (memberId) {
      dispatch(membersSlice.actions.getMembersActivityGraphData({ workspaceId: workspaceId as string, memberId: memberId as string }));
      dispatch(membersSlice.actions.getMemberProfileCardData({ workspaceId: workspaceId as string, memberId: memberId as string }));
      dispatch(membersSlice.actions.setMemberProfileCardData([]));
      // loadActivityData(true);
    }
  }, [memberId]);

  useEffect(() => {
    loadActivityData(true);
  }, [platform, fromDate && toDate, toDate && fromDate]);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedValue) {
      getTagsList(1, debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (clearValue) {
      handleTagModalOpen(false);
    }
  }, [clearValue]);

  useEffect(() => {
    setTagUnAssignLoading(true);
  }, [memberProfileCardData]);

  useEffect(() => {
    setTagAssignLoading(false);
    if (TagFilterResponseData?.length && searchText) {
      setTagDropDownOption(true);
    }

    if (TagFilterResponseData?.length === 0) {
      setTagDropDownOption(false);
    }
  }, [TagFilterResponseData]);

  const loadActivityData = (needReload: boolean, cursor?: string) => {
    if (needReload) {
      dispatch(membersSlice.actions.clearMemberActivityData());
    }
    dispatch(
      membersSlice.actions.getMembersActivityDataInfiniteScroll({
        workspaceId: workspaceId as string,
        memberId: memberId as string,
        nextCursor: cursor ? cursor : activityNextCursor ? activityNextCursor : '',
        platform: platform && platform,
        fromDate: fromDate && convertStartDate(fromDate),
        toDate: toDate && convertEndDate(toDate)
      })
    );
  };
  const handleModal = (val: boolean) => {
    setIsModalOpen(val);
  };

  const handleTagModalOpen = (value: boolean): void => {
    setErrorMessage('');
    setTagModalOpen(value);
    setTags({
      tagId: '',
      tagName: ''
    });
    setSearchText('');
    dispatch(settingsSlice.actions.resetValue(false));
  };

  const handleDropDownActive = (): void => {
    setSelectDropDownActive((prev) => !prev);
  };

  const handleFilterDropDownActive = (): void => {
    setFilterDropdownActive((prev) => !prev);
  };

  const handleIntegrationDropDownActive = (): void => {
    setIntegrationDropDownActive((prev) => !prev);
  };

  // switch case for member graph
  const selectPlatformToDisplayOnGraph = (name: string, id: string | null = null) => {
    setSelected(name);
    switch (name) {
      case 'All':
        dispatch(membersSlice.actions.getMembersActivityGraphData({ workspaceId: workspaceId as string, memberId: memberId as string }));
        break;
      case `${name !== undefined && name !== 'All' && name}`:
        dispatch(
          membersSlice.actions.getMembersActivityGraphDataPerPlatform({
            workspaceId: workspaceId as string,
            memberId: memberId as string,
            platform: id || name.toLocaleLowerCase().trim()
          })
        );
        break;
      default:
        break;
    }
  };

  // switch case for member platforms
  const selectPlatformForActivityScroll = (name: string, id: string | null = null) => {
    setSelectedIntegration(name);
    setActivityNextCursor(null);
    switch (name) {
      case 'All Integration':
        setPlatform(undefined);
        break;
      case `${name !== undefined && name !== 'All Integration' && name}`:
        setPlatform(id || name.toLocaleLowerCase().trim());
        break;
      default:
        break;
    }
  };
  // function to listen for scroll event
  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    event.preventDefault();
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 2) {
      setActivityNextCursor(activityData?.nextCursor);
      if (activityData.nextCursor !== null) {
        loadActivityData(false, activityData.nextCursor);
        dispatch(loaderSlice.actions.stopLoadingAction(membersSlice.actions.getMembersActivityDataInfiniteScroll.type));
      }
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setSelectDropDownActive(false);
    }
  };

  const handleDropDownClick = (event: MouseEvent) => {
    if (tagDropDownRef && tagDropDownRef.current && !tagDropDownRef.current.contains(event.target as Node)) {
      setTagDropDownOption(false);
    }
  };

  const handleIntegrationDropDownClick = (event: MouseEvent) => {
    if (integrationDropDownRef && integrationDropDownRef.current && !integrationDropDownRef.current.contains(event.target as Node)) {
      setIntegrationDropDownActive(false);
    }
  };

  const handleDateFilterDropDownClick = (event: MouseEvent) => {
    if (dateFilterDropDownRef && dateFilterDropDownRef.current) {
      if ((event?.target as Element)?.className.includes('react-datepicker__day')) {
        setFilterDropdownActive(true);
      } else if (!dateFilterDropDownRef.current.contains(event.target as Node)) {
        setFilterDropdownActive(false);
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

  const navigateToActivities = () => {
    navigate(`/${workspaceId}/activity`);
  };

  const getTagsList = (pageNumber: number, text: string): void => {
    dispatch(
      settingsSlice.actions.tagFilterData({
        settingsQuery: {
          page: pageNumber,
          limit,
          tags: {
            checkedTags: '',
            searchedTags: text
          }
        },
        workspaceId: workspaceId!
      })
    );
  };

  const handleSelectTagName = (tagName: string, tagId: string) => {
    try {
      TagNameValidation.validateSync(tagName);
      setErrorMessage('');
      setTagDropDownOption(false);
      setTags({
        tagId,
        tagName
      });
    } catch ({ message }) {
      setErrorMessage(message);
    }
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    setSearchText(searchText);
    try {
      TagNameValidation.validateSync(searchText);
      setErrorMessage('');
      if (!searchText) {
        getTagsList(1, '');
        handleSelectTagName('', '');
      }
      if (tags.tagName) {
        setTags({ tagId: '', tagName: '' });
      }
    } catch ({ message }) {
      setErrorMessage(message);
    }
  };

  // Tag Name assign functionality
  const handleAssignTagsName = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (errorMessage || !searchText) {
      setErrorMessage(errorMessage || 'Tag Name is a required field');
    } else {
      setTagAssignLoading(true);
      dispatch(
        settingsSlice.actions.assignTags({
          memberId: memberId!,
          assignTagBody: {
            name: tags.tagName || searchText,
            viewName: tags.tagName || searchText,
            type: 'Member' as AssignTypeEnum.Member
          },
          workspaceId: workspaceId!
        })
      );
    }
  };

  // Tag Name un-assign functionality
  const handleUnAssignTagsName = (id: string): void => {
    if (tagUnAssignLoading) {
      setTagUnAssignLoading(false);
      dispatch(
        settingsSlice.actions.unAssignTags({
          memberId: memberId!,
          unAssignTagBody: {
            tagId: id,
            type: 'Member' as AssignTypeEnum.Member
          },
          workspaceId: workspaceId!
        })
      );
    }
  };

  const MergeModalComponent = useMemo(() => {
    if (isModalOpen) {
      return <MergeModal modalOpen={isModalOpen} setModalOpen={setIsModalOpen} type={MergeModalPropsEnum.MergeMember} />;
    }
  }, [isModalOpen]);

  //flittering today date from the data
  const todayDate = activityData?.result?.filter(
    (data: { activityTime: moment.MomentInput }) => moment(data.activityTime).format('DD-MMM-YYYY') === moment.utc().format('DD-MMM-YYYY')
  );

  //flittering yesterday date from the data
  const yesterdayDate = activityData?.result?.filter(
    (data: { activityTime: moment.MomentInput }) =>
      moment(data.activityTime).format('DD-MMM-YYYY') === moment().subtract(1, 'days').format('DD-MMM-YYYY')
  );

  //removing today and yesterdayDate from the data
  const allDate = activityData?.result
    ?.filter(
      (data: { activityTime: moment.MomentInput }) =>
        moment(data?.activityTime).isBefore(moment.utc().subtract(2, 'days')) || moment(data?.activityTime).isAfter(moment.utc().add(1, 'days'))
    )
    .sort(
      (a: { activityTime: string | number | Date }, b: { activityTime: string | number | Date }) =>
        new Date(a.activityTime).getTime() - new Date(b.activityTime).getTime()
    )
    .reverse();

  //creating an object after sorting all the dates storing into an object
  const dateMapObj: any = {};
  allDate.forEach((element) => {
    const arr: [] = dateMapObj[moment(element.activityTime).format('DD-MMM-YYYY')];
    if (arr) {
      dateMapObj[moment(element.activityTime).format('DD-MMM-YYYY')] = [...arr, element];
    } else {
      dateMapObj[moment(element.activityTime).format('DD-MMM-YYYY')] = [element];
    }
  });

  return (
    <div className="flex pt-3.93 w-full mb-8">
      <div className="flex flex-col w-full xl:w-[667px]">
        <div className="p-5 flex flex-col box-border  rounded-0.6 shadow-contactCard app-input-card-border h-[349px]">
          <div className="flex justify-between items-center relative">
            <div className="font-Poppins font-semibold text-base leading-9 text-accountBlack">Member Activity by Source</div>
            <div className="select relative">
              <div
                className="flex justify-between  pl-3 pr-5 items-center cursor-pointer box-border w-9.59 h-3.06 rounded-0.6 shadow-contactCard app-input-card-border "
                ref={dropDownRef}
                onClick={handleDropDownActive}
              >
                <div className="font-Poppins font-semibold text-card text-memberDay leading-4">{selected ? selected : 'Select'}</div>
                <div>
                  <img src={dropDownIcon} alt="" className={isSelectDropDownActive ? 'rotate-180' : 'rotate-0'} />
                </div>
              </div>
              {isSelectDropDownActive && (
                <div
                  className="absolute flex flex-col text-left px-2 pt-2  cursor-pointer box-border w-full bg-white z-40 rounded-0.6 shadow-contactCard pb-2 app-input-card-border"
                  onClick={handleDropDownActive}
                >
                  <div
                    className="rounded-0.3 h-1.93 flex items-center font-Poppins text-trial font-normal leading-4 text-searchBlack hover:bg-signUpDomain px-2 px-2"
                    onClick={() => selectPlatformToDisplayOnGraph('All')}
                  >
                    All
                  </div>
                  {PlatformFilterResponse?.map((data: PlatformResponse) => (
                    <div key={data.id}>
                      {data?.isConnected && (
                        <div
                          className="rounded-0.3 h-1.93 flex items-center font-Poppins text-trial font-normal leading-4 text-searchBlack hover:bg-signUpDomain px-2"
                          onClick={() => selectPlatformToDisplayOnGraph(data?.name, data?.id)}
                        >
                          {data?.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="chart pt-5 ">
            <MembersProfileGraph activityGraphData={activityGraphData} />
          </div>
        </div>
        <div className="flex flex-col xl:flex-row pt-2.18 items-start xl:items-center justify-between">
          {memberProfileCardLoader ? (
            <div className="flex flex-col w-full">
              <div className="font-Poppins font-normal text-xs leading-4 text-listGray">Last Active Date</div>
              <div className="font-Poppins font-semibold text-base leading-6 text-accountBlack">
                <Skeleton width={width_90} />
              </div>
            </div>
          ) : memberProfileCardData?.length ? (
            memberProfileCardData?.map((data: MemberProfileCard) => (
              <div key={data.platformId} className="flex flex-col ">
                <div className="font-Poppins font-normal text-xs leading-4 text-listGray">Last Active Date</div>
                <div className="font-Poppins font-semibold text-base leading-6 text-accountBlack">
                  {memberProfileCardLoader ? (
                    <Skeleton width={width_90} />
                  ) : data?.lastActivity ? (
                    moment(data.lastActivity).format('DD-MMM-YYYY')
                  ) : (
                    'Last active date is not available'
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col w-full"></div>
          )}

          <div className="flex mt-3 xl:mt-0 relative">
            <div className="select relative mr-2 float-right">
              <div
                className="flex justify-between pl-3 pr-5 items-center cursor-pointer box-border w-[173px] h-3.06 rounded-0.6 shadow-contactCard app-input-card-border"
                ref={integrationDropDownRef}
                onClick={handleIntegrationDropDownActive}
              >
                <div className="font-Poppins font-semibold text-card text-memberDay leading-4">
                  {selectedIntegration ? selectedIntegration : 'All Integrations'}
                </div>
                <div>
                  <img src={dropDownIcon} alt="" className={isIntegrationDropDownActive ? 'rotate-180' : 'rotate-0'} />
                </div>
              </div>
              {isIntegrationDropDownActive && (
                <div
                  className="absolute flex flex-col text-left pt-2 px-2 cursor-pointer box-border w-full bg-white z-40 rounded-0.6 shadow-contactCard pb-2 app-input-card-border"
                  onClick={handleIntegrationDropDownActive}
                >
                  <div className="w-full hover:bg-signUpDomain rounded-0.3 transition ease-in duration-100">
                    <div
                      className="h-1.93 px-3 flex items-center font-Poppins text-trial font-normal leading-4 text-searchBlack "
                      onClick={() => selectPlatformForActivityScroll('All Integration')}
                    >
                      All Integrations
                    </div>
                  </div>
                  {PlatformFilterResponse?.map((options: PlatformResponse) => (
                    <div key={`${Math.random() + options.id}`} className="w-full hover:bg-signUpDomain rounded-0.3 transition ease-in duration-100">
                      {options?.isConnected && (
                        <div
                          className="h-1.93 px-3 flex items-center font-Poppins text-trial font-normal leading-4 text-searchBlack "
                          onClick={() => selectPlatformForActivityScroll(options?.name, options?.id)}
                        >
                          {options?.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="select relative" ref={dateFilterDropDownRef}>
              <div
                className="flex justify-between pl-3 pr-5 items-center cursor-pointer box-border w-9.59 h-3.06 rounded-0.6 shadow-contactCard app-input-card-border"
                onClick={handleFilterDropDownActive}
              >
                <div className="font-Poppins font-semibold text-card text-memberDay leading-4">Filters</div>
                <div>
                  <img src={dropDownIcon} alt="" className={isFilterDropDownActive ? 'rotate-180' : 'rotate-0'} />
                </div>
              </div>
              {isFilterDropDownActive && (
                <div className="absolute flex flex-col text-left px-2 pt-2  cursor-pointer box-border w-full bg-white z-40 rounded-0.6 shadow-contactCard pb-2 app-input-card-border">
                  <div className="relative flex items-center">
                    <DatePicker
                      ref={datePickerRefStart}
                      selected={fromDate}
                      maxDate={new Date()}
                      onChange={(date: Date) => setFromDate(date)}
                      className=" h-3.06 app-result-card-border shadow-reportInput w-full rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="From"
                      dateFormat="dd/MM/yyyy"
                    />
                    <img
                      className="absolute icon-holder right-4 cursor-pointer"
                      src={calendarIcon}
                      alt=""
                      onClick={() => handleClickDatePickerIcon('start')}
                    />
                  </div>
                  <div className="relative flex items-center pt-1">
                    <DatePicker
                      selected={toDate}
                      ref={datePickerRefEnd}
                      minDate={fromDate}
                      maxDate={new Date()}
                      selectsEnd
                      startDate={fromDate}
                      endDate={toDate}
                      onChange={(date: Date) => setToDate(date)}
                      className=" h-3.06 app-result-card-border shadow-reportInput w-full rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="To"
                      dateFormat="dd/MM/yyyy"
                    />
                    <img
                      className="absolute icon-holder right-4 cursor-pointer"
                      src={calendarIcon}
                      alt=""
                      onClick={() => handleClickDatePickerIcon('end')}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-1.56 pt-8 px-1.62 box-border w-full rounded-0.6 shadow-contactCard app-input-card-border pb-5 h-[325px]">
          {memberProfileCardData?.map((data: MemberProfileCard) => (
            <div key={data.id} className="flex justify-between ">
              <div className="font-Poppins text-card leading-4 font-medium">
                {' '}
                {memberProfileCardLoader ? (
                  <Skeleton width={width_90} />
                ) : data?.lastActivity ? (
                  moment(data.lastActivity).format('DD-MMM-YYYY')
                ) : (
                  'Last active date is not available'
                )}
              </div>
              {activityData?.result?.length ? (
                <div onClick={navigateToActivities} className="font-Poppins font-normal leading-4 text-listGray text-preview cursor-pointer">
                  {memberProfileCardLoader ? <Skeleton width={width_90} /> : 'Preview All'}
                </div>
              ) : null}
            </div>
          ))}

          <div
            onScroll={handleScroll}
            className="flex flex-col pt-8 gap-0.83 height-member-activity overflow-scroll overflow-y-scroll member-section"
          >
            {activityDataLoader ? (
              <Skeleton width={500} className={'my-4'} count={6} />
            ) : activityData?.result.length !== 0 ? (
              <ul>
                {todayDate.length > 0 && (
                  <>
                    <h3 className="font-medium pl-7 text-m font-Poppins  text-xs pb-2">Today</h3>
                    {todayDate.map((item: ActivityResult) => (
                      <>
                        <li key={item.activityId} className="my-4 active-list relative">
                          <div className="w-full flex justify-start items-center">
                            <div className="ml-2.024 bottom-line ">
                              <img src={yellowDottedIcon} />
                            </div>
                            <div className="ml-0.71 ">
                              <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.platforms?.platformLogoUrl ?? ''} alt="" />
                            </div>
                            <div className="ml-0.865">
                              <div>
                                <p className="font-medium text-xs font-Poppins">{item?.displayValue}</p>
                              </div>
                              <div className="font-Poppins text-[10px] not-italic font-normal text-[#544e4e] dark:text-greyDark">
                                <p> {generateDateAndTime(`${item?.activityTime}`, 'HH:MM')}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      </>
                    ))}
                  </>
                )}

                {yesterdayDate.length > 0 && (
                  <>
                    <h3 className="font-medium pl-7 text-m font-Poppins text-xs pb-2">Yesterday</h3>
                    {yesterdayDate.map((item: ActivityResult) => (
                      <>
                        <li key={item.memberId} className="my-4 active-list relative">
                          <div className="w-full flex justify-start items-center">
                            <div className="ml-2.024 bottom-line ">
                              <img src={yellowDottedIcon} />
                            </div>
                            <div className="ml-0.71 ">
                              <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.platforms?.platformLogoUrl ?? ''} alt="" />
                            </div>
                            <div className="ml-0.865">
                              <div>
                                <p className="font-medium text-xs font-Poppins">{item?.displayValue}</p>
                              </div>
                              <div className="font-Poppins text-[10px] not-italic font-normal text-[#544e4e] dark:text-greyDark">
                                <p> {generateDateAndTime(`${item?.activityTime}`, 'HH:MM')}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      </>
                    ))}
                  </>
                )}

                {dateMapObj && (
                  <>
                    {Object.entries(dateMapObj).map((item: any) => (
                      <>
                        <h3 className="font-medium pl-7 text-m font-Poppins  text-xs mb-2" key={Math.random()}>
                          {' '}
                          {item[0] ? item[0] : ''}
                        </h3>

                        {item[1].map((item: any) => (
                          <li key={Math.random()} className=" my-4 active-list relative">
                            <div className="w-full flex justify-start items-center">
                              <div className="ml-2.024 bottom-line ">
                                <img src={yellowDottedIcon} />
                              </div>
                              <div className="ml-0.71 ">
                                <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.platforms?.platformLogoUrl ?? ''} alt="" />
                              </div>
                              <div className="ml-0.865">
                                <div>
                                  <p className="font-medium text-xs font-Poppins">{item?.displayValue}</p>
                                </div>
                                <div className="font-Poppins text-[10px] not-italic font-normal text-[#544e4e] dark:text-greyDark">
                                  <p> {generateDateAndTime(`${item?.activityTime}`, 'HH:MM')}</p>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </>
                    ))}
                  </>
                )}
              </ul>
            ) : (
              <div className="font-Poppins font-semibold text-base leading-9 text-listGray flex justify-center">Member activity is not available</div>
            )}
          </div>
        </div>
      </div>
      <div className=" flex flex-col ml-1.8">
        {memberProfileCardLoader ? (
          <div className=" flex flex-col ">
            <div className="profile-card items-center btn-save-modal justify-center pro-bag rounded-t-0.6 w-18.125 shadow-contactBtn box-border h-6.438 "></div>
            <div className="flex flex-col profile-card items-center justify-center bg-white rounded-b-0.6 w-18.125 shadow-contactCard box-border h-11.06">
              <div className="-mt-24">
                <Skeleton circle width={'100px'} className="bg-cover bg-center border-5 h-100" />
              </div>
              <div className="mt-0.688 text-profileBlack font-semibold font-Poppins leading-1.31 text-trial">
                <Skeleton width={width_90} />
              </div>
              <div className="text-center pt-0.125 font-Poppins text-profileBlack text-member">
                <Skeleton width={width_90} />
              </div>
              {/* <div className="flex gap-1 pt-1.12  mt-2 loader-avatar">
                <div>
                  <Skeleton circle height="100%" />
                </div>
              </div> */}
            </div>
          </div>
        ) : (
          memberProfileCardData?.map((data: MemberProfileCard) => (
            <div key={`${Math.random() + data.id}`} className=" flex flex-col">
              <div className="profile-card items-center btn-save-modal justify-center pro-bag rounded-t-0.6 w-18.125 shadow-contactBtn box-border h-6.438 "></div>
              <div className="flex flex-col profile-card items-center justify-center bg-white rounded-b-0.6 w-18.125 shadow-contactCard box-border h-11.06">
                <div className="-mt-24">
                  <img
                    src={data?.profilePictureUrl ? data?.profilePictureUrl : profileImage}
                    alt="profileImage"
                    className="bg-cover bg-center border-5 border-white rounded-full w-100 h-100"
                  />
                </div>
                <div className="mt-0.688 text-profileBlack font-semibold font-Poppins leading-1.31 text-trial capitalize">{data?.name}</div>
                <div className="text-center pt-0.125 font-Poppins text-profileBlack text-member">
                  {data?.email} || {data?.organization}
                </div>
                <div className="flex gap-1 pt-1.12">
                  {data?.platforms.map((platformData) => (
                    <div key={`${Math.random() + platformData.id}`}>
                      <img src={platformData?.platformLogoUrl ?? ''} alt="" className="rounded-full w-[1.0012rem] h-[1.0012rem]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}

        <div className="mt-1.37 box-border w-18.125 rounded-0.6 shadow-profileCard app-input-card-border">
          <div className="flex flex-col p-5">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="font-Poppins font-medium text-error leading-5 text-profileBlack">Tags</div>
              <div className="font-Poppins font-medium text-error leading-5 text-addTag cursor-pointer" onClick={() => handleTagModalOpen(true)}>
                ADD TAG
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Modal
                isOpen={isTagModalOpen}
                shouldCloseOnOverlayClick={true}
                onRequestClose={() => setTagModalOpen(false)}
                className="w-24.31 h-18.75 mx-auto  rounded-lg modals-tag bg-white shadow-modal outline-none"
                style={{
                  overlay: {
                    display: 'flex',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    alignItems: 'center'
                  }
                }}
              >
                <div className="flex flex-col">
                  <h3 className="text-center font-Inter font-semibold text-xl mt-1.8 text-black leading-6">Add Tag</h3>
                  <form className="flex flex-col relative px-1.93 mt-9" onSubmit={(e) => handleAssignTagsName(e)}>
                    <label htmlFor="billingName " className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack ">
                      Tag Name
                    </label>
                    <Input
                      id="tags"
                      name="tags"
                      type="text"
                      className="mt-0.375 inputs box-border bg-white shadow-inputShadow rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                      placeholder="Enter Tag Name"
                      onChange={handleSearchTextChange}
                      value={tags.tagName || searchText}
                      errors={Boolean(errorMessage)}
                      helperText={errorMessage}
                    />
                    {!errorMessage && (
                      <div
                        className={`bg-white absolute top-20 w-[20.625rem] max-h-full app-input-card-border rounded-lg overflow-scroll z-40 ${
                          tagDropDownOption ? '' : 'hidden'
                        }`}
                      >
                        {TagFilterResponseData?.map((data: TagResponseData) => (
                          <div
                            ref={tagDropDownRef}
                            key={data.id}
                            className="p-2 text-searchBlack cursor-pointer font-Poppins font-normal text-trial leading-1.31 hover:font-medium hover:bg-signUpDomain transition ease-in duration-300"
                            onClick={() => handleSelectTagName(data.name, data.id)}
                          >
                            {data.name}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex absolute right-1 top-24 pr-6 items-center">
                      <Button
                        type="button"
                        text="CANCEL"
                        className="mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel w-5.25 h-2.81 rounded border-none"
                        onClick={() => handleTagModalOpen(false)}
                      />
                      <Button
                        type="submit"
                        disabled={tagsAssignLoader || tagAssignLoading}
                        text="SAVE"
                        className={`save text-white font-Poppins text-error font-medium leading-5 cursor-pointer rounded shadow-contactBtn w-5.25 h-2.81  border-none btn-save-modal ${
                          tagsAssignLoader ? ' opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </form>
                </div>
              </Modal>
            </div>

            <div className="flex flex-wrap pt-1.56 gap-2">
              {memberProfileCardData?.map((data: MemberProfileCard) =>
                data.tags?.map((tag: TagResponseData) => (
                  <>
                    <div
                      data-tip
                      data-for={tag.name}
                      className="labels flex  items-center px-2  h-8 rounded bg-tagSection cursor-pointer"
                      key={`${Math.random() + data.id}`}
                    >
                      <div className="font-Poppins text-profileBlack font-normal text-card leading-4 pr-1 tags-ellipse capitalize">{tag.name}</div>
                      <div className="pl-2">
                        <img src={closeIcon} alt="" onClick={() => handleUnAssignTagsName(tag.id)} />
                      </div>
                    </div>
                    <ReactTooltip id={tag.name} textColor="" backgroundColor="" effect="solid">
                      <span className="font-Poppins text-card font-normal leading-5 pr-4">{tag.name}</span>
                    </ReactTooltip>
                  </>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="mt-1.8">
          <Button
            type="button"
            text={memberProfileCardData[0]?.isMerged ? 'Merged Members' : 'Merge Members'}
            className="cursor-pointer border-none font-Poppins font-medium text-search leading-5 btn-save-modal hover:shadow-buttonShadowHover transition ease-in duration-300 text-white shadow-contactBtn rounded-0.3 w-full h-3.06"
            onClick={() => (memberProfileCardData[0]?.isMerged ? navigate(`/${workspaceId}/members/${memberId}/merged-members`) : handleModal(true))}
          />
        </div>
      </div>
      {MergeModalComponent}
    </div>
  );
};

export default MembersProfile;
