/* eslint-disable no-unused-vars */
import Button from 'common/button';
import MembersCard from 'common/membersCard/membersCard';
import Pagination from 'common/pagination/pagination';
import React, {
  ChangeEvent, Fragment, Key, ReactNode, useEffect, useMemo, useState
} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import calendarIcon from '../../../assets/images/calandar.svg';
import editIcon from '../../../assets/images/edit.svg';
import exportImage from '../../../assets/images/export.svg';
import searchIcon from '../../../assets/images/search.svg';
import closeIcon from '../../../assets/images/tag-close.svg';
import './Members.css';
import useDebounce from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import { format, parseISO, subDays, subMonths } from 'date-fns';
import membersSlice from '../store/slice/members.slice';
import MembersFilter from './MembersFilter';
import MembersDraggableColumn from './membersTableColumn/membersDraggableColumn';
import { ColumNames } from './MembersTableData';

Modal.setAppElement('#root');

const Members: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const [toDate, setToDate] = useState<Date>();
  const [columns, setColumns] = useState<Array<ColumnNameProps>>(ColumNames);
  const [customizedColumnBool, saveCustomizedColumn] = useState<boolean>(false);
  const [page, setpage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>('');

  const dispatch = useAppDispatch();
  const customizedColumnData = useAppSelector((state) => state.members.customizedColumn);

  const debouncedValue = useDebounce(searchText, 300);

  const { data, totalPages, previousPage, nextPage } = useAppSelector((state) => state.members.membersListData);

  useEffect(() => {
    dispatch(
      membersSlice.actions.membersList({
        page,
        limit
      })
    );
  }, [page]);

  //Set new column change if the initial order changes.
  useEffect(() => {
    if (customizedColumnData.length > 1) {
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
        page,
        limit,
        search: text,
        'createdAT.lte': date
      })
    );
  };

  const handleCustomizeColumnSave = () => {
    saveCustomizedColumn(!customizedColumnBool);
  };

  const handleModalClose = (): void => {
    setisModalOpen(false);
    handleCustomizeColumnSave();
  };

  const navigateToProfile = () => {
    navigate('/members/profile');
  };

  // Function to convert the day and subtract based on no of days/ months.
  const selectCustomDate = (date: string, customDate?: Date) => {
    const todayDate = new Date();
    if (date === '1day') {
      getFilteredMembersList('', format(subDays(todayDate, 1), 'yyyy-MM-dd'));
    }
    if (date === '7day') {
      getFilteredMembersList('', format(subDays(todayDate, 7), 'yyyy-MM-dd'));
    }
    if (date === '1month') {
      getFilteredMembersList('', format(subMonths(todayDate, 1), 'yyyy-MM-dd'));
    }
    if (customDate) {
      setToDate(customDate);
      getFilteredMembersList('', format(customDate, 'yyyy-MM-dd'));
    }
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (searchText === '') {
      getFilteredMembersList(searchText);
    }
    setSearchText(searchText);
  };

  // Function to map customized column with api data response to create a new column array with index matching with customized column.
  // eslint-disable-next-line max-len
  const customizedColumn = data?.reduce((acc: Array<Record<string, unknown>>, currentValue: Record<string, unknown>): Array<Record<string, unknown>> => {
    const accumulatedColumn: Record<string, unknown> = {};
    const memberValue = { ...currentValue };
    memberValue['location'] = 'India';
    columns.forEach((column: ColumnNameProps) => {
      // eslint-disable-next-line no-prototype-builtins
      if (memberValue.hasOwnProperty(column.id)) {
        if (column.isDisplayed) {
          accumulatedColumn[column.id] = memberValue[column.id];
        }
      }
    });
    acc.push(accumulatedColumn);
    return acc;
  }, []);

  // Memoized functionality to stop re-renderization.
  const membersColumn = useMemo(
    () => <MembersDraggableColumn MembersColumn={customizedColumnBool} handleModalClose={handleModalClose} />,
    [customizedColumnBool]
  );

  const MemberFilter = useMemo(() => <MembersFilter page={page} limit={limit} />, []);

  return (
    <div className="container flex flex-col mx-auto">
      <h3 className="font-Poppins font-semibold text-infoBlack text-infoData leading-9">Members</h3>
      <div className="flex mt-1.8 items-center ">
        <div className="flex relative items-center ">
          <input
            type="text"
            className="focus:outline-none px-3 box-border w-19.06 h-3.06  rounded-0.6 shadow-profileCard placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.31 placeholder:text-searchGray"
            placeholder="Search By Name or Email"
            onChange={handleSearchTextChange}
          />
          <div className="absolute right-5 w-0.78 h-0.75 ">
            <img src={searchIcon} alt="" />
          </div>
        </div>
        <div
          className="day w-full h-3.06 flex items-center justify-center ml-3.19 box-border rounded-0.6 app-input-card-border shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12 cursor-pointer"
          onClick={() => selectCustomDate('1day')}
        >
          1D
        </div>
        <div
          className="day w-full h-3.06 flex items-center justify-center ml-0.653 box-border rounded-0.6 app-input-card-border shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12 cursor-pointer"
          onClick={() => selectCustomDate('7day')}
        >
          7D
        </div>
        <div
          className="day w-full h-3.06 flex items-center justify-center ml-0.653 box-border rounded-0.6 app-input-card-border shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12 cursor-pointer"
          onClick={() => selectCustomDate('1month')}
        >
          1M
        </div>

        <div className="relative flex items-center  ml-0.653 ">
          <DatePicker
            selected={toDate}
            onChange={(date: Date) => selectCustomDate('', date)}
            className="export w-9.92 h-3.06  shadow-contactCard rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
            placeholderText="Custom Date"
          />
          <img className="absolute icon-holder left-32 cursor-pointer" src={calendarIcon} alt="" />
        </div>

        <div className="ml-1.30 w-full">{MemberFilter}</div>
        <div className="ml-0.652">
          <div className="export w-6.98 rounded-0.6 shadow-contactCard box-border bg-white items-center app-input-card-border h-3.06 justify-evenly flex ml-0.63 cursor-pointer">
            <h3 className="text-memberDay leading-1.12 font-Poppins font-semibold text-card">Export</h3>
            <img src={exportImage} alt="" />
          </div>
        </div>
      </div>
      <div className="member-card pt-10">
        <MembersCard />
      </div>
      <div className="memberTable mt-1.8">
        <div className="py-2 overflow-x-auto mt-1.868">
          <div className="inline-block min-w-full overflow-hidden align-middle w-61.68 rounded-0.6 border-table no-scroll-bar overflow-x-auto overflow-y-auto sticky top-0 fixTableHead max-h-34">
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
                  <tr className="border-b" key={member.name as Key}>
                    {Object.keys(member).map((column: keyof typeof member, index) => (
                      <td className="px-6 py-4" key={index}>
                        {column === 'name' ? (
                          <div className="flex ">
                            <div
                              className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer"
                              onClick={navigateToProfile}
                            >
                              {member.name as string}
                            </div>
                          </div>
                        ) : column === 'platforms' ? (
                          <div className="flex gap-x-2">
                            {(member?.platforms as Array<{ platform: { name: '' } }>)?.map(
                              (platforms: { platform: { name: string } }, index: number) => (
                                <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer" key={index}>
                                  {platforms.platform.name}
                                </div>
                              )
                            )}
                          </div>
                        ) : column === 'tags' ? (
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
                                {(member?.tags as Array<Record<string, unknown>>).length > 2 ? `${(member?.tags as Array<Record<string, unknown>>).length - 2} more` : ''}{' '}
                              </div>
                            </div>
                          </div>
                        ) : column === 'lastActivity' ? (
                          <div className="flex ">
                            <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                              {format(parseISO(member?.lastActivity as string), 'MM/dd/yyyy')}
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
              className="w-24.31 mx-auto mt-9.18  pb-20 bg-white border-fetching-card rounded-lg shadow-modal"
            >
              <div className="flex flex-col px-1.68 relative">
                <h3 className="font-Inter font-semibold text-xl mt-1.8  leading-6">Customize Column</h3>
                <div className="pb-10">{membersColumn}</div>
                <div className="flex buttons absolute -bottom-16 right-[27px]">
                  <Button
                    text="CANCEL"
                    type="submit"
                    className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-5.25  rounded border-none"
                    onClick={handleModalClose}
                  />
                  <Button
                    onClick={handleCustomizeColumnSave}
                    text="SAVE"
                    type="submit"
                    className="text-white font-Poppins text-error font-medium leading-5 btn-save-modal cursor-pointer rounded shadow-contactBtn w-5.25 border-none h-2.81"
                  />
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
