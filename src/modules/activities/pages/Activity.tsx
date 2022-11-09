/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useDebounce from '@/hooks/useDebounce';
import { API_ENDPOINT } from '@/lib/config';
import fetchExportList from '@/lib/fetchExport';
import Button from 'common/button';
import Input from 'common/input';
import Pagination from 'common/pagination/pagination';
// eslint-disable-next-line object-curly-newline
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import { width_90 } from 'constants/constants';
import { format, parseISO } from 'date-fns';
import membersSlice from 'modules/members/store/slice/members.slice';
import { AssignTypeEnum, TagResponseData } from 'modules/settings/interface/settings.interface';
import settingsSlice from 'modules/settings/store/slice/settings.slice';
// eslint-disable-next-line object-curly-newline
import React, { ChangeEvent, FormEvent, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Skeleton from 'react-loading-skeleton';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import * as Yup from 'yup';
import closeIcon from '../../../assets/images/close.svg';
import exportImage from '../../../assets/images/export.svg';
import noActivityIcon from '../../../assets/images/no-reports.svg';
import { useAppSelector } from '../../../hooks/useRedux';
import { generateDateAndTime } from '../../../lib/helper';
import { ActiveStreamData, ActivityCard, ProfileModal } from '../interfaces/activities.interface';
import activitiesSlice from '../store/slice/activities.slice';
import './Activity.css';
import { activityFilterExportProps } from './activity.types';
import ActivityFilter from './ActivityFilter';
import profileImage from '../../../assets/images/user-image.svg';

Modal.setAppElement('#root');

const Activity: React.FC = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { workspaceId } = useParams();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isTagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [ProfileModal, setProfileModal] = useState<Partial<ProfileModal>>({
    id: '',
    email: '',
    isOpen: false,
    memberName: '',
    memberProfileUrl: '',
    organization: '',
    profilePictureUrl: '',
    platformLogoUrl: '',
    platforms: []
  });
  const [ActivityCard, setActivityCard] = useState<Partial<ActivityCard>>();
  const [page, setPage] = useState<number>(1);
  const [searchTagText, setSearchTagText] = useState<string>('');
  const [checkedActivityId, setCheckedActivityId] = useState<Record<string, unknown>>({});
  const [filterExportParams, setFilterExportParams] = useState<activityFilterExportProps>({
    checkTags: '',
    checkPlatform: '',
    endDate: '',
    startDate: ''
  });
  const [tags, setTags] = useState<{
    tagName: string;
    tagId: string;
  }>({
    tagName: '',
    tagId: ''
  });
  const [tagDropDownOption, setTagDropDownOption] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | unknown>('');
  const [fetchLoader, setFetchLoader] = useState<boolean>(false);
  const [tagAssignLoading, setTagAssignLoading] = useState<boolean>(false);
  const [tagUnAssignLoading, setTagUnAssignLoading] = useState<boolean>(true);

  const dropDownRef = useRef<HTMLDivElement>(null);
  const tagDropDownRef = useRef<HTMLDivElement>(null);

  const limit = 10;
  const activityId = searchParams.get('activityId');
  const [searchText, setSearchText] = useState<string>('');
  const debouncedValue = useDebounce(searchText, 300);
  const debouncedTagValue = useDebounce(searchTagText, 300);

  const loader = useSkeletonLoading(activitiesSlice.actions.getActiveStreamData.type);

  const { data, totalPages } = useAppSelector((state) => state.activities.activeStreamData);
  const {
    TagFilterResponse: { data: TagFilterResponseData },
    clearValue
  } = useAppSelector((state) => state.settings);
  const tagsAssignLoader = useSkeletonLoading(settingsSlice.actions.assignTags.type);

  useEffect(() => {
    dispatch(
      activitiesSlice.actions.getActiveStreamData({
        activeStreamQuery: {
          page,
          limit,
          search: searchText,
          tags: { searchedTags: '', checkedTags: filterExportParams.checkTags.toString() },
          platforms: filterExportParams.checkPlatform.toString(),
          'activity.lte': filterExportParams.endDate,
          'activity.gte': filterExportParams.startDate,
          activityId: activityId as string
        },
        workspaceId: workspaceId!
      })
    );
    dispatch(
      settingsSlice.actions.tagFilterData({
        settingsQuery: { page: 1, limit, tags: { searchedTags: '', checkedTags: '' } },
        workspaceId: workspaceId!
      })
    );
  }, [page]);

  useEffect(() => {
    setTagUnAssignLoading(true);
  }, [ActivityCard]);

  useEffect(() => {
    setTagAssignLoading(false);
    if (TagFilterResponseData?.length && searchTagText) {
      setTagDropDownOption(true);
    }

    if (TagFilterResponseData?.length === 0) {
      setTagDropDownOption(false);
    }

    // if (TagFilterResponseData?.length === 0 && searchTagText) {
    //   setErrorMessage('No Record Found');
    // }
  }, [TagFilterResponseData]);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedValue) {
      getFilteredActiveStreamList(1, debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (debouncedTagValue) {
      getTagsList(1, debouncedTagValue);
    }
  }, [debouncedTagValue]);

  useEffect(() => {
    if (clearValue) {
      handleTagModalOpen(false);
    }
  }, [clearValue]);

  useEffect(() => {
    if (ActivityCard?.activityId) {
      data?.find((activity: ActiveStreamData) => {
        if (activity.id === ActivityCard.activityId) {
          setActivityCard((prevState) => ({ ...prevState, tags: activity.tags }));
        }
      });
    }
  }, [data]);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('click', handleDropDownClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('click', handleDropDownClick);
    };
  }, []);

  const TagNameValidation = Yup.string()
    .trim('WhiteSpaces are not allowed')
    .min(2, 'Tag Name must be atleast 2 characters')
    .max(15, 'Tag Name should not exceed above 15 characters')
    .required('Tag Name is a required field')
    .nullable(true);

  const filterTags = (tagId: string) => {
    const filteredTags = (ActivityCard?.tags as Array<{ id: string; name: string }>).filter((item) => item.id !== tagId);
    if (filteredTags.length) {
      setActivityCard((prevState) => ({ ...prevState, tags: filteredTags }));
    }
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

  const handleDropDownClick = (event: MouseEvent) => {
    if (tagDropDownRef && tagDropDownRef.current && !tagDropDownRef.current.contains(event.target as Node)) {
      setTagDropDownOption(false);
    }
  };

  // Function to close the popup modal of the member profile
  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && dropDownRef.current.contains(event.target as Node)) {
      setProfileModal((prevState) => {
        const prevProfileModal = { ...prevState };
        prevProfileModal['isOpen'] = true;
        return prevProfileModal;
      });
    } else {
      setProfileModal((prevState) => {
        const prevProfileModal = { ...prevState };
        prevProfileModal['isOpen'] = false;
        return prevProfileModal;
      });
    }
  };

  const handleModal = (data: ActivityCard) => {
    setModalOpen(data?.isOpen);
    setActivityCard({
      isOpen: data?.isOpen,
      memberName: data?.memberName,
      email: data?.email,
      displayValue: data?.displayValue,
      activityTime: data?.activityTime,
      description: data?.description,
      organization: data?.organization,
      sourceUrl: data?.sourceUrl,
      profilePictureUrl: data?.profilePictureUrl,
      value: data?.value,
      platformLogoUrl: data?.platformLogoUrl,
      memberId: data?.memberId,
      activityId: data?.activityId,
      platform: data?.platform,
      tags: data?.tags
    });
    dispatch(membersSlice.actions.getMemberProfileCardData({ workspaceId: workspaceId!, memberId: data.memberId }));
  };

  const handleTagModalOpen = (value: boolean): void => {
    setErrorMessage('');
    setTagModalOpen(value);
    setTags({
      tagId: '',
      tagName: ''
    });
    setSearchTagText('');
    dispatch(settingsSlice.actions.resetValue(false));
  };

  const handleProfileModal = (data: ProfileModal) => {
    setProfileModal({
      isOpen: data?.isOpen,
      id: data?.id,
      memberName: data.memberName,
      email: data.email,
      organization: data.organization,
      memberProfileUrl: data.memberProfileUrl,
      profilePictureUrl: data?.profilePictureUrl,
      platformLogoUrl: data?.platformLogoUrl,
      platforms: data?.platforms
    });
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (!searchText) {
      getFilteredActiveStreamList(1, searchText);
    }
    setPage(1);
    setSearchText(searchText);
  };

  const handleCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const checked_id: string = event.target.name;
    setCheckedActivityId((prevValue) => ({ ...prevValue, [checked_id]: event.target.checked }));
  };

  // Function to dispatch the search text to hit api of member list.
  const getFilteredActiveStreamList = (pageNumber: number, text: string) => {
    dispatch(
      activitiesSlice.actions.getActiveStreamData({
        activeStreamQuery: { page: pageNumber,
          limit,
          search: text,
          tags: { searchedTags: '', checkedTags: filterExportParams.checkTags.toString() },
          platforms: filterExportParams.checkPlatform.toString(),
          'activity.lte': filterExportParams.endDate,
          'activity.gte': filterExportParams.startDate        },
        workspaceId: workspaceId!
      })
    );
  };

  // Fetch members list data in comma separated value
  // eslint-disable-next-line space-before-function-paren
  const fetchActiveStreamListExportData = async () => {
    const checkedIds: Array<string> = [];

    if (Object.keys(checkedActivityId).length > 0) {
      Object.keys(checkedActivityId).map((platform: string) => {
        if (checkedActivityId[platform] === true) {
          checkedIds.push(platform);
        }
      });
    }
    setFetchLoader(true);
    await fetchExportList(
      `${API_ENDPOINT}/v1/${workspaceId}/activity/export`,
      {
        search: debouncedValue,
        tags: filterExportParams.checkTags,
        platforms: filterExportParams.checkPlatform,
        'activity.lte': filterExportParams.endDate,
        'activity.gte': filterExportParams.startDate,
        activityId: checkedIds.toString()
      },
      'ActiveStreamExport.xlsx'
    );
    setFetchLoader(false);
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

  const handleSearchTagTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    setSearchTagText(searchText);
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

  const handleAssignTagsName = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (errorMessage || !searchTagText) {
      setErrorMessage(errorMessage || 'Tag Name is a required field');
    } else {
      dispatch(
        settingsSlice.actions.assignTags({
          memberId: ActivityCard?.memberId as string,
          assignTagBody: {
            name: tags.tagName || searchTagText,
            viewName: tags.tagName || searchTagText,
            activityId: ActivityCard?.activityId,
            type: 'Activity' as AssignTypeEnum.Activity
          },
          filter: {
            search: debouncedValue,
            page,
            limit,
            tags: { searchedTags: '', checkedTags: filterExportParams.checkTags.toString() },
            platforms: filterExportParams.checkPlatform.toString(),
            'activity.lte': filterExportParams.endDate,
            'activity.gte': filterExportParams.startDate
          },
          workspaceId: workspaceId!
        })
      );
    }
  };

  const handleUnAssignTagsName = (id: string): void => {
    if (tagUnAssignLoading) {
      dispatch(
        settingsSlice.actions.unAssignTags({
          memberId: ActivityCard?.memberId as string,
          unAssignTagBody: {
            tagId: id,
            type: 'Activity' as AssignTypeEnum.Activity,
            activityId: ActivityCard?.activityId
          },
          filter: {
            search: debouncedValue,
            page,
            limit,
            tags: { searchedTags: '', checkedTags: filterExportParams.checkTags.toString() },
            platforms: filterExportParams.checkPlatform.toString(),
            'activity.lte': filterExportParams.endDate,
            'activity.gte': filterExportParams.startDate
          },
          workspaceId: workspaceId!
        })
      );
      filterTags(id);
    }
  };

  const ActiveStreamFilter = useMemo(
    () => (
      <ActivityFilter
        page={page}
        limit={limit}
        activityFilterExport={setFilterExportParams}
        searchText={debouncedValue}
        onPageChange={(page) => setPage(Number(page))}
      />
    ),
    [debouncedValue]
  );

  return (
    <div className="flex flex-col mt-1.8">
      <div className="flex items-center">
        <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 w-full">Activities</h3>
        <div>
          <Input
            type="text"
            name="search"
            id="searchId"
            className="app-input-card-border focus:outline-none px-4 mr-0.76 box-border h-3.06 w-19.06 bg-white  rounded-0.6 text-card placeholder:font-normal placeholder:leading-1.12 font-Poppins"
            placeholder="Search By Name or Email"
            onChange={handleSearchTextChange}
            value={searchText}
          />
        </div>
        <div className="-mr-3">{ActiveStreamFilter}</div>

        <div>
          <div
            aria-disabled={fetchLoader}
            className={`app-input-card-border w-6.98 h-3.06 rounded-0.6 shadow-shadowInput box-border bg-white items-center justify-evenly flex cursor-pointer hover:border-infoBlack transition ease-in-out duration-300 ${
              fetchLoader || !data.length ? 'cursor-not-allowed' : ''
            }`}
            onClick={() => (data.length ? !fetchLoader && fetchActiveStreamListExportData() : null)}
          >
            <h3 className="text-dropGray leading-1.12 font-Poppins font-semibold text-card">Export</h3>
            <img src={exportImage} alt="" />
          </div>
        </div>
      </div>
      {data?.length !== 0 ? (
        <div className="relative ">
          <div className="py-2 mt-1.868 overflow-x-auto activityTable">
            <div className="inline-block min-w-full align-middle rounded-0.6 border-table overflow-auto h-screen sticky top-0 fixActivityTableHead min-h-[31.25rem]">
              <table className="min-w-full w-full relative  rounded-t-0.6 ">
                <thead className="h-3.25  top-0 w-61.68 no-scroll-bar sticky z-10">
                  <tr className="min-w-full">
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray ">Members</th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                      Date & Time
                    </th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">Summary</th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">Source</th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                      Activity Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data?.map((data: ActiveStreamData) => (
                      <tr className="h-4.06 " key={data?.id}>
                        <td className="px-6 py-3 border-b">
                          {loader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div
                              className="flex  "
                              onMouseLeave={(e) => {
                                e.stopPropagation();
                                handleProfileModal({
                                  isOpen: false,
                                  id: data?.id,
                                  email: data?.email,
                                  memberName: data?.memberName,
                                  organization: data?.organization,
                                  memberProfileUrl: `/${workspaceId}/members/${data.primaryMemberId}/profile`,
                                  profilePictureUrl: data?.memberProfile,
                                  platformLogoUrl: data?.platformLogoUrl,
                                  platforms: data?.platforms || []
                                });
                              }}
                            >
                              <div className="py-3 mr-2">
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  id={data.id}
                                  name={data.id}
                                  checked={(checkedActivityId[data.id] as boolean) || false}
                                  onChange={handleCheckBox}
                                />
                              </div>
                              <div className="relative">
                                <div
                                  ref={dropDownRef}
                                  onMouseMove={(e) => {
                                    e.stopPropagation();
                                    handleProfileModal({
                                      isOpen: true,
                                      id: data?.id,
                                      email: data?.email,
                                      memberName: data?.memberName,
                                      organization: data?.organization,
                                      memberProfileUrl: `/${workspaceId}/members/${data.primaryMemberId}/profile`,
                                      profilePictureUrl: data?.memberProfile,
                                      platformLogoUrl: data?.platformLogoUrl,
                                      platforms: data?.platforms || []
                                    });
                                  }}
                                  className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer capitalize"
                                >
                                  {data?.memberName}
                                </div>
                                <div
                                  className={`mt-5 pl-5 absolute -top-10 z-10 ${
                                    ProfileModal?.isOpen && ProfileModal?.id === data?.id ? '' : 'hidden'
                                  } `}
                                >
                                  <div className="w-12.87 h-4.57 profile-card-header rounded-t-0.6"></div>
                                  <div className="w-12.87 pb-5 rounded-b-0.6 profile-card-body profile-inner shadow-profileCard flex flex-col items-center bg-white">
                                    <div className="-mt-10 flex items-center justify-center">
                                      <img
                                        src={ProfileModal?.profilePictureUrl ? ProfileModal?.profilePictureUrl: profileImage}
                                        alt=""
                                        className="rounded-full w-4.43 h-4.43 bg-cover bg-center border-4 border-white"
                                      />
                                    </div>
                                    <div className="font-semibold font-Poppins text-card text-profileBlack leading-1.12 pt-[0.2381rem] capitalize">
                                      {ProfileModal?.memberName}
                                    </div>
                                    <div className="text-profileEmail font-Poppins font-normal text-profileBlack text-center w-6.875 mt-0.146">
                                      {ProfileModal?.email} {ProfileModal?.organization}
                                    </div>
                                    <div className="flex mt-2.5">
                                      <div className="bg-cover bg-center mr-1 ">
                                        {ProfileModal?.platforms &&
                                          ProfileModal?.platforms.map((platformData) => (
                                            <div key={`${Math.random() + platformData.id}`}>
                                              <img
                                                src={platformData?.platformLogoUrl ?? ''}
                                                alt=""
                                                className="rounded-full w-[1.0012rem] h-[1.0012rem]"
                                              />
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                    <NavLink
                                      to={`${ProfileModal?.memberProfileUrl}`}
                                      className="mt-0.84 font-normal font-Poppins text-card underline text-profileBlack leading-5 cursor-pointer"
                                    >
                                      VIEW PROFILE
                                    </NavLink>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 pt-5 border-b">
                          {loader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="flex flex-col w-[100px]">
                              <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                                {data?.activityTime ? format(parseISO(data?.activityTime as unknown as string), 'dd MMM yyyy') : '--'}
                              </div>
                              <div className="font-medium font-Poppins text-card leading-1.31 text-tableDuration">
                                {/* {data?.activityTime ? format(parseISO(data?.activityTime as unknown as string), 'HH:MM') : '--'} */}
                                {generateDateAndTime(`${data?.activityTime}`, 'HH:MM')}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 pt-5 border-b ">
                          {loader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="flex gap-2 w-[200px]">
                              <img src={data?.platformLogoUrl} alt="" className="rounded-full w-[1.3419rem] h-[1.3419rem]" />
                              <div className="flex flex-col">
                                <div
                                  className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer"
                                  onClick={() =>
                                    handleModal({
                                      isOpen: true,
                                      memberName: data?.memberName,
                                      email: data?.email,
                                      description: data?.description,
                                      displayValue: data?.displayValue,
                                      activityTime: data?.activityTime,
                                      organization: data?.organization,
                                      sourceUrl: data?.sourceUrl,
                                      profilePictureUrl: data?.memberProfile as string,
                                      value: data?.value,
                                      platformLogoUrl: data?.platformLogoUrl,
                                      memberId: data?.memberId,
                                      activityId: data?.id,
                                      platform: data?.platform,
                                      tags: data?.tags || [],
                                      platforms: data.platforms || []
                                    })
                                  }
                                >
                                  {data?.displayValue}
                                </div>
                                <div className="font-medium font-Poppins text-card leading-1.31 text-tableDuration">
                                  {generateDateAndTime(`${data?.activityTime}`, 'MM-DD')}
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-3 border-b ">
                          {loader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="w-[150px] truncate">
                              <a
                                href={`${data?.sourceUrl}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="font-Poppins  font-medium text-trial text-infoBlack leading-1.31 underline cursor-pointer"
                              >
                                {data?.sourceUrl === null ? 'www.slack.com/profile' : data?.sourceUrl}
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3 border-b font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                          <div className="w-[150px] truncate">{loader ? <Skeleton width={width_90} /> : data?.type}</div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Modal
                isOpen={isModalOpen}
                shouldCloseOnOverlayClick={true}
                onRequestClose={() => setModalOpen(false)}
                className="mode w-32.5 mx-auto pb-10 border-none px-2.18 bg-white shadow-modal rounded outline-none"
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
                <div className="pt-9 flex flex-col activity-list-height">
                  <div className="flex justify-between">
                    <div className="font-Inter font-semibold text-black text-xl leading-6">Activity</div>
                    <div className="font-Poppins text-error leading-5 text-tag font-medium cursor-pointer" onClick={() => handleTagModalOpen(true)}>
                      ADD TAG
                    </div>
                    <Modal
                      isOpen={isTagModalOpen}
                      shouldCloseOnOverlayClick={true}
                      onRequestClose={() => setTagModalOpen(false)}
                      className="w-24.31 h-18.75 mx-auto  mt-32 rounded-lg modals-tag bg-white shadow-modal outline-none"
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
                            className="mt-0.375 inputs box-border bg-white shadow-shadowInput rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                            placeholder="Enter Tag Name"
                            onChange={handleSearchTagTextChange}
                            value={tags.tagName || searchTagText}
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
                          <div className="flex justify-end pt-10 items-center">
                            <Button
                              type="button"
                              text="CANCEL"
                              className="mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel w-5.25 h-2.81  rounded border-none"
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
                  <div className="mt-8 flex items-center">
                    <div className="bg-cover">
                      <img
                        src={ActivityCard?.profilePictureUrl === null ? profileImage : ActivityCard?.profilePictureUrl}
                        alt=""
                        className="rounded-full w-4.43 h-4.43 bg-cover bg-center border-4 border-white"
                      />
                    </div>
                    <div className="flex flex-col pl-0.563">
                      <div className="font-medium text-trial text-infoBlack font-Poppins leading-1.31">{ActivityCard?.memberName}</div>
                      <div className="font-Poppins text-email leading-5 text-tagEmail font-normal">
                        {ActivityCard?.email} | {ActivityCard?.organization}
                      </div>
                    </div>
                  </div>
                  <div className="bg-activitySubCard rounded flex flex-col pt-2.5 pl-0.81 pb-[0.5625rem] mt-5">
                    <div className="flex items-center">
                      <div className="w-5 h-5">
                        <img src={ActivityCard?.platformLogoUrl ? ActivityCard?.platformLogoUrl : ''} alt="" />
                      </div>
                      <div
                        className="pl-0.563 font-Poppins font-medium text-infoBlack text-card leading-1.12"
                        dangerouslySetInnerHTML={{ __html: ActivityCard?.displayValue ? ActivityCard?.displayValue : '--' }}
                      ></div>
                    </div>
                    <div
                      className="mt-5 w-full truncate font-Poppins font-medium text-infoBlack text-card leading-1.12"
                      dangerouslySetInnerHTML={{
                        __html: ActivityCard?.value ? ActivityCard?.value : '--'
                      }}
                    ></div>
                    <div className="mt-1.18 flex justify-between items-center">
                      <a
                        href={`${ActivityCard?.sourceUrl}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-Poppins font-medium text-card leading-1.12 text-tag underline cursor-pointer"
                      >
                        {`VIEW ON ${ActivityCard?.platform?.toLocaleUpperCase()}`}
                      </a>
                      <div className="top-5 font-Poppins font-medium pr-3 text-card leading-1.12 text-subscriptionMonth">
                        {generateDateAndTime(`${ActivityCard?.activityTime}`, 'HH:MM')} |{' '}
                        {generateDateAndTime(`${ActivityCard?.activityTime}`, 'MM-DD')}
                      </div>
                    </div>
                  </div>
                  <div className="mt-7">
                    <h3 className="text-profileBlack text-error font-Poppins font-medium leading-5">Tags</h3>
                    <div className="flex pt-2.5 flex-wrap gap-1">
                      {(ActivityCard?.tags as Array<{ id: string; name: string }>)?.map((tag: Partial<TagResponseData>) => (
                        <Fragment key={tag.id}>
                          <div data-tip data-for={tag.name} className="flex  tags bg-tagSection items-center justify-evenly rounded p-1" key={tag.id}>
                            <div className="font-Poppins text-card font-normal leading-5 pr-4 text-profileBlack">{tag.name as string}</div>
                            <div className="font-Poppins text-card font-normal leading-5 text-profileBlack cursor-pointer">
                              <img src={closeIcon} alt="" onClick={() => handleUnAssignTagsName(tag.id as string)} />
                            </div>
                          </div>
                          <ReactTooltip id={tag.name} textColor="" backgroundColor="" effect="solid">
                            <span className="font-Poppins text-card font-normal leading-5 pr-4">{tag.name as string}</span>
                          </ReactTooltip>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
          <div className="px-6 py-6 flex items-center justify-center gap-0.66 w-full rounded-b-lg  bottom-0 bg-white">
            <Pagination currentPage={page} totalPages={totalPages} limit={limit} onPageChange={(page) => setPage(Number(page))} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full fixActivityTableHead">
          <div>
            <img src={noActivityIcon} alt="" />
          </div>
          <div className="pt-5 font-Poppins font-medium text-greyDark text-[28px] leading-10">No activities to display</div>
        </div>
      )}
    </div>
  );
};

export default Activity;
