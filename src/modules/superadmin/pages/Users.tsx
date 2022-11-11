/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable indent */
import useDebounce from '@/hooks/useDebounce';
import { API_ENDPOINT } from '@/lib/config';
import fetchExportList from '@/lib/fetchExport';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import { UsersLoader } from 'common/Loader/UsersLoader';
import Pagination from 'common/pagination/pagination';
import { width_90 } from 'constants/constants';
import { format, parseISO } from 'date-fns';
import { filterDateProps } from 'modules/members/interface/members.interface';
import React, { ChangeEvent, Fragment, ReactNode, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Modal from 'react-modal';
import exportImage from '../../../assets/images/export.svg';
import noMemberIcon from '../../../assets/images/no-member.svg';
import searchIcon from '../../../assets/images/search.svg';
import { Platform, UserMemberFilterExportProps, UserMembersListData, UsersMemberListResponse, UserWorkspaces } from '../interface/users.interface';
import { getUsersListService } from '../services/users.services';
import UsersAnalyticsCard from './UsersAnalyticsCard';
import UsersFilter from './UsersFilter';
import { ColumNames } from './UsersTableData';
Modal.setAppElement('#root');

const Users: React.FC = () => {
  const limit = 10;
  // const [columns, setColumns] = useState<Array<ColumnNameProps>>(ColumNames);
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [fetchLoader, setFetchLoader] = useState<{ getLoader: boolean; exportLoader: boolean }>({
    getLoader: false,
    exportLoader: false
  });

  const debouncedValue = useDebounce(searchText, 300);

  const [filterExportParams, setFilterExportParams] = useState<UserMemberFilterExportProps>({
    platform: [],
    domain: [],
    subscription: [],
    joinedAtLte: '',
    joinedAtGte: '',
    expiryAtLte: '',
    expiryAtGte: ''
  });
  const [filteredDate, setFilteredDate] = useState<filterDateProps>({
    filterStartDate: '',
    filterEndDate: ''
  });

  const [membersList, setMembersList] = useState<UsersMemberListResponse>({
    data: [],
    totalPages: 0,
    previousPage: 0,
    nextPage: 0
  });

  // Function to dispatch the search text and to hit api of member list.
  // eslint-disable-next-line space-before-function-paren
  const getFilteredMembersList = async (pageNumber: number, text: string, date?: string, endDate?: string) => {
    setFilteredDate({ filterStartDate: date!, filterEndDate: endDate! });
    setFetchLoader((prev) => ({ ...prev, getLoader: true }));
    const data = await getUsersListService({
      page: pageNumber,
      limit,
      search: text,
      ...(date ? { 'createdAT.gte': date } : {}),
      ...(endDate ? { 'createdAT.lte': endDate } : {}),
      ...(filterExportParams.platform.length ? { platformId: filterExportParams.platform } : {}),
      ...(filterExportParams.domain.length ? { domain: filterExportParams.domain } : {}),
      ...(filterExportParams.subscription.length ? { subscription: filterExportParams.subscription } : {}),
      ...(filterExportParams.joinedAtLte ? { 'joinedAt.lte': filterExportParams.joinedAtLte } : {}),
      ...(filterExportParams.joinedAtGte ? { 'joinedAt.gte': filterExportParams.joinedAtGte } : {}),
      ...(filterExportParams.expiryAtLte ? { 'expiryAt.lte': filterExportParams.expiryAtLte } : {}),
      ...(filterExportParams.expiryAtGte ? { 'expiryAt.gte': filterExportParams.expiryAtGte } : {})
    });
    setFetchLoader((prev) => ({ ...prev, getLoader: false }));
    setPage(1);
    setMembersList({
      data: data?.data as unknown as UserMembersListData[],
      totalPages: data?.totalPages as number,
      previousPage: data?.previousPage as number,
      nextPage: data?.nextPage as number
    });
  };

  useEffect(() => {
    if (debouncedValue) {
      getFilteredMembersList(1, debouncedValue);
    }
  }, [debouncedValue]);

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (!searchText) {
      getFilteredMembersList(
        1,
        searchText
        // customStartDate ? customStartDate && convertStartDate(customStartDate) : customSingleStartDate && convertStartDate(customSingleStartDate),
        // customEndDate && convertEndDate(customEndDate)
      );
    }
    setSearchText(searchText);
  };

  useEffect(() => {
    getFilteredMembersList(page, searchText, filteredDate.filterStartDate, filteredDate.filterEndDate);
  }, [page]);

  // Fetch members list data in comma separated value
  // eslint-disable-next-line space-before-function-paren
  const fetchMembersListExportData = async () => {
    setFetchLoader((prev) => ({ ...prev, exportLoader: true }));
    await fetchExportList(
      `${API_ENDPOINT}/v1/super-admin/users/export`,
      {
        search: debouncedValue,
        ...(filteredDate.filterStartDate ? { 'createdAT.gte': filteredDate.filterStartDate } : {}),
        ...(filteredDate.filterEndDate ? { 'createdAT.lte': filteredDate.filterEndDate } : {}),
        ...(filterExportParams.platform.length ? { platformId: filterExportParams.platform } : {}),
        ...(filterExportParams.domain.length ? { domain: filterExportParams.domain } : {}),
        ...(filterExportParams.subscription.length ? { subscription: filterExportParams.subscription } : {}),
        ...(filterExportParams.joinedAtLte ? { 'joinedAt.lte': filterExportParams.joinedAtLte } : {}),
        ...(filterExportParams.joinedAtGte ? { 'joinedAt.gte': filterExportParams.joinedAtGte } : {}),
        ...(filterExportParams.expiryAtLte ? { 'expiryAt.lte': filterExportParams.expiryAtLte } : {}),
        ...(filterExportParams.expiryAtGte ? { 'expiryAt.gte': filterExportParams.expiryAtGte } : {})
      },
      'UserMembersListExport.xlsx'
    );
    setFetchLoader((prev) => ({ ...prev, exportLoader: false }));
  };

  // Customization function to re-arrange table as per need - Future proof
  const customizedColumn = membersList?.data?.reduce(
    (acc: Array<Record<string, unknown>>, currentValue: Record<string, unknown>): Array<Record<string, unknown>> => {
      const accumulatedColumn: Record<string, unknown> = {};
      const memberValue = { ...currentValue };
      ColumNames.forEach((column: ColumnNameProps) => {
        // eslint-disable-next-line no-prototype-builtins
        if (memberValue.hasOwnProperty(column.id)) {
          if (column.isDisplayed) {
            accumulatedColumn[column.id] = memberValue[column.id];
          }
        } else {
          accumulatedColumn[column.id] = null;
        }
      });
      const platforms: Platform[] = [];
      (memberValue?.userWorkspaces as UserWorkspaces[])?.forEach((item) => {
        item.workspace?.WorkspacePlatforms?.forEach((pl) => {
          platforms.push(pl.platformSettings.platforms as Platform);
        });
        platforms.push();
      });
      accumulatedColumn['platforms'] = platforms;
      acc.push(accumulatedColumn);
      return acc;
    },
    []
  );

  // Memoized functionality to stop re-render.
  const UserFilter = useMemo(
    () => (
      <UsersFilter
        page={page}
        limit={limit}
        memberFilterExport={setFilterExportParams}
        searchText={debouncedValue}
        filteredDate={filteredDate}
        setMembersList={setMembersList}
        setPage={setPage}
      />
    ),
    [debouncedValue, filteredDate]
  );

  const renderUserTable = () => {
    if (!fetchLoader.getLoader && !customizedColumn?.[0]?.email) {
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
      <div className="memberTable mt-1.8">
        <div className="py-2  mt-1.868">
          <div className="inline-block min-w-full w-full align-middle rounded-0.6 border-table  overflow-x-auto overflow-y-auto sticky top-0 fixTableHead max-h-34 min-h-[31.25rem] mb-16">
            <table className="min-w-full relative w-full rounded-t-0.6 ">
              <thead className="h-3.25  top-0 w-full  sticky ">
                <tr className="min-w-full w-full">
                  {ColumNames.map(
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
                {fetchLoader.getLoader &&
                  Array.from({ length: 10 }, (_, i) => i + 1).map((type: number) => (
                    <Fragment key={type}>
                      <UsersLoader />
                    </Fragment>
                  ))}
                {customizedColumn.map((member: Record<string, unknown>) => (
                  <tr className="border-b " key={Math.random()}>
                    {Object.keys(member).map((column: keyof typeof member, index) => (
                      <td className="px-3 py-4 " key={index}>
                        {column === 'createdAt' ? (
                          fetchLoader.getLoader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="flex flex-col w-[150px]">
                              <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                                {member?.createdAt ? format(parseISO(member?.createdAt as string), 'dd MMM yyyy') : '--'}
                              </div>
                              <div className="font-medium font-Poppins text-card leading-1.31 text-tableDuration">
                                {(member?.createdAt as ReactNode) && format(parseISO(member?.createdAt as string), 'HH:MM')}
                              </div>
                            </div>
                          )
                        ) : column === 'lastLogin' ? (
                          fetchLoader.getLoader ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <div className="flex flex-col w-[150px]">
                              <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                                {member?.lastLogin ? format(parseISO(member?.lastLogin as string), 'dd MMM yyyy') : '--'}
                              </div>
                              <div className="font-medium font-Poppins text-card leading-1.31 text-tableDuration">
                                {(member?.lastLogin as ReactNode) && format(parseISO(member?.lastLogin as string), 'HH:MM')}
                              </div>
                            </div>
                          )
                        ) : column === 'platforms' ? (
                          fetchLoader.getLoader ? (
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
                        ) : (
                          <div className="flex ">
                            <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31">
                              {member[column] ? (member[column] as ReactNode) : '--'}
                            </div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="px-3 py-4">
                  <td className="px-3 py-4"></td>
                </tr>
              </tbody>
            </table>
            {!fetchLoader.getLoader && (
              <div className="px-3 py-6 flex items-center gap-0.66 pl-[30%] w-full rounded-b-lg fixed bg-white bottom-0">
                <Pagination currentPage={page} totalPages={membersList.totalPages} limit={limit} onPageChange={(page) => setPage(Number(page))} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col mt-12">
      {/* <h3 className="font-Poppins font-semibold text-infoBlack text-infoData leading-9 dark:text-white">Members</h3> */}
      <div className="flex flex-col xl:flex-row  justify-between mt-1.8 i ">
        <div className="flex relative items-center w-1/2 xl:w-[250px] 2xl:w-19.06">
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
          <div className="ml-1.30 w-[155px]">{UserFilter}</div>
          <div className="ml-0.652 w-[112px]">
            <div
              aria-disabled={fetchLoader.exportLoader}
              className={`export w-6.98 rounded-0.6 shadow-contactCard box-border bg-white items-center app-input-card-border h-3.06 justify-evenly flex cursor-pointer hover:border-infoBlack transition ease-in-out duration-300 ${
                fetchLoader.exportLoader || !customizedColumn?.length ? 'cursor-not-allowed' : ''
              }`}
              onClick={() => (customizedColumn?.length ? !fetchLoader.exportLoader && fetchMembersListExportData() : null)}
            >
              <h3 className="text-memberDay leading-1.12 font-Poppins font-semibold text-card">Export</h3>
              <img src={exportImage} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="member-card pt-10">
        <UsersAnalyticsCard />
      </div>
      <div className="flex flex-col mt-12">{renderUserTable()}</div>
    </div>
  );
};

export default Users;
