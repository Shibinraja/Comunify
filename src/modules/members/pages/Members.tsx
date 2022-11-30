/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Button from 'common/button';
import MembersCard from 'common/membersCard/MembersCard';
import useDebounce from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import { API_ENDPOINT } from '@/lib/config';
import fetchExportList from '@/lib/fetchExport';
import { convertEndDate, convertStartDate } from '@/lib/helper';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import Pagination from 'common/pagination/pagination';
import { width_90 } from 'constants/constants';
import { format, parseISO, subDays, subMonths } from 'date-fns';
import { AssignTypeEnum } from 'modules/settings/interface/settings.interface';
import settingsSlice from 'modules/settings/store/slice/settings.slice';
// eslint-disable-next-line object-curly-newline
import React, { ChangeEvent, Fragment, Key, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Skeleton from 'react-loading-skeleton';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import calendarIcon from '../../../assets/images/calandar.svg';
import editIcon from '../../../assets/images/edit.svg';
import exportImage from '../../../assets/images/export.svg';
import noMemberIcon from '../../../assets/images/no-member.svg';
import searchIcon from '../../../assets/images/search.svg';
import closeIcon from '../../../assets/images/tag-close.svg';
import dropdownIcon from '../../../assets/images/Vector.svg';
import { customDateLinkProps, CustomDateType, filterDateProps, memberFilterExportProps } from '../interface/members.interface';
import membersSlice from '../store/slice/members.slice';
import './Members.css';
import MembersFilter from './MembersFilter';
import MembersDraggableColumn from './membersTableColumn/membersDraggableColumn';
import { ColumNames } from './MembersTableData';
import { UsersLoader } from 'common/Loader/UsersLoader';

Modal.setAppElement('#root');

const Members: React.FC = () => {
  const limit = 10;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [columns, setColumns] = useState<Array<ColumnNameProps>>(ColumNames);
  const [customizedColumnBool, saveCustomizedColumn] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [customSingleStartDate, setCustomSingleStartDate] = useState<Date>();
  const [customDateLink, setCustomDateLink] = useState<Partial<customDateLinkProps>>({
    '1day': false,
    '7day': false,
    '1month': false
  });
  const [filteredDate, setFilteredDate] = useState<filterDateProps>({
    filterStartDate: '',
    filterEndDate: ''
  });
  const [isFilterDropdownActive, setIsFilterDropdownActive] = useState<boolean>(false);
  const [filterExportParams, setFilterExportParams] = useState<memberFilterExportProps>({
    checkTags: '',
    checkPlatform: '',
    checkOrganization: '',
    checkLocation: '',
    endDate: '',
    startDate: ''
  });
  const [fetchLoader, setFetchLoader] = useState<boolean>(false);
  const [saveRefObject, setSaveRefObject] = useState<HTMLDivElement | null>(null);
  const memberColumnsLoader = useSkeletonLoading(membersSlice.actions.membersList.type);

  const datePickerRefStart = useRef<ReactDatePicker>(null);
  const datePickerRefEnd = useRef<ReactDatePicker>(null);

  const debouncedValue = useDebounce(searchText, 300);

  const dropDownRef = useRef<HTMLDivElement | null>(null);

  const handleFilterDropdown = (): void => {
    setIsFilterDropdownActive((prev) => !prev);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setIsFilterDropdownActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    setSaveRefObject(dropDownRef.current);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const {
    membersListData: { data, totalPages },
    customizedColumn: customizedColumnData
  } = useAppSelector((state) => state.members);

  const { clearValue } = useAppSelector((state) => state.settings);

  useEffect(() => {
    dispatch(membersSlice.actions.membersCountAnalytics({ workspaceId: workspaceId! }));
    dispatch(membersSlice.actions.membersActivityAnalytics({ workspaceId: workspaceId! }));
    dispatch(
      settingsSlice.actions.tagFilterData({
        settingsQuery: { page: 1, limit, tags: { searchedTags: '', checkedTags: '' } },
        workspaceId: workspaceId!
      })
    );
    dispatch(
      membersSlice.actions.membersLocationFilter({
        membersQuery: { location: { searchedLocation: '', checkedLocation: '' } },
        workspaceId: workspaceId!
      })
    );
    dispatch(
      membersSlice.actions.membersOrganizationFilter({
        membersQuery: { organization: { searchedOrganization: '', checkedOrganization: '' } },
        workspaceId: workspaceId!
      })
    );
    dispatch(membersSlice.actions.membersColumnsList({ workspaceId: workspaceId! }));
    setCustomDateLink({ '1day': false, '7day': false, '1month': false });
    localStorage.removeItem('primaryMemberId');
    localStorage.removeItem('merge-membersId');
  }, []);

  useEffect(() => {
    dispatch(
      membersSlice.actions.membersList({
        membersQuery: {
          page,
          limit,
          search: searchText,
          'createdAT.gte': (filterExportParams.startDate && filterExportParams.startDate) || filteredDate.filterStartDate,
          'createdAT.lte': (filterExportParams.endDate && filterExportParams.endDate) || filteredDate.filterEndDate,
          tags: { searchedTags: '', checkedTags: filterExportParams.checkTags.toString() },
          platforms: filterExportParams.checkPlatform.toString(),
          organization: { searchedOrganization: '', checkedOrganization: filterExportParams.checkOrganization.toString() },
          location: { searchedLocation: '', checkedLocation: filterExportParams.checkLocation.toString() },
          'lastActivity.lte': filterExportParams.endDate && filterExportParams.endDate,
          'lastActivity.gte': filterExportParams.startDate && filterExportParams.startDate
        },
        workspaceId: workspaceId!
      })
    );
  }, [page]);

  useEffect(() => {
    if (clearValue) {
      getFilteredMembersList(1, debouncedValue, customStartDate && convertStartDate(customStartDate), customEndDate && convertEndDate(customEndDate));
    }
  }, [clearValue]);

  // Set new column change if the initial order changes.
  useEffect(() => {
    if (customizedColumnData?.length > 1) {
      setColumns(customizedColumnData);
    }
  }, [customizedColumnData]);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedValue) {
      getFilteredMembersList(
        1,
        debouncedValue,
        customStartDate ? customStartDate && convertStartDate(customStartDate) : customSingleStartDate && convertStartDate(customSingleStartDate),
        customEndDate && convertEndDate(customEndDate)
      );
    }
  }, [debouncedValue]);

  // Custom Date filter member list
  useEffect(() => {
    if (customStartDate && customEndDate) {
      getFilteredMembersList(1, debouncedValue, customStartDate && convertStartDate(customStartDate), customEndDate && convertEndDate(customEndDate));
      setCustomDateLink({ '1day': false, '7day': false, '1month': false });
    }
  }, [customStartDate, customEndDate]);

  // Function to dispatch the search text to hit api of member list.
  // eslint-disable-next-line space-before-function-paren
  const getFilteredMembersList = async (pageNumber: number, text: string, date?: string, endDate?: string) => {
    setFilteredDate((prevDate) => ({ ...prevDate, filterStartDate: date!, filterEndDate: endDate! }));
    dispatch(
      membersSlice.actions.membersList({
        membersQuery: {
          page: pageNumber,
          limit,
          search: text,
          'createdAT.gte': date,
          'createdAT.lte': endDate,
          tags: { searchedTags: '', checkedTags: filterExportParams.checkTags.toString() },
          platforms: filterExportParams.checkPlatform.toString(),
          organization: { searchedOrganization: '', checkedOrganization: filterExportParams.checkOrganization.toString() },
          location: { searchedLocation: '', checkedLocation: filterExportParams.checkLocation.toString() },
          'lastActivity.lte': filterExportParams.endDate && filterExportParams.endDate,
          'lastActivity.gte': filterExportParams.startDate && filterExportParams.startDate
        },
        workspaceId: workspaceId!
      })
    );
    setPage(1);
  };

  const handleCustomizeColumnSave = () => {
    saveCustomizedColumn((prevState: boolean) => !prevState);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    saveCustomizedColumn(false);
  };

  const navigateToProfile = (memberId: string) => {
    navigate(`/${workspaceId}/members/${memberId}/profile`);
  };

  // Function to convert the day and subtract based on no of days/ months.
  const selectCustomDate = (date: string) => {
    const todayDate = new Date();
    setCustomStartDate(undefined);
    setCustomEndDate(undefined);
    setCustomSingleStartDate(undefined);
    if (date === CustomDateType.Day) {
      getFilteredMembersList(1, searchText, convertStartDate(subDays(todayDate, 1)));
      setCustomSingleStartDate(subDays(todayDate, 1));
      setCustomDateLink({ [date]: true });
    }
    if (date === CustomDateType.Week) {
      getFilteredMembersList(1, searchText, convertStartDate(subDays(todayDate, 7)));
      setCustomSingleStartDate(subDays(todayDate, 7));
      setCustomDateLink({ [date]: true });
    }
    if (date === CustomDateType.Month) {
      getFilteredMembersList(1, searchText, convertStartDate(subMonths(todayDate, 1)));
      setCustomSingleStartDate(subMonths(todayDate, 1));
      setCustomDateLink({ [date]: true });
    }
  };

  const selectCustomBetweenDate = (event: ChangeEvent<Date>, date: Date, dateTime: string) => {
    event.stopPropagation();
    dropDownRef.current = saveRefObject;
    if (dateTime === 'start') {
      setCustomStartDate(date);
      setIsFilterDropdownActive(true);
    }

    if (dateTime === 'end') {
      setCustomEndDate(date);
      setIsFilterDropdownActive(true);
    }
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (!searchText) {
      getFilteredMembersList(
        1,
        searchText,
        customStartDate ? customStartDate && convertStartDate(customStartDate) : customSingleStartDate && convertStartDate(customSingleStartDate),
        customEndDate && convertEndDate(customEndDate)
      );
    }
    setSearchText(searchText);
  };

  // Fetch members list data in comma separated value
  // eslint-disable-next-line space-before-function-paren
  const fetchMembersListExportData = async () => {
    setFetchLoader(true);
    await fetchExportList(
      `${API_ENDPOINT}/v1/${workspaceId}/members/memberlistexport`,
      {
        search: debouncedValue,
        tags: filterExportParams.checkTags,
        platforms: filterExportParams.checkPlatform,
        location: filterExportParams.checkLocation,
        organization: filterExportParams.checkOrganization,
        'lastActivity.lte': filterExportParams.endDate,
        'lastActivity.gte': filterExportParams.startDate,
        'createdAT.gte': filteredDate.filterStartDate,
        'createdAT.lte': filteredDate.filterEndDate
      },
      'MembersListExport.xlsx'
    );
    setFetchLoader(false);
  };

  // Function to map customized column with api data response to create a new column array with index matching with customized column.
  // eslint-disable-next-line max-len
  const customizedColumn = data?.reduce(
    (acc: Array<Record<string, unknown>>, currentValue: Record<string, unknown>): Array<Record<string, unknown>> => {
      const accumulatedColumn: Record<string, unknown> = {};
      const memberValue = { ...currentValue };
      columns.forEach((column: ColumnNameProps) => {
        // eslint-disable-next-line no-prototype-builtins
        if (memberValue.hasOwnProperty(column.id)) {
          if (column.isDisplayed) {
            accumulatedColumn[column.id] = memberValue[column.id];
          }
        }
      });
      accumulatedColumn['name'] = { name: accumulatedColumn['name'], id: currentValue.id };
      acc.push(accumulatedColumn);
      return acc;
    },
    []
  );

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

  const handleUnAssignTagsName = (memberId: string, id: string): void => {
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
  };

  // Memoized functionality to stop re-render.
  const membersColumn = useMemo(
    () => <MembersDraggableColumn MembersColumn={customizedColumnBool} handleModalClose={handleModalClose} />,
    [customizedColumnBool]
  );

  const MemberFilter = useMemo(
    () => (
      <MembersFilter
        page={page}
        limit={limit}
        memberFilterExport={setFilterExportParams}
        searchText={debouncedValue}
        filteredDate={filteredDate}
        setPage={setPage}
      />
    ),
    [debouncedValue, filteredDate]
  );

  const renderMembersTable = () => {
    if (!memberColumnsLoader && !(customizedColumn?.[0]?.name as { name: string; id: string })?.name) {
      return (
        <div className="flex flex-col items-center justify-center w-full fixTableHead-nomember">
          <div>
            <img src={noMemberIcon} alt="No Member" />
          </div>
          <div className="pt-5 font-Poppins font-medium text-tableDuration text-lg leading-10">No Members</div>
        </div>
      );
    }

    return (
      <div className="memberTable mt-[30px]">
        <div className="py-2">
          <div className="inline-block min-w-full w-full align-middle rounded-0.6 border-table  overflow-x-auto overflow-y-auto sticky top-0 fixTableHead max-h-34 min-h-[31.25rem] mb-16">
            <table className="min-w-full relative w-full rounded-t-0.6 ">
              <thead className="h-3.25  top-0 w-full  sticky ">
                <tr className="min-w-full w-full">
                  {columns.map(
                    (columnName: ColumnNameProps) =>
                      columnName.isDisplayed && (
                        <Fragment key={columnName.id}>
                          <th className="px-3 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray ">
                            {columnName.name}
                          </th>
                        </Fragment>
                      )
                  )}
                </tr>
              </thead>
              {/* {Check with the custom column dynamic order and displays content/rows as per the index position of the arranged column name} */}
              <tbody>
                {memberColumnsLoader &&
                  Array.from({ length: 10 }, (_, i) => i + 1).map((type: number) => (
                    <Fragment key={type}>
                      <UsersLoader />
                    </Fragment>
                  ))}
                {customizedColumn.map((member: Record<string, unknown>) => (
                  <tr className="border-b " key={(member?.name as { name: string; id: string })?.id as Key}>
                    {Object.keys(member).map((column: keyof typeof member, index) => (
                      <td className="px-3 h-[60px] " key={index}>
                        {column === 'name' ? (
                          memberColumnsLoader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="flex w-[150px]">
                              <div
                                className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer capitalize"
                                onClick={() => navigateToProfile((member?.name as { name: string; id: string })?.id as string)}
                              >
                                {(member?.name as { name: string; id: string })?.name as string}
                              </div>
                            </div>
                          )
                        ) : column === 'platforms' ? (
                          memberColumnsLoader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="flex gap-x-2 w-[150px]">
                              {(member?.platforms as Array<{ id: string; name: string; platformLogoUrl: string }>)?.map(
                                (platforms: { name: string; id: string; platformLogoUrl: string }, index: number) => (
                                  <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31  rounded-full" key={index}>
                                    <img src={platforms?.platformLogoUrl} alt="" className="rounded-full w-[1.3419rem] h-[1.3419rem]" />
                                  </div>
                                )
                              )}
                            </div>
                          )
                        ) : column === 'tags' ? (
                          memberColumnsLoader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="flex w-[150px]">
                              <div className="py-3 flex gap-2 items-center flex-wrap font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                                {member?.tags ? (
                                  (member?.tags as Array<{ id: string; name: string }>)
                                    ?.slice(0, 2)
                                    .map((tags: { name: string; id: string }, index: number) => (
                                      <>
                                        <div
                                          data-tip
                                          data-for={tags.name}
                                          className="bg-tagSection rounded h-8 flex justify-between px-3 items-center cursor-pointer"
                                          key={index}
                                        >
                                          <div className="font-Poppins font-normal text-card text-profileBlack leading-5 pr-4 tags-ellipse">
                                            {tags?.name}
                                          </div>
                                          <div>
                                            <img
                                              src={closeIcon}
                                              alt=""
                                              onClick={() =>
                                                handleUnAssignTagsName((member?.name as { name: string; id: string })?.id as string, tags.id)
                                              }
                                            />
                                          </div>
                                        </div>
                                        <ReactTooltip id={tags.name} textColor="" backgroundColor="" effect="solid">
                                          <span className="font-Poppins text-card font-normal leading-5 pr-4">{tags.name}</span>
                                        </ReactTooltip>
                                      </>
                                    ))
                                ) : (
                                  <div className="font-Poppins font-normal text-card text-infoBlack leading-5 pr-4 tags-ellipse">{'--'}</div>
                                )}
                                <div
                                  className="font-Poppins font-medium text-trial text-tag leading-1.12 capitalize underline cursor-pointer"
                                  onClick={() => navigateToProfile((member?.name as { name: string; id: string })?.id as string)}
                                >
                                  {(member?.tags as Array<Record<string, unknown>>)?.length > 2
                                    ? `${(member?.tags as Array<Record<string, unknown>>)?.length - 2} more`
                                    : ''}{' '}
                                </div>
                              </div>
                            </div>
                          )
                        ) : column === 'lastActivity' ? (
                          memberColumnsLoader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="flex flex-col w-[150px]">
                              <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                                {member?.lastActivity ? format(parseISO(member?.lastActivity as string), 'dd MMM yyyy') : '--'}
                              </div>
                              <div className="font-medium font-Poppins text-card leading-1.31 text-tableDuration">
                                {(member?.lastActivity as ReactNode) && format(parseISO(member?.lastActivity as string), 'HH:MM')}
                              </div>
                            </div>
                          )
                        ) : memberColumnsLoader ? (
                          <Skeleton width={width_90} />
                        ) : (
                          <div className="flex ">
                            <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31">{member[column] as ReactNode}</div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="px-3 h-[60px]">
                  <td className="px-3 h-[60px]"></td>
                </tr>
              </tbody>
            </table>
            {!memberColumnsLoader && (
              <div className="px-3 py-6 flex items-center gap-0.66 pl-[30%] w-full rounded-b-lg fixed bg-white bottom-0">
                <Pagination currentPage={page} totalPages={totalPages} limit={limit} onPageChange={(page) => setPage(Number(page))} />
              </div>
            )}
            {!memberColumnsLoader && (
              <div className="fixed bottom-10 right-32">
                <div
                  className="btn-drag p-3 flex items-center justify-center cursor-pointer shadow-dragButton rounded-0.6 "
                  onClick={() => setIsModalOpen(true)}
                >
                  <img src={editIcon} alt="" />
                </div>
              </div>
            )}
            <Modal
              isOpen={isModalOpen}
              shouldCloseOnOverlayClick={true}
              onRequestClose={() => setIsModalOpen(false)}
              className="w-24.31 mx-auto pb-20 bg-white border-fetching-card rounded-lg shadow-modal outline-none"
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
              <div className="flex flex-col px-1.68 relative">
                <h3 className="font-Inter font-semibold text-xl mt-1.8  leading-6">Customize Column</h3>
                <div className="pb-10 members-list-height">{membersColumn}</div>
                <div className="flex buttons absolute -bottom-16 right-[27px]">
                  <Button
                    text="Cancel"
                    type="submit"
                    className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-5.25  rounded border-none"
                    onClick={handleModalClose}
                  />
                  <Button
                    onClick={handleCustomizeColumnSave}
                    text="Save"
                    type="submit"
                    className="text-white font-Poppins text-error font-medium leading-5 btn-save-modal cursor-pointer rounded shadow-contactBtn w-5.25 border-none h-2.81"
                  />
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col mt-[73px]">
      <h3 className="font-Poppins font-semibold text-infoBlack text-infoData leading-9 dark:text-white">Members</h3>
      <div className="member-card pt-[30px]">
        <MembersCard />
      </div>
      <div className="flex flex-col xl:flex-row  justify-between mt-[40px] i ">
        <div className="flex relative items-center w-1/2 xl:w-[300px] 2xl:w-19.06">
          <input
            type="text"
            className="focus:outline-none px-3 pr-8 box-border w-full h-3.06  rounded-0.6  placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.31 placeholder:text-searchGray shadow-shadowInput"
            placeholder="Search By Name or Email"
            onChange={handleSearchTextChange}
          />
          <div className="absolute right-5 w-0.78 h-0.75 ">
            <img src={searchIcon} alt="" />
          </div>
        </div>
        <div className="flex justify-between xl:justify-start mt-4 xl:mt-0">
          <div
            className={`day w-[49px] h-3.06 flex items-center justify-center ml-0 xl:ml-0.652 box-border rounded-0.6 ${
              customDateLink['1day'] ? 'border-gradient-rounded-member' : 'app-input-card-border'
            } shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12 cursor-pointer`}
            onClick={() => selectCustomDate('1day')}
          >
            1D
          </div>
          <div
            className={`day w-[49px] h-3.06 flex items-center justify-center ml-0.652 box-border rounded-0.6 ${
              customDateLink['7day'] ? 'border-gradient-rounded-member' : 'app-input-card-border'
            } shadow-shadowInput font-Poppins font-semibold text-card text-memberDay leading-1.12 cursor-pointer`}
            onClick={() => selectCustomDate('7day')}
          >
            7D
          </div>
          <div
            className={`day w-[49px] h-3.06 flex items-center justify-center ml-0.652 box-border rounded-0.6 ${
              customDateLink['1month'] ? 'border-gradient-rounded-member' : 'app-input-card-border'
            } shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12 cursor-pointer`}
            onClick={() => selectCustomDate('1month')}
          >
            1M
          </div>
          <div className="box-border cursor-pointer rounded-0.6 shadow-contactCard app-input-card-border relative ml-0.652" ref={dropDownRef}>
            <div className="flex h-3.06 w-[11.25rem] items-center justify-between px-5 " onClick={handleFilterDropdown}>
              <div className="box-border rounded-0.6 shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12">
                Custom Date
              </div>
              <div>
                <img src={dropdownIcon} alt="" className={isFilterDropdownActive ? 'rotate-180' : 'rotate-0'} />
              </div>
            </div>
            {isFilterDropdownActive && (
              <div className="absolute w-16.56 pb-0 bg-white border z-40 rounded-0.3">
                <div className="flex flex-col pb-5">
                  <>
                    <div className="flex flex-col px-3 pt-4">
                      <label htmlFor="Start Date p-1 font-Inter font-normal leading-4 text-trial text-searchBlack">Start Date</label>
                      <div className="relative flex items-center">
                        <DatePicker
                          selected={customStartDate}
                          maxDate={customEndDate ? customEndDate : new Date()}
                          onChange={(date: Date, event: ChangeEvent<Date>) => {
                            selectCustomBetweenDate(event, date, 'start');
                          }}
                          className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                          placeholderText="DD/MM/YYYY"
                          ref={datePickerRefStart}
                          dateFormat="dd/MM/yyyy"
                          onMonthChange={() => {
                            dropDownRef.current = null;
                          }}
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
                          selected={customEndDate}
                          minDate={customStartDate}
                          maxDate={new Date()}
                          selectsEnd
                          startDate={customStartDate}
                          endDate={customEndDate}
                          onChange={(date: Date, event: ChangeEvent<Date>) => selectCustomBetweenDate(event, date, 'end')}
                          className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                          placeholderText="DD/MM/YYYY"
                          ref={datePickerRefEnd}
                          dateFormat="dd/MM/yyyy"
                          onMonthChange={() => {
                            dropDownRef.current = null;
                          }}
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
                </div>
              </div>
            )}
          </div>
          <div className="ml-1.30 w-[155px]">{MemberFilter}</div>
          <div className="ml-0.652 w-[112px]">
            <div
              aria-disabled={fetchLoader}
              className={`export w-6.98 rounded-0.6 shadow-contactCard box-border bg-white items-center app-input-card-border h-3.06 justify-evenly flex cursor-pointer hover:border-infoBlack transition ease-in-out duration-300 ${
                fetchLoader || !customizedColumn?.length ? 'cursor-not-allowed' : ''
              }`}
              onClick={() => (customizedColumn?.length ? !fetchLoader && fetchMembersListExportData() : null)}
            >
              <h3 className="text-memberDay leading-1.12 font-Poppins font-semibold text-card">Export</h3>
              <img src={exportImage} alt="" />
            </div>
          </div>
        </div>
      </div>
      {renderMembersTable()}
    </div>
  );
};

export default Members;
