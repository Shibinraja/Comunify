/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Button from 'common/button';
import MembersCard from 'common/membersCard/MembersCard';
// eslint-disable-next-line object-curly-newline
import React, { ChangeEvent, Fragment, Key, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import calendarIcon from '../../../assets/images/calandar.svg';
import editIcon from '../../../assets/images/edit.svg';
import exportImage from '../../../assets/images/export.svg';
import searchIcon from '../../../assets/images/search.svg';
import closeIcon from '../../../assets/images/tag-close.svg';
import dropdownIcon from '../../../assets/images/Vector.svg';
import './Members.css';
import useDebounce from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import Pagination from 'common/pagination/pagination';
import { format, parseISO, subDays, subMonths } from 'date-fns';
import noMemberIcon from '../../../assets/images/no-member.svg';
import membersSlice from '../store/slice/members.slice';
import MembersFilter from './MembersFilter';
import MembersDraggableColumn from './membersTableColumn/membersDraggableColumn';
import { ColumNames } from './MembersTableData';
import { customDateLinkProps, filterDateProps, memberFilterExportProps } from './membertypes';
import { CustomDateType } from '../interface/members.interface';
import { API_ENDPOINT } from '@/lib/config';
import Skeleton from 'react-loading-skeleton';
import fetchExportList from '@/lib/fetchExport';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import { width_90 } from 'constants/constants';
import settingsSlice from 'modules/settings/store/slice/settings.slice';

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

  const memberColumnsLoader = useSkeletonLoading(membersSlice.actions.membersList.type);

  const datePickerRefStart = useRef<ReactDatePicker>(null);
  const datePickerRefEnd = useRef<ReactDatePicker>(null);

  const debouncedValue = useDebounce(searchText, 300);

  const dropDownRef = useRef<HTMLDivElement>(null);

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
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const {
    membersListData: { data, totalPages },
    customizedColumn: customizedColumnData
  } = useAppSelector((state) => state.members);

  useEffect(() => {
    dispatch(membersSlice.actions.membersCountAnalytics({ workspaceId: workspaceId! }));
    dispatch(membersSlice.actions.membersActivityAnalytics({ workspaceId: workspaceId! }));
    dispatch(
      settingsSlice.actions.tagFilterData({
        settingsQuery: { tags: { searchedTags: '', checkedTags: '' } },
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
  }, []);

  useEffect(() => {
    dispatch(
      membersSlice.actions.membersList({
        membersQuery: {
          page,
          limit
        },
        workspaceId: workspaceId!
      })
    );
  }, [page]);

  // Set new column change if the initial order changes.
  useEffect(() => {
    if (customizedColumnData?.length > 1) {
      setColumns(customizedColumnData);
    }
  }, [customizedColumnData]);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedValue) {
      getFilteredMembersList(1, debouncedValue);
    }
  }, [debouncedValue]);

  // Custom Date filter member list
  useEffect(() => {
    if (customStartDate && customEndDate) {
      getFilteredMembersList(1, '', format(customStartDate as Date, 'yyyy-MM-dd'), format(customEndDate as Date, 'yyyy-MM-dd'));
      setCustomDateLink({ '1day': false, '7day': false, '1month': false });
    }
  }, [customStartDate, customEndDate]);

  // Function to dispatch the search text to hit api of member list.
  const getFilteredMembersList = (pageNumber: number, text: string, date?: string, endDate?: string) => {
    setFilteredDate((prevDate) => ({ ...prevDate, filterStartDate: date!, filterEndDate: endDate! }));
    dispatch(
      membersSlice.actions.membersList({
        membersQuery: {
          page: pageNumber,
          limit,
          search: text,
          'createdAT.gte': date,
          'createdAT.lte': endDate
        },
        workspaceId: workspaceId!
      })
    );
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
    if (date === CustomDateType.Day) {
      getFilteredMembersList(1, '', format(subDays(todayDate, 1), 'yyyy-MM-dd'));
      setCustomDateLink({ [date]: true });
    }
    if (date === CustomDateType.Week) {
      getFilteredMembersList(1, '', format(subDays(todayDate, 7), 'yyyy-MM-dd'));
      setCustomDateLink({ [date]: true });
    }
    if (date === CustomDateType.Month) {
      getFilteredMembersList(1, '', format(subMonths(todayDate, 1), 'yyyy-MM-dd'));
      setCustomDateLink({ [date]: true });
    }
  };

  const selectCustomBetweenDate = (event: ChangeEvent<Date>, date: Date, dateTime: string) => {
    event.stopPropagation();
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
    if (searchText === '') {
      getFilteredMembersList(1, searchText);
    }
    setSearchText(searchText);
  };

  // Fetch members list data in comma separated value
  const fetchMembersListExportData = () => {
    fetchExportList(
      `${API_ENDPOINT}/v1/${workspaceId}/members/memberlistexport`,
      {
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
  };

  // Function to map customized column with api data response to create a new column array with index matching with customized column.
  // eslint-disable-next-line max-len
  const customizedColumn = data?.reduce((acc: Array<Record<string, unknown>>, currentValue: Record<string, unknown>): Array<
    Record<string, unknown>
  > => {
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
  }, []);

  // Memoized functionality to stop re-render.
  const membersColumn = useMemo(() => <MembersDraggableColumn MembersColumn={customizedColumnBool} handleModalClose={handleModalClose} />, [
    customizedColumnBool
  ]);

  const MemberFilter = useMemo(() => <MembersFilter page={page} limit={limit} memberFilterExport={setFilterExportParams} />, []);

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
          tagId: id
        },
        workspaceId: workspaceId!
      })
    );
  };

  return (
    <div className="flex flex-col mt-12">
      <h3 className="font-Poppins font-semibold text-infoBlack text-infoData leading-9 dark:text-white">Members</h3>
      <div className="member-card pt-10">
        <MembersCard />
      </div>
      <div className="flex mt-1.8 items-center ">
        <div className="flex relative items-center ">
          <input
            type="text"
            className="focus:outline-none px-3 pr-8 box-border w-19.06 h-3.06  rounded-0.6  placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.31 placeholder:text-searchGray shadow-shadowInput"
            placeholder="Search By Name or Email"
            onChange={handleSearchTextChange}
          />
          <div className="absolute right-5 w-0.78 h-0.75 ">
            <img src={searchIcon} alt="" />
          </div>
        </div>
        <div
          className={`day w-1/3 h-3.06 flex items-center justify-center ml-5 box-border rounded-0.6 ${
            customDateLink['1day'] ? 'border-gradient-rounded' : 'app-input-card-border'
          } shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12 cursor-pointer`}
          onClick={() => selectCustomDate('1day')}
        >
          1D
        </div>
        <div
          className={`day w-1/3 h-3.06 flex items-center justify-center ml-5  box-border rounded-0.6 ${
            customDateLink['7day'] ? 'border-gradient-rounded' : 'app-input-card-border'
          } shadow-shadowInput font-Poppins font-semibold text-card text-memberDay leading-1.12 cursor-pointer`}
          onClick={() => selectCustomDate('7day')}
        >
          7D
        </div>
        <div
          className={`day w-1/3 h-3.06 flex items-center justify-center ml-5 box-border rounded-0.6 ${
            customDateLink['1month'] ? 'border-gradient-rounded' : 'app-input-card-border'
          } shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12 cursor-pointer`}
          onClick={() => selectCustomDate('1month')}
        >
          1M
        </div>
        <div className="box-border cursor-pointer rounded-0.6 shadow-contactCard app-input-card-border relative ml-5" ref={dropDownRef}>
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
                        onChange={(date: Date, event: ChangeEvent<Date>) => selectCustomBetweenDate(event, date, 'start')}
                        className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                        placeholderText="DD/MM/YYYY"
                        ref={datePickerRefStart}
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
                        onChange={(date: Date, event: ChangeEvent<Date>) => selectCustomBetweenDate(event, date, 'end')}
                        className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                        placeholderText="DD/MM/YYYY"
                        ref={datePickerRefEnd}
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

        <div className="ml-1.30 w-[800px]">{MemberFilter}</div>
        <div className="ml-0.652">
          <div
            className="export w-6.98 rounded-0.6 shadow-contactCard box-border bg-white items-center app-input-card-border h-3.06 justify-evenly flex ml-0.63 cursor-pointer hover:border-infoBlack transition ease-in-out duration-300"
            onClick={fetchMembersListExportData}
          >
            <h3 className="text-memberDay leading-1.12 font-Poppins font-semibold text-card">Export</h3>
            <img src={exportImage} alt="" />
          </div>
        </div>
      </div>
      {customizedColumn && (customizedColumn?.[0]?.name as { name: string; id: string })?.name ? (
        <div className="memberTable mt-1.8">
          <div className="py-2 overflow-x-auto mt-1.868">
            <div className="inline-block min-w-full overflow-hidden align-middle rounded-0.6 border-table no-scroll-bar overflow-x-auto overflow-y-auto sticky top-0 fixTableHead max-h-34 min-h-[31.25rem]">
              <table className="min-w-full relative  rounded-t-0.6 ">
                <thead className="h-3.25  top-0 w-61.68 no-scroll-bar sticky ">
                  <tr className="min-w-full">
                    {columns.map(
                      (columnName: ColumnNameProps) =>
                        columnName.isDisplayed && (
                          <Fragment key={columnName.id}>
                            <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray ">
                              {columnName.name}
                            </th>
                          </Fragment>
                        )
                    )}
                  </tr>
                </thead>
                {/* {Check with the custom column dynamic order and displays content/rows as per the index position of the arranged column name} */}
                <tbody>
                  {customizedColumn.map((member: Record<string, unknown>) => (
                    <tr className="border-b" key={(member?.name as { name: string; id: string })?.id as Key}>
                      {Object.keys(member).map((column: keyof typeof member, index) => (
                        <td className="px-6 py-4" key={index}>
                          {column === 'name' ? (
                            memberColumnsLoader ? (
                              <Skeleton width={width_90} />
                            ) : (
                              <div className="flex ">
                                <div
                                  className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer"
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
                              <div className="flex gap-x-2">
                                {(member?.platforms as Array<{ id: string; name: string; platformLogoUrl: string }>)?.map(
                                  (platforms: { name: string; id: string; platformLogoUrl: string }, index: number) => (
                                    <div
                                      className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer w-[1.3419rem] h-[1.3419rem] rounded-full"
                                      key={index}
                                    >
                                      <img src={platforms?.platformLogoUrl} alt="" className="rounded-full" />
                                    </div>
                                  )
                                )}
                              </div>
                            )
                          ) : column === 'tags' ? (
                            memberColumnsLoader ? (
                              <Skeleton width={width_90} />
                            ) : (
                              <div className="flex ">
                                <div className="py-3 flex gap-2 items-center font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                                  {(member?.tags as Array<{ id: string; name: string }>)
                                    ?.slice(0, 2)
                                    .map((tags: { name: string; id: string }, index: number) => (
                                      <div
                                        className="bg-tagSection rounded w-5.25 h-8 flex justify-between px-3 items-center cursor-pointer"
                                        key={index}
                                      >
                                        <div className="font-Poppins font-normal text-card text-profileBlack leading-5">{tags?.name}</div>
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
                                    ))}
                                  <div className="font-Poppins font-semibold leading-5 text-tag text-card underline">
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
                              <div className="flex flex-col">
                                <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                                  {member?.lastActivity ? format(parseISO(member?.lastActivity as string), 'MMM dd yyyy') : '--'}
                                </div>
                                <div className="font-medium font-Poppins text-card leading-1.31 text-tableDuration">
                                  {member?.lastActivity ? format(parseISO(member?.lastActivity as string), 'HH:MM') : '--'}
                                </div>
                              </div>
                            )
                          ) : memberColumnsLoader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="flex ">
                              <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                                {member[column] as ReactNode}
                              </div>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="px-6 py-4">
                    <td className="px-6 py-4"></td>
                  </tr>
                </tbody>
              </table>
              <div className="px-6 py-6 flex items-center gap-0.66 pl-[30%] w-full rounded-b-lg fixed bg-white bottom-0">
                <Pagination currentPage={page} totalPages={totalPages} limit={limit} onPageChange={(page) => setPage(Number(page))} />
              </div>
              <div className="fixed bottom-10 right-32">
                <div
                  className="btn-drag p-3 flex items-center justify-center cursor-pointer shadow-dragButton rounded-0.6 "
                  onClick={() => setIsModalOpen(true)}
                >
                  <img src={editIcon} alt="" />
                </div>
              </div>
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
      ) : (
        <div className="flex flex-col items-center justify-center w-full fixTableHead-nomember">
          <div>
            <img src={noMemberIcon} alt="No Member" />
          </div>
          <div className="pt-5 font-Poppins font-medium text-tableDuration text-lg leading-10">No Members</div>
        </div>
      )}
    </div>
  );
};

export default Members;
