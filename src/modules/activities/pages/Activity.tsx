/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useDebounce from '@/hooks/useDebounce';
import { API_ENDPOINT } from '@/lib/config';
import fetchExportList from '@/lib/fetchExport';
import Button from 'common/button';
import Input from 'common/input';
import Pagination from 'common/pagination/pagination';
import membersSlice from 'modules/members/store/slice/members.slice';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import closeIcon from '../../../assets/images/close.svg';
import profileImage from '../../../assets/images/ellip.svg';
import exportImage from '../../../assets/images/export.svg';
import noActivityIcon from '../../../assets/images/no-reports.svg';
import slackIcon from '../../../assets/images/slack.svg';
import { useAppSelector } from '../../../hooks/useRedux';
import { generateDateAndTime } from '../../../lib/helper';
import { ActiveStreamData, ActivityCard, ProfileModal } from '../interfaces/activities.interface';
import activitiesSlice from '../store/slice/activities.slice';
import './Activity.css';
import ActivityFilter from './ActivityFilter';
import Skeleton from 'react-loading-skeleton';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import { width_90 } from 'constants/constants';

Modal.setAppElement('#root');

const Activity: React.FC = () => {
  const dispatch = useDispatch();
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
    profilePictureUrl: ''
  });
  const [ActivityCard, setActivityCard] = useState<ActivityCard>();
  const [page, setpage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const dropDownRef = useRef<HTMLDivElement>(null);

  const limit = 10;
  const loader = useSkeletonLoading(activitiesSlice.actions.getActiveStreamData.type);

  const { data, totalPages } = useAppSelector((state) => state.activities.activeStreamData);

  const debouncedValue = useDebounce(searchText, 300);

  useEffect(() => {
    dispatch(
      activitiesSlice.actions.getActiveStreamData({
        activeStreamQuery: {
          page,
          limit
        },
        workspaceId: workspaceId!
      })
    );
    dispatch(
      activitiesSlice.actions.activeStreamTagFilter({
        activeStreamQuery: { tags: { searchedTags: '', checkedTags: '' } },
        workspaceId: workspaceId!
      })
    );
  }, [page]);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedValue) {
      getFilteredActiveStreamList(1, debouncedValue);
    }
  }, [debouncedValue]);

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
      channelName: data?.channelName,
      sourceUrl: data?.sourceUrl,
      profilePictureUrl: data?.profilePictureUrl,
      value: data?.value
    });
  };
  const handleTagModal = (val: boolean) => {
    setTagModalOpen(val);
  };

  const handleProfileModal = (data: ProfileModal) => {
    setProfileModal({
      isOpen: data.isOpen,
      id: data?.id,
      memberName: data.memberName,
      email: data.email,
      organization: data.organization,
      memberProfileUrl: data.memberProfileUrl,
      profilePictureUrl: data?.profilePictureUrl
    });
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (searchText === '') {
      getFilteredActiveStreamList(1, searchText);
    }
    setSearchText(searchText);
  };

  // Function to dispatch the search text to hit api of member list.
  const getFilteredActiveStreamList = (pageNumber:number, text: string) => {
    dispatch(
      activitiesSlice.actions.getActiveStreamData({
        activeStreamQuery: {
          page: pageNumber,
          limit,
          search: text
        },
        workspaceId: workspaceId!
      })
    );
  };

  // Fetch members list data in comma separated value
  const fetchActiveStreamListExportData = () => {
    fetchExportList(`${API_ENDPOINT}/v1/${workspaceId}/activity/export`, 'ActiveStreamExport.xlsx');
  };

  const ActiveStreamFilter = useMemo(() => <ActivityFilter page={page} limit={limit} />, []);

  return (
    <div className="flex flex-col mt-1.8">
      <div className="flex items-center">
        <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 w-full">Activities</h3>
        <div>
          <Input
            type="text"
            name="search"
            id="searchId"
            className="app-input-card-border focus:outline-none px-4 mr-0.76 box-border h-3.06 w-19.06 bg-white  rounded-0.6 placeholder:text-reportSearch placeholder:text-card placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.12 font-Poppins"
            placeholder="Search By Name or Email"
            onChange={handleSearchTextChange}
          />
        </div>
        <div className="relative mr-5">{ActiveStreamFilter}</div>

        <div className="">
          <div
            className="app-input-card-border w-6.98 h-3.06 rounded-0.6 shadow-shadowInput box-border bg-white items-center justify-evenly flex ml-0.63 cursor-pointer hover:border-infoBlack transition ease-in-out duration-300"
            onClick={fetchActiveStreamListExportData}
          >
            <h3 className="text-dropGray leading-1.12 font-Poppins font-semibld text-card">Export</h3>
            <img src={exportImage} alt="" />
          </div>
        </div>
      </div>
      {data?.length !== 0 ? (
        <div className="relative">
          <div className="py-2 overflow-x-auto mt-1.868">
            <div className="inline-block min-w-full  align-middle w-61.68 rounded-0.6 border-table no-scroll-bar  overflow-y-auto h-screen sticky top-0 fixActivityTableHead min-h-[31.25rem]">
              <table className="min-w-full relative  rounded-t-0.6 ">
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
                            <div className="flex ">
                              <div className="py-3 mr-2">
                                <input type="checkbox" className="checkbox" />
                              </div>
                              <div className="relative">
                                <div
                                  ref={dropDownRef}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProfileModal({
                                      isOpen: true,
                                      id: data?.id,
                                      email: data?.email,
                                      memberName: data?.memberName,
                                      organization: 'NeoITO',
                                      memberProfileUrl: `/${workspaceId}/members/${data.memberId}/profile`,
                                      profilePictureUrl: data?.profilePictureUrl
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
                                  <div className="w-12.87 pb-3 rounded-b-0.6 profile-card-body profile-inner shadow-profileCard flex flex-col items-center bg-white">
                                    <div className="w-4.43 h-4.43 -mt-10 flex items-center justify-center">
                                      <img src={ProfileModal?.profilePictureUrl === null ? profileImage : ProfileModal?.profilePictureUrl} alt="" />
                                    </div>
                                    <div className="font-semibold font-Poppins text-card text-profileBlack leading-1.12">
                                      {ProfileModal?.memberName}
                                    </div>
                                    <div className="text-profileEmail font-Poppins font-normal text-profileBlack text-center w-6.875 mt-0.146">
                                      {ProfileModal?.email} {ProfileModal?.organization}
                                    </div>
                                    <div className="flex mt-2.5">
                                      <div className="bg-cover bg-center mr-1 w-0.92 h-0.92">
                                        <img src={slackIcon} alt="" />
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
                            <div className="flex flex-col">
                              <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                                {generateDateAndTime(`${data?.activityTime}`, 'MM-DD-YYYY')}
                              </div>
                              <div className="font-medium font-Poppins text-card leading-1.31 text-tableDuration">
                                {generateDateAndTime(`${data?.activityTime}`, 'HH:MM')}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 pt-5 border-b ">
                          {loader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="flex ">
                              <div className="mr-2">
                                <img src={slackIcon} alt="" />
                              </div>
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
                                      organization: 'NeoITO',
                                      channelName: 'channel 1',
                                      sourceUrl: data?.sourceUrl,
                                      profilePictureUrl: data?.profilePictureUrl,
                                      value: data?.value
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

                        <td className="px-6 py-3 border-b">
                          {loader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <a
                              href={`${data?.sourceUrl}`}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 underline cursor-pointer"
                            >
                              {data?.sourceUrl === null ? 'www.slack.com/profile' : data?.sourceUrl}
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-3 border-b font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                          {loader ? <Skeleton width={width_90} /> : data?.type}
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
                    <div className="font-Poppins text-error leading-5 text-tag font-medium cursor-pointer" onClick={() => handleTagModal(true)}>
                      ADD TAG
                    </div>
                    <Modal
                      isOpen={isTagModalOpen}
                      shouldCloseOnOverlayClick={false}
                      onRequestClose={() => setModalOpen(false)}
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
                        <form className="flex flex-col relative px-1.93 mt-9">
                          <label htmlFor="billingName " className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack ">
                            Tag Name
                          </label>
                          <input
                            type="text"
                            className="mt-0.375 inputs box-border bg-white shadow-shadowInput rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                            placeholder="Enter Tag Name"
                          />
                          <div className="flex absolute right-1 top-24 pr-6 items-center">
                            <Button
                              type="button"
                              text="CANCEL"
                              className="mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel w-5.25 h-2.81  rounded border-none"
                              onClick={() => setTagModalOpen(false)}
                            />
                            <Button
                              type="button"
                              text="SAVE"
                              className="save text-white font-Poppins text-error font-medium leading-5 cursor-pointer rounded shadow-contactBtn w-5.25 h-2.81  border-none btn-save-modal"
                            />
                          </div>
                        </form>
                      </div>
                    </Modal>
                  </div>
                  <div className="mt-8 flex items-center">
                    <div className="bg-cover">
                      <img src={ActivityCard?.profilePictureUrl === null ? profileImage : ActivityCard?.profilePictureUrl} alt="" />
                    </div>
                    <div className="flex flex-col pl-0.563">
                      <div className="font-medium text-trial text-infoBlack font-Poppins leading-1.31">{ActivityCard?.memberName}</div>
                      <div className="font-Poppins text-email leading-5 text-tagEmail font-normal">
                        {ActivityCard?.email} | {ActivityCard?.organization}
                      </div>
                    </div>
                  </div>
                  <div className="bg-activitySubCard rounded flex flex-col pt-2.5 pl-0.81 pb-8 mt-5">
                    <div className="flex items-center">
                      <div>
                        <img src={slackIcon} alt="" />
                      </div>
                      <div className="pl-0.563 font-Poppins font-medium text-infoBlack text-card leading-1.12">{ActivityCard?.displayValue}</div>
                      <div className="pl-2.5 text-tagChannel font-Poppins font-medium text-card leading-1.12">#{ActivityCard?.channelName}</div>
                    </div>
                    <div className="mt-5 font-Poppins font-medium text-infoBlack text-card leading-1.12">{ActivityCard?.value}</div>
                    <div className="mt-1.18 flex relative">
                      <a
                        href={`${ActivityCard?.sourceUrl}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-Poppins font-medium text-card leading-1.12 text-tag underline cursor-pointer"
                      >
                        VIEW ON SLACK
                      </a>
                      <div className="absolute right-3 top-5 font-Poppins font-medium text-card leading-1.12 text-slimGray">
                        {generateDateAndTime(`${ActivityCard?.activityTime}`, 'HH:MM')} |{' '}
                        {generateDateAndTime(`${ActivityCard?.activityTime}`, 'MM-DD')}
                      </div>
                    </div>
                  </div>
                  <div className="mt-7">
                    <h3 className="text-profileBlack text-error font-Poppins font-medium leading-5">Tags</h3>
                    <div className="flex pt-2.5 flex-wrap">
                      <div className="flex  tags bg-tagSection items-center justify-evenly rounded w-6.563 py-1">
                        <div className="font-Poppins text-card font-normal leading-5 text-profileBlack">Influencer</div>
                        <div className="font-Poppins text-card font-normal leading-5 text-profileBlack cursor-pointer">
                          <img src={closeIcon} alt="" />
                        </div>
                      </div>
                      <div className="ml-0.313 flex items-center justify-evenly tags bg-tagSection rounded w-6.563 py-1">
                        <div className="font-Poppins text-card font-normal leading-5 text-profileBlack">Admin</div>
                        <div className="font-Poppins text-card font-normal leading-5 text-profileBlack cursor-pointer">
                          <img src={closeIcon} alt="" />
                        </div>
                      </div>
                      <div className="ml-0.313 flex items-center justify-evenly tags bg-tagSection rounded w-6.563 py-1">
                        <div className="font-Poppins text-card font-normal leading-5 text-profileBlack">Charity</div>
                        <div className="font-Poppins text-card font-normal leading-5 text-profileBlack cursor-pointer">
                          <img src={closeIcon} alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
          <div className="px-6 py-6 flex items-center justify-center gap-0.66 w-full rounded-b-lg  bottom-0 bg-white">
            <Pagination currentPage={page} totalPages={totalPages} limit={limit} onPageChange={(page) => setpage(Number(page))} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full fixActivityTableHead">
          <div>
            <img src={noActivityIcon} alt="" />
          </div>
          <div className="pt-5 font-Poppins font-medium text-tableDuration text-lg leading-10">No activities to display</div>
        </div>
      )}
    </div>
  );
};

export default Activity;
