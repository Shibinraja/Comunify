/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Button from 'common/button';
import { format } from 'date-fns';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import calendarIcon from '../../../../assets/images/calandar.svg';
import closeIcon from '../../../../assets/images/close-member.svg';
import dropDownIcon from '../../../../assets/images/profile-dropdown.svg';
import searchIcon from '../../../../assets/images/search.svg';
import slackIcon from '../../../../assets/images/slack.svg';
import unsplashIcon from '../../../../assets/images/unsplash_mj.svg';
import yellowDottedIcon from '../../../../assets/images/yellow_dotted.svg';
import { useAppSelector } from '../../../../hooks/useRedux';
import { generateDateAndTime } from '../../../../lib/helper';
import { AppDispatch } from '../../../../store';
import { ActivityResult, MemberProfileCard } from '../../interface/members.interface';
import membersSlice from '../../store/slice/members.slice';
import MembersProfileGraph from '../membersProfileGraph/MembersProfileGraph';
import Skeleton from 'react-loading-skeleton';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import { count_5, width_90 } from 'constants/constants';
import usePlatform from '../../../../hooks/usePlatform';
import { AssignTypeEnum, PlatformResponse, TagResponseData } from '../../../settings/interface/settings.interface';
import settingsSlice from 'modules/settings/store/slice/settings.slice';
import useDebounce from '@/hooks/useDebounce';
import ReactTooltip from 'react-tooltip';
import * as Yup from 'yup';
import Input from 'common/input';

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

  const {
    membersActivityData: activityData,
    membersProfileActivityGraphData: activityGraphData,
    memberProfileCardData
  } = useAppSelector((state) => state.members);

  const memberProfileCardLoader = useSkeletonLoading(membersSlice.actions.getMembersActivityGraphData.type);
  const activityDataLoader = useSkeletonLoading(membersSlice.actions.getMembersActivityDataInfiniteScroll.type);
  const platformData = usePlatform();

  const tagDropDownRef = useRef<HTMLDivElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const datePickerRefStart = useRef<ReactDatePicker>(null);
  const datePickerRefEnd = useRef<ReactDatePicker>(null);

  const {
    TagFilterResponse: { data: TagFilterResponseData },
    clearValue
  } = useAppSelector((state) => state.settings);

  const debouncedValue = useDebounce(searchText, 300);

  const TagNameValidation = Yup.string()
    .trim('WhiteSpaces are not allowed')
    .min(2, 'Tag Name must be atleast 2 characters')
    .max(20, 'Tag Name should not exceed above 20 characters')
    .required('Tag Name is a required field')
    .nullable(true);

  useEffect(() => {
    dispatch(membersSlice.actions.getMembersActivityGraphData({ workspaceId: workspaceId as string, memberId: memberId as string }));
    dispatch(membersSlice.actions.getMemberProfileCardData({ workspaceId: workspaceId as string, memberId: memberId as string }));
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('click', handleDropDownClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.addEventListener('click', handleDropDownClick);
    };
  }, []);

  useEffect(() => {
    loadActivityData(true);
  }, [platform, fromDate, toDate, fromDate && toDate]);

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
    if (TagFilterResponseData?.length && searchText) {
      setTagDropDownOption(true);
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
        fromDate: fromDate && format(fromDate, 'yyyy-MM-dd'),
        toDate: toDate && format(toDate, 'yyyy-MM-dd')
      })
    );
  };
  const handleModal = (val: boolean) => {
    setIsModalOpen(val);
  };

  const handleTagModalOpen = (value:boolean): void => {
    setErrorMessage('');
    setTagModalOpen(value);
    setTags({
      tagId: '',
      tagName: ''
    });
    setSearchText('');
    dispatch(
      settingsSlice.actions.getTagFilterData({
        data: [],
        totalPages: 0,
        previousPage: 0,
        nextPage: 0
      })
    );
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

  const navigateToReviewMerge = () => {
    navigate(`${workspaceId}/members/${memberId}/members-review`);
  };

  // switch case for member graph
  const selectPlatformToDisplayOnGraph = (name: string) => {
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
            platform: name.toLocaleLowerCase().trim()
          })
        );
        break;
      default:
        break;
    }
  };

  // switch case for member platforms
  const selectPlatformForActivityScroll = (name: string) => {
    setSelectedIntegration(name);
    switch (name) {
      case 'All Integration':
        setPlatform(undefined);
        break;
      case `${name !== undefined && name !== 'All Integration' && name}`:
        setPlatform(name.toLocaleLowerCase().trim());
        break;
      default:
        break;
    }
  };
  // function to listen for scroll event
  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    event.preventDefault();
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      setActivityNextCursor(activityData?.nextCursor);
      if (activityData.nextCursor !== null && !activityDataLoader) {
        loadActivityData(false, activityData.nextCursor);
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
    setTagDropDownOption(false);
    setTags({
      tagId,
      tagName
    });
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
    } catch ({ message }) {
      setErrorMessage(message);
    }
  };

  const handleAssignTagsName =  (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (errorMessage || !searchText) {
      setErrorMessage(errorMessage || 'TagName is a required field');
    } else{
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

  const handleUnAssignTagsName = (id: string): void => {
    dispatch(
      settingsSlice.actions.unAssignTags({
        memberId: memberId!,
        unAssignTagBody: {
          tagId: id
        },
        workspaceId: workspaceId!
      })
    );
  };

  return (
    <div className="flex pt-3.93 w-full">
      <div className="flex flex-col w-full">
        <div className="p-5 flex flex-col box-border  rounded-0.6 shadow-contactCard app-input-card-border">
          <div className="flex justify-between items-center relative">
            <div className="font-Poppins font-semibold text-base leading-9 text-accountBlack">Member Activity by Source</div>
            <div className="select relative">
              <div
                className="flex justify-around items-center cursor-pointer box-border w-9.59 h-3.06 rounded-0.6 shadow-contactCard app-input-card-border "
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
                  className="absolute flex flex-col text-left px-5 pt-2  cursor-pointer box-border w-full bg-white z-40 rounded-0.6 shadow-contactCard pb-2 app-input-card-border"
                  onClick={handleDropDownActive}
                >
                  <div
                    className='className="rounded-0.3 h-1.93 flex items-center font-Poppins text-trial font-normal leading-4 text-searchBlack hover:bg-signUpDomain transition ease-in duration-100'
                    onClick={() => selectPlatformToDisplayOnGraph('All')}
                  >
                    All
                  </div>
                  {platformData?.map((data: PlatformResponse) => (
                    <div key={`${data?.id + data?.name}`}>
                      {data?.isConnected && (
                        <div
                          className="rounded-0.3 h-1.93 flex items-center font-Poppins text-trial font-normal leading-4 text-searchBlack hover:bg-signUpDomain transition ease-in duration-100"
                          onClick={() => selectPlatformToDisplayOnGraph(data?.name)}
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
        <div className="flex pt-2.18 items-center">
          {memberProfileCardLoader ? (
            <div className="flex flex-col w-full">
              <Skeleton width={width_90} />
            </div>
          ) : (
            memberProfileCardData?.map((data: MemberProfileCard) => (
              <div key={data?.id + data?.name} className="flex flex-col w-full">
                <div className="font-Poppins font-normal text-card leading-4 text-renewalGray">Last Active Date</div>
                <div className="font-Poppins font-semibold text-base leading-6 text-accountBlack">
                  {data?.lastActivity ? generateDateAndTime(`${data?.lastActivity}`, 'MM-DD-YYYY') : 'Last active date not available'}
                </div>
              </div>
            ))
          )}

          <div className="select relative mr-2 float-right">
            <div
              className="flex justify-around items-center cursor-pointer box-border w-9.59 h-3.06 rounded-0.6 shadow-contactCard app-input-card-border"
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
                {platformData.map((options: PlatformResponse) => (
                  <div key={`${options?.id + options?.name}`} className="w-full hover:bg-signUpDomain rounded-0.3 transition ease-in duration-100">
                    {options?.isConnected && (
                      <div
                        className="h-1.93 px-3 flex items-center font-Poppins text-trial font-normal leading-4 text-searchBlack "
                        onClick={() => selectPlatformForActivityScroll(options?.name)}
                      >
                        {options?.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="select relative">
            <div
              className="flex justify-around items-center cursor-pointer box-border w-9.59 h-3.06 rounded-0.6 shadow-contactCard app-input-card-border"
              onClick={handleFilterDropDownActive}
            >
              <div className="font-Poppins font-semibold text-card text-memberDay leading-4">Filters</div>
              <div>
                <img src={dropDownIcon} alt="" className={isFilterDropDownActive ? 'rotate-180' : 'rotate-0'} />
              </div>
            </div>
            {isFilterDropDownActive && (
              <div className="absolute flex flex-col text-left px-2 pt-2  cursor-pointer box-border w-full bg-white z-40 rounded-0.6 shadow-contactCard pb-2 app-input-card-border">
                <div className="relative flex items-center ">
                  <DatePicker
                    selected={fromDate}
                    onChange={(date: Date) => setFromDate(date)}
                    className=" h-3.06 app-result-card-border shadow-reportInput w-full rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                    placeholderText="From"
                    ref={datePickerRefStart}
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
                    onChange={(date: Date) => setToDate(date)}
                    className=" h-3.06 app-result-card-border shadow-reportInput w-full rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                    placeholderText="To"
                    ref={datePickerRefEnd}
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
        <div className="mt-1.56 pt-8 px-1.62 box-border w-full rounded-0.6 shadow-contactCard app-input-card-border pb-5">
          {memberProfileCardLoader ? (
            <Skeleton width={width_90} count={count_5} />
          ) : (
            memberProfileCardData?.map((data: MemberProfileCard) => (
              <div key={data?.id + data?.name} className="flex justify-between ">
                <div className="font-Poppins text-card leading-4 font-medium">
                  {' '}
                  {data?.lastActivity ? generateDateAndTime(`${data?.lastActivity}`, 'MM-DD-YYYY') : 'Last active date not available'}
                </div>
                <div onClick={navigateToActivities} className="font-Poppins font-normal leading-4 text-renewalGray text-preview cursor-pointer">
                  Preview All
                </div>
              </div>
            ))
          )}

          <div
            onScroll={handleScroll}
            className="flex flex-col pt-8 gap-0.83 height-member-activity overflow-scroll overflow-y-scroll member-section"
          >
            {activityDataLoader ? (
              <Skeleton width={500} className={'my-4'} count={6} />
            ) : (
              activityData.result.map((data: ActivityResult) => (
                <div key={data?.id} className="flex items-center">
                  <div>
                    <img src={yellowDottedIcon} alt="" />
                  </div>
                  <div className="pl-0.68">
                    <img src={slackIcon} alt="" className="rounded-full w-[1.835rem] h-[1.835rem]" />
                  </div>
                  <div className="flex flex-col pl-0.89">
                    <div className="font-Poppins font-normal text-card leading-4">{data?.displayValue}</div>
                    <div className="font-Poppins left-4 font-normal text-profileEmail text-duration">
                      {new Date(`${data?.activityTime}`).getHours()} hours ago
                    </div>
                  </div>
                </div>
              ))
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
                <Skeleton circle height="100%" />
              </div>
              <div className="mt-0.688 text-profileBlack font-semibold font-Poppins leading-1.31 text-trial">
                <Skeleton width={width_90} />
              </div>
              <div className="text-center pt-0.125 font-Poppins text-profileBlack text-member">
                <Skeleton width={width_90} />
              </div>
              <div className="flex gap-1 pt-1.12  mt-2 loader-avatar">
                <div>
                  <Skeleton circle height="100%" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          memberProfileCardData?.map((data: MemberProfileCard) => (
            <div key={data?.id + data?.createdAt} className=" flex flex-col">
              <div className="profile-card items-center btn-save-modal justify-center pro-bag rounded-t-0.6 w-18.125 shadow-contactBtn box-border h-6.438 "></div>
              <div className="flex flex-col profile-card items-center justify-center bg-white rounded-b-0.6 w-18.125 shadow-contactCard box-border h-11.06">
                <div className="-mt-24">
                  <img src={data?.profileUrl} alt="profileImage" className="bg-cover bg-center border-8 border-white rounded-full w-24" />
                </div>
                <div className="mt-0.688 text-profileBlack font-semibold font-Poppins leading-1.31 text-trial">{data?.name}</div>
                <div className="text-center pt-0.125 font-Poppins text-profileBlack text-member">
                  {data?.email} || {data?.organization}
                </div>
                <div className="flex gap-1 pt-1.12">
                  <div>
                    <img src={slackIcon} alt="" className="rounded-full w-[1.0012rem] h-[1.0012rem]" />
                  </div>
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
              <div className="flex items-center justify-center">
                <Modal
                  isOpen={isTagModalOpen}
                  shouldCloseOnOverlayClick={false}
                  onRequestClose={() => setIsModalOpen(false)}
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
                      <div className="flex absolute right-1 top-24 pr-6 items-center">
                        <Button
                          type="button"
                          text="CANCEL"
                          className="mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel w-5.25 h-2.81 rounded border-none"
                          onClick={() => handleTagModalOpen(false)}
                        />
                        <Button
                          type="submit"
                          text="SAVE"
                          className="save text-white font-Poppins text-error font-medium leading-5 cursor-pointer rounded shadow-contactBtn w-5.25 h-2.81  border-none btn-save-modal"
                        />
                      </div>
                    </form>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="flex flex-wrap pt-1.56 gap-2">
              {memberProfileCardData?.map((data: MemberProfileCard) =>
                data.tags?.map((tag: TagResponseData) => (
                  <>
                    <div
                      data-tip
                      data-for={tag.name}
                      className="labels flex  items-center px-2  h-8 rounded bg-tagSection cursor-pointer"
                      key={tag.id}
                    >
                      <div className="font-Poppins text-profileBlack font-normal text-card leading-4 pr-4 tags-ellipse">{tag.name}</div>
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
            text="Merge Members"
            className="cursor-pointer border-none font-Poppins font-medium text-search leading-5 btn-save-modal hover:shadow-buttonShadowHover transition ease-in duration-300 text-white shadow-contactBtn rounded-0.3 w-full h-3.06"
            onClick={() => handleModal(true)}
          />
        </div>
        <Modal
          isOpen={isModalOpen}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => setIsModalOpen(false)}
          className="w-24.31 pb-28 mx-auto  mt-32 rounded-lg modals-tag bg-white shadow-modal "
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
          <div className="flex flex-col ml-1.8 pt-9 ">
            <h3 className="font-Inter font-semibold text-xl leading-1.43">Merge Members</h3>
            <div className="flex relative items-center mt-1.43">
              <input
                type="text"
                className="input-merge-search focus:outline-none px-3 pr-8 box-border w-20.5 h-3.06 rounded-0.6 shadow-profileCard placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.31 placeholder:text-searchGray"
                placeholder="Search Members"
              />
              <div className="absolute right-12 w-0.78 h-3 z-40">
                <img src={searchIcon} alt="" />
              </div>
            </div>
            <div className="flex-flex-col relative mt-1.8">
              <div className="flex">
                <div className="mr-0.34">
                  <input type="checkbox" className="checkbox" />
                </div>
                <div className="flex flex-col">
                  <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">Emerson Schleifer</div>
                  <div className="text-tagEmail font-Poppins font-normal leading-1.31 text-email pl-1">dmrity125@mail.com | neoito technologies</div>
                  <div className="flex mt-2.5">
                    <div className="mr-0.34 w-1.001 h-1.001">
                      <img src={slackIcon} alt="" />
                    </div>
                    <div className="mr-0.34 w-1.001 h-1.001">
                      <img src={unsplashIcon} alt="" />
                    </div>
                    <div className="mr-0.34 w-1.001 h-1.001">
                      <img src={slackIcon} alt="" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex absolute right-8 mt-1.8">
                <Button
                  type="button"
                  text="CANCEL"
                  className="mr-2.5 font-Poppins text-error font-medium border-cancel  leading-1.31 text-thinGray cursor-pointer w-5.25 h-2.81 rounded box-border"
                  onClick={() => setIsModalOpen(false)}
                />
                <Button
                  type="button"
                  text="SUBMIT"
                  className="submit border-none text-white font-Poppins text-error font-medium leading-1.31 cursor-pointer w-5.25 h-2.81 rounded shadow-contactBtn btn-save-modal"
                  onClick={navigateToReviewMerge}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MembersProfile;
