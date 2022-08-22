/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Button from 'common/button';
import MembersCard from 'common/membersCard/MembersCard';
import React, {
  ChangeEvent, Fragment, Key, ReactNode, useEffect, useMemo, useRef, useState
} from 'react';
import DatePicker from 'react-datepicker';
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
// import { membersTableData } from './MembersTableData';
import useDebounce from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import Pagination from 'common/pagination/pagination';
import { format, parseISO, subDays, subMonths } from 'date-fns';
import noMemberIcon from '../../../assets/images/no-member.svg';
import slackIcon from '../../../assets/images/slack.svg';
import membersSlice from '../store/slice/members.slice';
import MembersFilter from './MembersFilter';
import MembersDraggableColumn from './membersTableColumn/membersDraggableColumn';
import { ColumNames } from './MembersTableData';
import { customDateLinkProps } from './membertypes';

Modal.setAppElement('#root');

const Members: React.FC = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const [toDate, setToDate] = useState<Date>();
  const [columns, setColumns] = useState<Array<ColumnNameProps>>(ColumNames);
  const [customizedColumnBool, saveCustomizedColumn] = useState<boolean>(false);
  const [page, setpage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [customDateLink, setCustomDateLink] = useState<Partial<customDateLinkProps>>({
    '1day': false,
    '7day': false,
    '1month': false
  });

  const dispatch = useAppDispatch();

  const debouncedValue = useDebounce(searchText, 300);

  const [isFilterDropdownActive, setisFilterDropdownActive] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleFilterDropdown = (): void => {
    setisFilterDropdownActive((prev) => !prev);
  };
  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && dropDownRef.current.contains(event.target as Node)) {
      setisFilterDropdownActive(true);
    } else {
      setisFilterDropdownActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const {
    membersListData: { data, totalPages, previousPage, nextPage },
    customizedColumn: customizedColumnData
  } = useAppSelector((state) => state.members);

  useEffect(() => {
    dispatch(
      membersSlice.actions.membersList({
        membersQuery: {
          page: 1,
          limit: 10
        },
        workspaceId: workspaceId!
      })
    );
    dispatch(membersSlice.actions.membersPlatformFilter());
    dispatch(
      membersSlice.actions.membersTagFilter({
        membersQuery: { tags: { searchedTags: '', checkedTags: '' } },
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
  }, [page]);

  //Set new column change if the initial order changes.
  useEffect(() => {
    if (customizedColumnData?.length > 1) {
      setColumns(customizedColumnData);
    }
  }, [customizedColumnData]);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedValue) {
      getFilteredMembersList(debouncedValue);
    }
  }, [debouncedValue]);

  // Function to dispatch the search text to hit api of member list.
  const getFilteredMembersList = (text: string, date?: string) => {
    dispatch(
      membersSlice.actions.membersList({
        membersQuery: {
          page,
          limit,
          search: text,
          'createdAT.lte': date
        },
        workspaceId: workspaceId!
      })
    );
  };

  const handleCustomizeColumnSave = () => {
    saveCustomizedColumn((prevState: boolean) => !prevState);
  };

  const handleModalClose = (): void => {
    setisModalOpen(false);
    saveCustomizedColumn(false);
  };

  const navigateToProfile = (memberId: string) => {
    navigate(`/${workspaceId}/members/${memberId}/profile`);
  };

  // Function to convert the day and subtract based on no of days/ months.
  const selectCustomDate = (date: string, customDate?: Date) => {
    const todayDate = new Date();
    if (date === '1day') {
      getFilteredMembersList('', format(subDays(todayDate, 1), 'yyyy-MM-dd'));
      setCustomDateLink({ [date]: true });
    }
    if (date === '7day') {
      getFilteredMembersList('', format(subDays(todayDate, 7), 'yyyy-MM-dd'));
      setCustomDateLink({ [date]: true });
    }
    if (date === '1month') {
      getFilteredMembersList('', format(subMonths(todayDate, 1), 'yyyy-MM-dd'));
      setCustomDateLink({ [date]: true });
    }
    if (customDate) {
      setToDate(customDate);
      getFilteredMembersList('', format(customDate, 'yyyy-MM-dd'));
      setCustomDateLink({ '1day': false, '7day': false, '1month': false });
    }
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (searchText === '') {
      getFilteredMembersList(searchText);
    }
    setSearchText(searchText);
  };

  // Fetch members list data in comma separated value
  // const fetchMembersListExportData = () => {
  //   // dispatch(membersSlice.actions.membersListExport({ workspaceId: workspaceId! }));

  //   axios.get(`${API_ENDPOINT}/v1/${workspaceId}/members/memberlistexport`, {
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //       'responseType': 'blob'
  //     }
  //   // eslint-disable-next-line no-console
  //   }).then((response:any) => console.log('err', response?.data?.data?.data))
  //     .then((blob) => {
  //       const response = new Blob([blob], { type: 'application/octet-stream' });
  //       const url = window.URL.createObjectURL(response);
  //       const anchor = document.createElement('a');
  //       anchor.href = url;
  //       anchor.download = 'MembersExport.xlsx';
  //       document.body.appendChild(anchor);
  //       anchor.click();
  //       anchor.remove();
  //     });
  //   // .then((blob) => {
  //   //   // eslint-disable-next-line no-console
  //   //   console.log('err', blob);
  //   //   const url = window.URL.createObjectURL(blob);
  //   //   const anchor = document.createElement('a');
  //   //   anchor.href = url;
  //   //   anchor.download = 'MembersExport.xlsx';
  //   //   document.body.appendChild(anchor);
  //   //   anchor.click();
  //   //   anchor.remove();
  //   // });
  // };

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

  // Memoized functionality to stop re-renderization.
  const membersColumn = useMemo(
    () => <MembersDraggableColumn MembersColumn={customizedColumnBool} handleModalClose={handleModalClose} />,
    [customizedColumnBool]
  );

  const MemberFilter = useMemo(() => <MembersFilter page={page} limit={limit} />, []);

  const selectActiveBetweenDate = (event: ChangeEvent<Date>, date: Date, dateTime: string) => {
    event.stopPropagation();
    if (dateTime === 'start') {
      setStartDate(date);
      setisFilterDropdownActive(true);
    }

    if (dateTime === 'end') {
      setEndDate(date);
      setisFilterDropdownActive(true);
    }
  };

  return (
    <div className="flex flex-col mt-12">
      <h3 className="font-Poppins font-semibold text-infoBlack text-infoData leading-9">Members</h3>
      <div className="member-card pt-10">
        <MembersCard />
      </div>
      <div className="flex mt-1.8 items-center ">
        <div className="flex relative items-center ">
          <input
            type="text"
            className="focus:outline-none px-3 box-border w-19.06 h-3.06  rounded-0.6  placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.31 placeholder:text-searchGray shadow-shadowInput"
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

        {/* <div className="relative flex items-center  ml-0.653 ">
          <DatePicker
            selected={toDate}
            onChange={(date: Date) => selectCustomDate('', date)}
            className="export w-9.92 h-3.06  shadow-contactCard rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
            placeholderText="Custom Date"
          />
          <img className="absolute icon-holder left-32 cursor-pointer" src={calendarIcon} alt="" />
        </div> */}
        <div className="box-border cursor-pointer rounded-0.6 shadow-contactCard app-input-card-border relative ml-5" ref={dropDownRef}>
          <div className="flex h-3.06 w-[11.25rem] items-center justify-between px-5 " onClick={handleFilterDropdown}>
            <div className="box-border rounded-0.6 shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12">Custom Date</div>
            <div>
              <img src={dropdownIcon} alt="" className={isFilterDropdownActive ? 'rotate-180' : 'rotate-0'} />
            </div>
          </div>
          {isFilterDropdownActive &&  <div className="absolute w-16.56 pb-0 bg-white border z-40 rounded-0.3">
            <div className="flex flex-col pb-5">
              <>
                <div className="flex flex-col px-3 pt-4">
                  <label htmlFor="Start Date p-1 font-Inter font-normal leading-4 text-trial text-searchBlack">Start Date</label>
                  <div className="relative flex items-center">
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'start')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                    />
                    <img className="absolute icon-holder right-6 cursor-pointer" src={calendarIcon} alt="" />
                  </div>
                </div>
                <div className="flex flex-col px-3 pb-4 pt-3">
                  <label htmlFor="Start Date p-1 font-Inter font-Inter font-normal leading-4 text-trial text-searchBlack">End Date</label>
                  <div className="relative flex items-center">
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'end')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                    />
                    <img className="absolute icon-holder right-6 cursor-pointer" src={calendarIcon} alt="" />
                  </div>
                </div>
              </>
            </div>
          </div>}
        </div>

        <div className="ml-1.30 w-[800px]">{MemberFilter}</div>
        <div className="ml-0.652">
          <div
            className="export w-6.98 rounded-0.6 shadow-contactCard box-border bg-white items-center app-input-card-border h-3.06 justify-evenly flex ml-0.63 cursor-pointer"
            // onClick={fetchMembersListExportData}
          >
            <h3 className="text-memberDay leading-1.12 font-Poppins font-semibold text-card">Export</h3>
            <img src={exportImage} alt="" />
          </div>
        </div>
      </div>
      {customizedColumn && customizedColumn?.[0]?.name ? (
        <div className="memberTable mt-1.8">
          <div className="py-2 overflow-x-auto mt-1.868">
            <div className="inline-block min-w-full overflow-hidden align-middle w-61.68 rounded-0.6 border-table no-scroll-bar overflow-x-auto overflow-y-auto sticky top-0 fixTableHead max-h-34 min-h-[31.25rem]">
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
                            <div className="flex ">
                              <div
                                className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer"
                                onClick={() => navigateToProfile((member?.name as { name: string; id: string })?.id as string)}
                              >
                                {(member?.name as { name: string; id: string })?.name as string}
                              </div>
                            </div>
                          ) : column === 'platforms' ? (
                            <div
                              className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer h-1.375 w-1.375 flex"
                              key={index}
                            >
                              <img className="m-1 h-1.375 w-1.375 mt-0" src={slackIcon} title="Slack" />
                              {/* <p className='h-1.375 w-1.375'>{'Slack'}</p> */}
                            </div>
                          ) : //    <div className="flex gap-x-2">
                          //   {(member?.platforms as Array<{id:string, name:string}>)?.map((platforms: { name: string, id:string }, index: number) => (
                          //     <div
                          //       className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer h-1.375 w-1.375"
                          //       key={index}
                          //     >
                          //       {'Slack'}
                          //     </div>
                          //   ))}
                          // </div>
                            column === 'tags' ? (
                              <div className="flex ">
                                <div className="py-3 flex gap-2 items-center font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                                  {(member?.tags as Array<{ tag: { name: '' } }>)?.slice(0, 2).map((tags: { tag: { name: string } }, index: number) => (
                                    <div className="bg-tagSection rounded w-5.25 h-8 flex justify-between px-3 items-center" key={index}>
                                      <div className="font-Poppins font-normal text-card text-profileBlack leading-5">{tags?.tag?.name}</div>
                                      <div>
                                        <img src={closeIcon} alt="" />
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
                            ) : column === 'lastActivity' ? (
                              <div className="flex ">
                                <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                                  {member?.lastActivity ? format(parseISO(member?.lastActivity as string), 'MM/dd/yyyy') : '--'}
                                </div>
                              </div>
                            ) : (
                              <div className="flex ">
                                <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
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
                <Pagination currentPage={page} totalPages={totalPages} limit={limit} onPageChange={(page) => setpage(Number(page))} />
              </div>
              <div className="fixed bottom-10 right-32">
                <div
                  className="btn-drag w-3.375 h-3.375 flex items-center justify-center cursor-pointer shadow-dragButton rounded-0.6 "
                  onClick={() => setisModalOpen(true)}
                >
                  <img src={editIcon} alt="" />
                </div>
              </div>
              <Modal
                isOpen={isModalOpen}
                shouldCloseOnOverlayClick={true}
                onRequestClose={() => setisModalOpen(false)}
                className="w-24.31 mx-auto mt-9.18  pb-20 bg-white border-fetching-card rounded-lg shadow-modal outline-none"
              >
                <div className="flex flex-col px-1.68 relative">
                  <h3 className="font-Inter font-semibold text-xl mt-1.8  leading-6">Customize Column</h3>
                  <div className="pb-10">{membersColumn}</div>
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
