/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useDebounce from '@/hooks/useDebounce';
import usePlatform from '@/hooks/usePlatform';
import { convertEndDate, convertStartDate, generateDateAndTime } from '@/lib/helper';
import Button from 'common/button';
import Input from 'common/input';
import Pagination from 'common/pagination/pagination';
import { width_90 } from 'constants/constants';
import { PlatformResponse } from 'modules/settings/interface/settings.interface';
import React, { ChangeEvent, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import actionDotIcon from '../../../assets/images/action-dot.svg';
import downArrow from '../../../assets/images/filter-dropdown.svg';
import filterDownIcon from '../../../assets/images/report-dropdown.svg';
import {
  ActionDropDownEnum,
  getReportsListServiceResponseProps,
  ReportFilterDropDownEnum,
  ReportListServiceResponsePropsData,
  ReportOptions,
  ScheduleReportDateType
} from '../interfaces/reports.interface';
import { generateInstantReportsService, getReportsListService, removeReportService, scheduleReportService } from '../services/reports.service';
import './Report.css';
import calendarIcon from '../../../assets/images/calandar.svg';
import { ModalDrawer } from 'common/modals/ModalDrawer';
import deleteIcon from '../../../assets/images/delete.svg';
import { showSuccessToast } from 'common/toast/toastFunctions';
import { NavLink } from 'react-router-dom';
import noReportIcon from '../../../assets/images/no-reports.svg';

const Report: React.FC = () => {
  const limit = 10;
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [isDropdownActive, setIsDropdownActive] = useState<string>('');
  const [isFilterDropdownActive, setIsFilterDropdownActive] = useState<boolean>(false);
  const [activateFilter, setActivateFilter] = useState<{
    isPlatformActive: boolean;
    isStatusActive: boolean;
    isActiveBetween: boolean;
  }>({
    isPlatformActive: false,
    isStatusActive: false,
    isActiveBetween: false
  });
  const [page, setPage] = useState<number>(1);
  const { PlatformFilterResponse } = usePlatform();
  const [searchText, setSearchText] = useState<string>('');
  const [checkedPlatform, setCheckedPlatform] = useState<Record<string, unknown>>({});
  const [checkedFilterOption, setCheckedFilterOption] = useState<{
    checkPlatform: Array<string>;
    checkStatus: Array<string>;
  }>({ checkPlatform: [], checkStatus: [] });
  const [checkedStatus, setCheckedStatusOption] = useState<Record<string, unknown>>({});
  const [reportsList, setReportsList] = useState<getReportsListServiceResponseProps>({
    data: [],
    totalPages: '0',
    previousPage: '0',
    nextPage: '0'
  });
  const [date, setDate] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const [modalOpen, setModalOpen] = useState<{ removeModalOpen: boolean; scheduleOffModalOpen: boolean; generateReportModalOpen: boolean }>({
    removeModalOpen: false,
    scheduleOffModalOpen: false,
    generateReportModalOpen: false
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<{ id: string; scheduleActive: boolean }>({
    id: '',
    scheduleActive: false
  });

  const dropDownRef = useRef<HTMLDivElement>(null);
  const kebabMenuRef = useRef<HTMLDivElement>(null);

  const datePickerRefStart = useRef<ReactDatePicker>(null);
  const datePickerRefEnd = useRef<ReactDatePicker>(null);

  const debouncedValue = useDebounce(searchText, 300);

  const ReportFilterList = Object.values(checkedPlatform).concat(Object.values(checkedStatus));

  const getReportsList = async(props: { search: string; page: number; limit: number }, reset: boolean) => {
    setLoading(true);
    let reportData;
    if (!reset) {
      reportData = await getReportsListService({
        workspaceId: workspaceId!,
        params: {
          page: props.page,
          limit: props.limit,
          search: props.search,
          ...(checkedFilterOption.checkPlatform.length ? { platformId: checkedFilterOption.checkPlatform } : {}),
          ...(checkedFilterOption.checkStatus.length ? { reportStatus: checkedFilterOption.checkStatus } : {}),
          ...(date.startDate ? { startDate: date.startDate && convertStartDate(date.startDate) } : {}),
          ...(date.endDate ? { endDate: date.endDate && convertEndDate(date.endDate) } : {})
        }
      });
    }
    if (reset) {
      handleFilterDropdown();
      reportData = await getReportsListService({
        workspaceId: workspaceId!,
        params: {
          page: props.page,
          limit: props.limit,
          search: props.search
        }
      });
    }

    setLoading(false);

    setReportsList({
      data: reportData?.data as Array<ReportListServiceResponsePropsData>,
      totalPages: reportData?.totalPages as string,
      nextPage: reportData?.nextPage as string,
      previousPage: reportData?.previousPage as string
    });
  };

  const generateInstantReport = async(id: string) => {
    setLoading(true);
    const data = await generateInstantReportsService({
      workspaceId: workspaceId!,
      reportId: id
    });
    if (data?.reportUrl) {
      window.open(data.reportUrl, '_blank');
    }
    setLoading(false);
    setModalOpen((prevState) => ({ ...prevState, generateReportModalOpen: false }));
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setIsFilterDropdownActive(false);
    }

    if (kebabMenuRef && kebabMenuRef.current && !kebabMenuRef.current.contains(event.target as Node)) {
      handleDropDownActive('');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    localStorage.removeItem('reportValues');
    localStorage.removeItem('platforms');
    localStorage.removeItem('reportUpdateValues');
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    getReportsList(
      {
        search: searchText,
        page,
        limit
      },
      false
    );
  }, [page]);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedValue) {
      getReportsList({ page: 1, limit, search: debouncedValue }, false);
    }
  }, [debouncedValue]);

  const handleDropDownActive = (value: string): void => {
    setIsDropdownActive(value);
  };

  const disableApplyBtn = useMemo(() => {
    if (date.startDate === null && date.endDate === null && ReportFilterList.length === 0) {
      return true;
    }

    if (date.startDate && date.endDate) {
      return false;
    }

    if (date.startDate || date.endDate) {
      return true;
    }
    return false;
  }, [date, ReportFilterList]);

  const handleFilterDropdown = (): void => {
    setIsFilterDropdownActive((prev) => !prev);
    setActivateFilter((prevList) => ({ ...prevList, isPlatformActive: true }));
  };

  const handleFilterDropDownStatus = (type: string) => {
    if (type === ReportFilterDropDownEnum.platform) {
      setActivateFilter({ isActiveBetween: false, isStatusActive: false, isPlatformActive: activateFilter.isPlatformActive ? false : true });
    }

    if (type === ReportFilterDropDownEnum.status) {
      setActivateFilter({ isActiveBetween: false, isStatusActive: activateFilter.isStatusActive ? false : true, isPlatformActive: false });
    }

    if (type === ReportFilterDropDownEnum.activeBetween) {
      setActivateFilter({ isActiveBetween: activateFilter.isActiveBetween ? false : true, isStatusActive: false, isPlatformActive: false });
    }
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (!searchText) {
      getReportsList(
        {
          search: searchText,
          page,
          limit
        },
        false
      );
    }
    setPage(1);
    setSearchText(searchText);
  };

  const handlePlatformsCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const platform: string = event.target.name;
    setCheckedPlatform((preValue) => ({ ...preValue, [platform]: event.target.checked }));
  };

  const handleStatusCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const status: string = event.target.name;
    setCheckedStatusOption((preValue) => ({ ...preValue, [status]: event.target.checked }));
  };

  const selectActiveBetweenDate = (event: ChangeEvent<Date>, date: Date, dateTime: string) => {
    event.stopPropagation();
    if (dateTime === 'start') {
      setDate((prevDate) => ({ ...prevDate, startDate: date }));
    }

    if (dateTime === 'end') {
      setDate((prevDate) => ({ ...prevDate, endDate: date }));
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

  const handleAction = (actionType: string, selectedId: string, data: ReportListServiceResponsePropsData, scheduleActive: boolean) => {
    setSelectId((prev) => ({ ...prev, id: selectedId, scheduleActive }));
    if (actionType === ActionDropDownEnum.Remove) {
      setModalOpen((prevState) => ({ ...prevState, removeModalOpen: true }));
    }

    if (actionType === ActionDropDownEnum['ScheduleOff']) {
      setModalOpen((prevState) => ({ ...prevState, scheduleOffModalOpen: true }));
    }

    if (actionType === ActionDropDownEnum['ScheduleOn']) {
      setModalOpen((prevState) => ({ ...prevState, scheduleOffModalOpen: true }));
    }

    if (actionType === ActionDropDownEnum.Edit) {
      localStorage.setItem('reportUpdateValues', JSON.stringify(data));
      navigate(`/${workspaceId}/reports/edit-report`);
    }

    if (actionType === ActionDropDownEnum.Generate) {
      setModalOpen((prevState) => ({ ...prevState, generateReportModalOpen: true }));
    }
  };

  const handleModalClose = () => {
    if (modalOpen.removeModalOpen) {
      setModalOpen((prevState) => ({ ...prevState, removeModalOpen: false }));
    }

    if (modalOpen.scheduleOffModalOpen) {
      setModalOpen((prevState) => ({ ...prevState, scheduleOffModalOpen: false }));
    }

    if (modalOpen.generateReportModalOpen) {
      setModalOpen((prevState) => ({ ...prevState, generateReportModalOpen: false }));
    }
  };

  const submitFilterChange = async(): Promise<void> => {
    handleFilterDropdown();
    const checkPlatform: Array<string> = [];
    const checkStatusId: Array<string> = [];

    if (Object.keys(checkedPlatform).length > 0) {
      Object.keys(checkedPlatform).map((platform: string) => {
        if (checkedPlatform[platform] === true) {
          checkPlatform.push(platform);
        }
      });
    }

    if (Object.keys(checkedStatus).length > 0) {
      Object.keys(checkedStatus).map((status: string) => {
        if (checkedStatus[status] === true) {
          checkStatusId.push(ScheduleReportDateType[status as unknown as ScheduleReportDateType]);
        }
      });
    }

    setCheckedFilterOption({ checkPlatform, checkStatus: checkStatusId });

    if (!disableApplyBtn) {
      const reportData = await getReportsListService(
        {
          workspaceId: workspaceId!,
          params: {
            page,
            limit,
            search: searchText,
            ...(checkPlatform.length ? { platformId: checkPlatform } : {}),
            ...(checkStatusId.length ? { reportStatus: checkStatusId } : {}),
            ...(date.startDate ? { startDate: date.startDate && convertStartDate(date.startDate) } : {}),
            ...(date.endDate ? { endDate: date.endDate && convertEndDate(date.endDate) } : {})
          }
        },
        setLoading
      );
      setActivateFilter({ isActiveBetween: false, isStatusActive: false, isPlatformActive: false });
      setReportsList({
        data: reportData?.data as Array<ReportListServiceResponsePropsData>,
        totalPages: reportData?.totalPages as string,
        nextPage: reportData?.nextPage as string,
        previousPage: reportData?.previousPage as string
      });
    }
  };

  const loaderSetAction = (type: string, loader: boolean) => {
    if (type === 'RemoveReportLoader') {
      setLoading(loader);
    }

    if (type === 'ScheduleReportLoader') {
      setLoading(loader);
    }
  };

  // Function to remove the report from the list
  const handleRemoveReport = () => {
    removeReportService(
      {
        workspaceId: workspaceId as string,
        reportId: selectId.id as string
      },
      loaderSetAction
    ).then((data) => {
      if (data) {
        getReportsList(
          {
            search: searchText,
            page,
            limit
          },
          false
        );
        showSuccessToast('Report removed successfully');
        setModalOpen((prevState) => ({ ...prevState, removeModalOpen: false }));
      }
    });
  };

  // Function to switch off report schedule from the list
  const handleScheduleReport = () => {
    scheduleReportService(
      {
        workspaceId: workspaceId as string,
        reportId: selectId.id as string,
        body: {
          schedule: selectId.scheduleActive ? false : true
        }
      },
      loaderSetAction
    ).then((data) => {
      if (data) {
        getReportsList(
          {
            search: searchText,
            page,
            limit
          },
          false
        );
        showSuccessToast('Report is scheduled off');
        setModalOpen((prevState) => ({ ...prevState, scheduleOffModalOpen: false }));
      }
    });
  };

  //On Submit functionality
  const handleOnSubmit = () => {
    if (modalOpen.removeModalOpen) {
      handleRemoveReport();
    }
    if (modalOpen.scheduleOffModalOpen) {
      handleScheduleReport();
    }

    if (modalOpen.generateReportModalOpen) {
      generateInstantReport(selectId.id);
    }
  };

  const RenderedOption = (schedule: number, isScheduled: boolean) => {
    if (isScheduled && schedule !== ScheduleReportDateType['NoSchedule']) {
      return ['Edit', 'Generate', 'Remove', 'Schedule Off'];
    }

    if (schedule === ScheduleReportDateType['NoSchedule']) {
      return ['Edit', 'Remove'];
    }
    return ['Edit', 'Generate', 'Remove', 'Schedule On'];
  };

  const navigateToCreateReport = () => {
    navigate(`/${workspaceId}/reports/create-report`);
  };

  const renderReportList = () => {
    if (!loading && Number(reportsList?.data?.length) === 0) {
      return (
        <div className="flex flex-col items-center justify-center w-full fixTableHead-nomember">
          <div>
            <img src={noReportIcon} alt="No Report" />
          </div>
          <div className="pt-5 font-Poppins font-medium text-tableDuration text-lg leading-10">No Report</div>
        </div>
      );
    }
    return (
      <div className="relative">
        <div className="py-2 overflow-x-auto mt-1.868">
          <div className="inline-block min-w-full overflow-hidden dark:border-[#dbd8fc1a] align-middle w-61.68 rounded-0.6 border-table no-scroll-bar overflow-x-auto overflow-y-auto h-screen sticky top-0 fixReportTableHead min-h-[31.25rem]">
            <table className="min-w-full relative  rounded-t-0.6 ">
              <thead className="h-3.25  top-0 w-61.68 no-scroll-bar sticky z-40">
                <tr className="min-w-full">
                  <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black dark:text-white  bg-white dark:bg-thirdDark border-b dark:border-[#dbd8fc1a]  bg-tableHeaderGray ">
                    Report Name
                  </th>
                  <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black dark:text-white  bg-white dark:bg-thirdDark border-b dark:border-[#dbd8fc1a]  bg-tableHeaderGray">
                    Date
                  </th>
                  <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black dark:text-white  bg-white dark:bg-thirdDark border-b dark:border-[#dbd8fc1a]  bg-tableHeaderGray">
                    Platforms
                  </th>
                  <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black dark:text-white  bg-white dark:bg-thirdDark border-b dark:border-[#dbd8fc1a]  bg-tableHeaderGray">
                    Report Status
                  </th>
                  <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black dark:text-white  bg-white dark:bg-thirdDark border-b dark:border-[#dbd8fc1a]  bg-tableHeaderGray w-6.25">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportsList?.data?.map((data: ReportListServiceResponsePropsData, i) => (
                  <tr className="border-b dark:border-[#dbd8fc1a] bg-white" key={i}>
                    <td className="px-6 py-3 dark:bg-secondaryDark dark:text-white">
                      <div className="flex ">
                        <div className="py-3 font-Poppins font-medium text-trial  leading-1.31 cursor-pointer capitalize">
                          {loading ? (
                            <Skeleton width={width_90} />
                          ) : (
                            <NavLink to={`/${workspaceId}/reports/${data.id}/report-history`}>{data.name}</NavLink>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 dark:bg-secondaryDark dark:text-white">
                      <div className="flex ">
                        <div className="py-3 font-Poppins font-medium text-trial  leading-1.31">
                          {loading ? <Skeleton width={width_90} /> : generateDateAndTime(`${data?.createdAt}`, 'MM-DD-YYYY')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 dark:bg-secondaryDark dark:text-white">
                      {loading ? (
                        <div className="flex gap-x-1">
                          <div className="py-3 font-Poppins font-medium text-trial  leading-1.31 w-1.375">
                            <Skeleton circle width={'100%'} height={'100%'} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-x-1">
                          {data?.workspaceReportSettings?.map((report) =>
                            report.reportPlatforms.map((platform) => (
                              <div className="py-3 font-Poppins font-medium text-trial  leading-1.31 w-1.375" key={platform.workspacePlatformId}>
                                <img src={platform.workspacePlatform.platformSettings.platforms.platformLogoUrl} alt="" />
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 dark:bg-secondaryDark dark:text-white">
                      {loading ? (
                        <Skeleton width={width_90} />
                      ) : (
                        <div className="flex">
                          {data?.workspaceReportSettings?.map((report) => (
                            <div className="py-3 font-Poppins font-medium text-trial leading-1.31" key={report.id}>
                              {ScheduleReportDateType[data?.workspaceReportSettings[0]?.scheduleRepeat] === 'NoSchedule'
                                ? 'No Schedule'
                                : ScheduleReportDateType[data?.workspaceReportSettings[0]?.scheduleRepeat]}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 dark:bg-secondaryDark dark:text-white">
                      <div className="flex cursor-pointer relative" ref={kebabMenuRef}>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isDropdownActive) {
                              handleDropDownActive('');
                            } else {
                              handleDropDownActive(data.id);
                            }
                          }}
                          className="flex items-center justify-center action  h-[40px] w-[46px] box-border bg-white dark:bg-secondaryDark dark:border-[#dbd8fc1a] shadow-deleteButton rounded"
                        >
                          <img src={actionDotIcon} alt="" className="relative" />
                        </div>
                        {isDropdownActive === data.id && (
                          <div className="absolute top-6 app-result-card-border bg-white dark:bg-secondaryDark -m-[3px] rounded-[6px] box-border w-9.62  right-[0.5rem] shadow-shadowInput z-40">
                            {RenderedOption(data.workspaceReportSettings[0].scheduleRepeat, data.workspaceReportSettings[0].isScheduleActive)?.map(
                              (options, i) => (
                                <div className="flex flex-col" onClick={() => handleDropDownActive('')} key={i}>
                                  <div
                                    className="h-3.06 p-2 flex items-center border border-transparent text-searchBlack dark:text-white font-Poppins font-normal text-trial leading-1.31 hover:font-medium hover:bg-signUpDomain hover:app-result-card-border dark:hover:bg-thirdDark transition ease-in duration-300 "
                                    onClick={() => handleAction(options, data.id, data, data.workspaceReportSettings[0].isScheduleActive)}
                                  >
                                    {options}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="px-6 py-3  dark:text-white">
                  <td className="px-6 py-3 "></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="px-6 py-6 flex items-center justify-center gap-0.66 w-full rounded-b-lg bg-white dark:bg-thirdDark bottom-0">
          <Pagination currentPage={page} totalPages={Number(reportsList?.totalPages)} limit={limit} onPageChange={(page) => setPage(Number(page))} />
        </div>
      </div>
    );
  };

  return (
    <div className="mt-2.62 w-full">
      <Fragment>
        <div className="flex flex-col">
          <div className="flex items-center ">
            <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 w-full dark:text-white">Reports</h3>
            <div>
              <Input
                type="text"
                name="search"
                id="searchId"
                className="app-input-card-border focus:outline-none px-4 mr-0.76 box-border h-3.06 w-19.06 dark:bg-secondaryDark text-dropGray bg-white  dark:text-inputText dark:placeholder:text-inputText shadow-shadowInput rounded-0.6 placeholder:text-[#7C8DB5] placeholder:text-card placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.12 font-Poppins"
                placeholder="Search By Report Name"
                onChange={handleSearchTextChange}
              />
            </div>
            <div className="relative mr-5" ref={dropDownRef}>
              <div
                className="flex justify-between items-center px-1.08 app-input-card-border rounded-0.6 box-border w-9.59 h-3.06 cursor-pointer bg-white dark:bg-secondaryDark  shadow-shadowInput"
                onClick={handleFilterDropdown}
              >
                <div className="font-Poppins font-semibold text-xs text-dropGray leading-1.12  dark:text-inputText">Filters</div>
                <div className="drop-icon">
                  <img src={filterDownIcon} alt="" className={isFilterDropdownActive ? 'rotate-180' : 'rotate-0'} />
                </div>
              </div>
              {isFilterDropdownActive && (
                <div className="absolute app-result-card-border box-border bg-white dark:bg-secondaryDark  rounded-0.3 w-16.56 shadow-shadowInput z-40 pb-1.56 ">
                  <div className="flex flex-col">
                    <div
                      className="flex justify-between items-center app-result-card-border w-full box-border bg-signUpDomain h-3.06 px-3 mx-auto  cursor-pointer"
                      onClick={() => {
                        handleFilterDropDownStatus('platform');
                      }}
                    >
                      <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Choose platform</div>
                      <div className="drop-icon">
                        <img src={downArrow} alt="" className={activateFilter.isPlatformActive ? 'rotate-0' : 'rotate-180'} />
                      </div>
                    </div>
                    {activateFilter.isPlatformActive && (
                      <div className="flex flex-col justify-center px-3 mb-3 ">
                        {/* <div
                        className={`flex items-center gap-2 hover:bg-signUpDomain  transition ease-in duration-100 p-3  ${reportUpdateValuesData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                      >
                        <div>
                          <input
                            type="checkbox"
                            className={`checkbox ${reportUpdateValuesData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            id="all"
                            name="all"
                            onChange={(event) => handlePlatformAllCheckBox(event)}
                            checked={checkedAllPlatform}
                            disabled={reportUpdateValuesData ? true : false}
                          />
                        </div>
                        <label
                          className={`font-Poppins font-normal text-searchBlack leading-1.31 text-trial  ${reportUpdateValuesData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                          htmlFor="all"
                        >
                          All
                        </label>
                      </div> */}
                        {PlatformFilterResponse &&
                          PlatformFilterResponse.map(
                            (platform: PlatformResponse, index: number) =>
                              platform?.isConnected && (
                                <div className="flex items-center  pt-[18px]" key={index}>
                                  <div className="mr-2">
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                      id={platform.id as string}
                                      name={platform.id as string}
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
                              )
                          )}
                      </div>
                    )}

                    <div
                      className="flex justify-between items-center app-result-card-border w-full box-border bg-signUpDomain h-3.06  px-3 mx-auto cursor-pointer"
                      onClick={() => {
                        handleFilterDropDownStatus('activeBetween');
                      }}
                    >
                      <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold ">Created between</div>
                      <div>
                        <img src={downArrow} alt="" className={activateFilter.isStatusActive ? 'rotate-0' : 'rotate-180'} />
                      </div>
                    </div>
                    {activateFilter.isActiveBetween && (
                      <>
                        <div className="flex flex-col px-3 pt-4">
                          <label htmlFor="Start Date p-1 font-Inter font-normal leading-4 text-trial text-searchBlack">Start Date</label>
                          <div className="relative flex items-center">
                            <DatePicker
                              selected={date.startDate}
                              maxDate={date.endDate}
                              onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'start')}
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
                              selected={date.endDate}
                              minDate={date.startDate}
                              selectsEnd
                              startDate={date.startDate}
                              endDate={date.endDate}
                              onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'end')}
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
                      className="flex justify-between items-center app-result-card-border w-full box-border bg-signUpDomain h-3.06  px-3 mx-auto cursor-pointer"
                      onClick={() => {
                        handleFilterDropDownStatus('status');
                      }}
                    >
                      <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold ">Choose Status</div>
                      <div>
                        <img src={downArrow} alt="" className={activateFilter.isStatusActive ? 'rotate-0' : 'rotate-180'} />
                      </div>
                    </div>
                    {activateFilter.isStatusActive && (
                      <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125">
                        {ReportOptions.map((options) => (
                          <div className="flex items-center" key={options.id}>
                            <div className="mr-2">
                              <input
                                type="checkbox"
                                className="checkbox"
                                id={options.name}
                                name={options.name}
                                checked={(checkedStatus[options.name] as boolean) || false}
                                onChange={handleStatusCheckBox}
                              />
                            </div>
                            <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                              {options.name === 'NoSchedule' ? 'No Schedule' : options.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="buttons px-3 flex mt-1.56">
                      <Button
                        disabled={loading ? true : false}
                        type="button"
                        onClick={() => {
                          setCheckedFilterOption({ checkPlatform: [], checkStatus: [] });
                          setCheckedPlatform({});
                          setDate({ startDate: null, endDate: null });
                          setCheckedStatusOption({});
                          getReportsList(
                            {
                              search: searchText,
                              page,
                              limit
                            },
                            true
                          );
                        }}
                        text="Reset"
                        className="border border-backdropColor text-black rounded-0.31 h-2.063 w-1/2 mr-1 cursor-pointer text-card font-Manrope font-semibold leading-1.31 hover:text-white hover:bg-backdropColor"
                      />
                      <Button
                        disabled={loading ? true : false}
                        onClick={submitFilterChange}
                        type="button"
                        text="Apply"
                        className={`border-none btn-save-modal rounded-0.31 h-2.063 w-1/2 ml-1 cursor-pointer text-card font-Manrope font-semibold leading-1.31 text-white ${loading ? 'cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="">
              <Button
                type="button"
                text="Create Report"
                className="btn-save-modal border-none text-white w-8.37 font-Poppins font-medium shadow-contactBtn rounded leading-1.12 h-3.06 text-error cursor-pointer transition ease-in duration-300 hover:shadow-buttonShadowHover"
                onClick={navigateToCreateReport}
              />
            </div>
          </div>
          {renderReportList()}
        </div>
        <ModalDrawer
          isOpen={modalOpen.removeModalOpen || modalOpen.scheduleOffModalOpen || modalOpen.generateReportModalOpen}
          isClose={handleModalClose}
          loader={loading}
          onSubmit={handleOnSubmit}
          iconSrc={deleteIcon}
          contextText={
            modalOpen.removeModalOpen
              ? 'Are you sure you want to permanently delete the report with the history?'
              : modalOpen.scheduleOffModalOpen && !selectId.scheduleActive
                ? 'Are you sure you want to turn on the scheduling for the report?'
                : modalOpen.scheduleOffModalOpen && selectId.scheduleActive
                  ? 'Are you sure you want to turn off the scheduling for the report?'
                  : modalOpen.generateReportModalOpen
                    ? 'Are you sure you want to generate the report?'
                    : ''
          }
        />
      </Fragment>
    </div>
  );
};

export default Report;
