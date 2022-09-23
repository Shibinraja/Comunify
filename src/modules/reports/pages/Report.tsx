import React, { useEffect, useRef, useState } from 'react';
import Input from 'common/input';
import downArrow from '../../../assets/images/filter-dropdown.svg';
import filterDownIcon from '../../../assets/images/report-dropdown.svg';
import searchIcon from '../../../assets/images/search.svg';
import actionDotIcon from '../../../assets/images/action-dot.svg';
import './Report.css';
import { reportData } from './ReportTableData';
import Button from 'common/button';
import { useNavigate } from 'react-router';
import nextIcon from '../../../assets/images/next-page-icon.svg';
import prevIcon from '../../../assets/images/previous-page-icon.svg';
import { getLocalWorkspaceId } from '@/lib/helper';

const Report: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownActive, setIsDropdownActive] = useState<number>(0);
  const [isFilterDropdownActive, setIsFilterDropdownActive] = useState<boolean>(false);
  const [isPlatformActive, setPlatformActive] = useState<boolean>(true);
  const [isStatusActive, setStatusActive] = useState<boolean>(false);

  const options = ['Edit', 'Generate', 'Remove', 'Schedule Off'];
  const workSpaceId = getLocalWorkspaceId() !== null && getLocalWorkspaceId();

  const handleDropDownActive = (value: number): void => {
    setIsDropdownActive(value);
  };

  const handleFilterDropdown = (val: boolean): void => {
    setIsFilterDropdownActive(val);
  };

  const navigateToCreateReport = () => {
    navigate(`/${workSpaceId}/reports/create-report`);
  };

  const handlePlatformActive = (val: boolean) => {
    setPlatformActive(val);
  };

  const handleStatusActive = (val: boolean) => {
    setStatusActive(val);
  };

  const dropDownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="mt-2.62 w-full">
      <div className="flex flex-col">
        <div className="flex items-center ">
          <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 w-full dark:text-white">Reports</h3>
          <div>
            <Input
              type="text"
              name="search"
              id="searchId"
              className="app-input-card-border focus:outline-none px-4 mr-0.76 box-border h-3.06 w-19.06 dark:bg-secondaryDark text-dropGray bg-white  dark:text-inputText dark:placeholder:text-inputText shadow-shadowInput rounded-0.6 placeholder:text-dropGray placeholder:text-card placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.12 font-Poppins"
              placeholder="Search By Name or Email"
            />
          </div>
          <div className="relative mr-5" ref={dropDownRef}>
            <div
              className="flex justify-between items-center px-1.08 app-input-card-border rounded-0.6 box-border w-9.59 h-3.06 cursor-pointer bg-white dark:bg-secondaryDark  shadow-shadowInput"
              onClick={() => handleFilterDropdown(isFilterDropdownActive ? false : true)}
            >
              <div className="font-Poppins font-normal text-card text-dropGray leading-1.12  dark:text-inputText">Filters</div>
              <div className="drop-icon">
                <img src={filterDownIcon} alt="" className={isFilterDropdownActive ? 'rotate-180' : 'rotate-0'} />
              </div>
            </div>
            {isFilterDropdownActive && (
              <div className="absolute app-result-card-border box-border bg-white dark:bg-secondaryDark  rounded-0.3 w-16.56 shadow-shadowInput z-40 pb-1.56 ">
                <div className="flex flex-col mt-1.43">
                  <div className="flex relative items-center mx-auto">
                    <Input
                      type="text"
                      name="reportName"
                      id="report"
                      className="mx-auto focus:outline-none px-3 box-border dark:bg-secondaryDark bg-white shadow-shadowInput rounded-0.6 app-input-card-border h-2.81 w-15.06 dark:text-inputText dark:palceholder:text-inputText placeholder:text-searchGray placeholder:font-Poppins placeholder:font-normal dark:palceholder:text-inputText placeholder:text-card placeholder:leading-1.12"
                      placeholder="Report Name"
                    />
                    <div className="absolute right-5 top-4 w-0.78 h-3 z-40 drop-icon">
                      <img src={searchIcon} alt="" />
                    </div>
                  </div>
                  <div
                    className="flex justify-between items-center app-result-card-border w-full box-border bg-signUpDomain h-3.06 mt-5 px-3 mx-auto  cursor-pointer"
                    onClick={() => {
                      handlePlatformActive(isPlatformActive ? false : true);
                      handleStatusActive(false);
                    }}
                  >
                    <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Choose platform</div>
                    <div className="drop-icon">
                      <img src={downArrow} alt="" className={isPlatformActive ? 'rotate-0' : 'rotate-180'} />
                    </div>
                  </div>
                  {isPlatformActive && (
                    <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125 ">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <input type="checkbox" className="checkbox" />
                        </div>
                        <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial dark:text-white ">All</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2">
                          <input type="checkbox" className="checkbox" />
                        </div>
                        <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial dark:text-white">Salesforce</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2">
                          <input type="checkbox" className="checkbox" />
                        </div>
                        <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial dark:text-white">Khoros</div>
                      </div>
                    </div>
                  )}

                  <div
                    className="flex justify-between items-center app-result-card-border w-full box-border bg-signUpDomain h-3.06  px-3 mx-auto cursor-pointer"
                    onClick={() => {
                      handleStatusActive(isStatusActive ? false : true);
                      handlePlatformActive(false);
                    }}
                  >
                    <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold ">Choose Status</div>
                    <div>
                      <img src={downArrow} alt="" className={isStatusActive ? 'rotate-0' : 'rotate-180'} />
                    </div>
                  </div>
                  {isStatusActive && (
                    <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <input type="checkbox" className="checkbox" />
                        </div>
                        <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">Daily</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2">
                          <input type="checkbox" className="checkbox" />
                        </div>
                        <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">Weekly</div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2">
                          <input type="checkbox" className="checkbox" />
                        </div>
                        <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">Monthly</div>
                      </div>
                    </div>
                  )}

                  <div className="buttons px-3 ">
                    <Button
                      type="button"
                      text="Apply"
                      className="border-none btn-save-modal rounded-0.31 h-2.063 w-full mt-1.56 cursor-pointer text-card font-Manrope font-semibold leading-1.31 text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="">
            <Button
              type="button"
              text="create report"
              className="btn-save-modal border-none text-white w-8.37 font-Poppins font-medium shadow-contactBtn rounded leading-1.12 h-3.06 text-error cursor-pointer transition ease-in duration-300 hover:shadow-buttonShadowHover"
              onClick={navigateToCreateReport}
            />
          </div>
        </div>
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
                  {reportData.map((data, i) => (
                    <tr className="border-b dark:border-[#dbd8fc1a]" key={i}>
                      <td className="px-6 py-3 dark:bg-secondaryDark dark:text-white">
                        <div className="flex ">
                          <div className="py-3 font-Poppins font-medium text-trial  leading-1.31 cursor-pointer">{data.reportName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 dark:bg-secondaryDark dark:text-white">
                        <div className="flex ">
                          <div className="py-3 font-Poppins font-medium text-trial  leading-1.31 cursor-pointer">{data.date}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 dark:bg-secondaryDark dark:text-white">
                        <div className="flex gap-x-1">
                          <div className="py-3 font-Poppins font-medium text-trial  leading-1.31 cursor-pointer w-1.375">
                            <img src={data.platform.img1} alt="" />
                          </div>
                          <div className="py-3 font-Poppins font-medium text-trial  leading-1.31 cursor-pointer w-1.375">
                            <img src={data.platform.img2} alt="" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 dark:bg-secondaryDark dark:text-white">
                        <div className="flex ">
                          <div className="py-3 font-Poppins font-medium text-trial leading-1.31 cursor-pointer">{data.reportStatus}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 dark:bg-secondaryDark dark:text-white">
                        <div className="flex   cursor-pointer relative">
                          <div
                            onClick={() => handleDropDownActive(data.id)}
                            className="flex items-center justify-center action  h-3.12 box-border bg-white dark:bg-secondaryDark rounded-sm dark:border-[#dbd8fc1a] shadow-deleteButton w-3.12 "
                          >
                            <img src={actionDotIcon} alt="" className="relative" />
                          </div>
                          {isDropdownActive === data.id && (
                            <div className="absolute top-6 app-result-card-border bg-white dark:bg-secondaryDark rounded-0.6 box-border w-9.62  right-[0.5rem] shadow-shadowInput z-40">
                              {options.map((options, i) => (
                                <div className="flex flex-col" onClick={() => handleDropDownActive(0)} key={i}>
                                  <div className="h-3.06 p-2 flex items-center text-searchBlack dark:text-white font-Poppins font-normal text-trial leading-1.31 hover:font-medium hover:bg-signUpDomain dark:hover:bg-thirdDark transition ease-in duration-300 rounded-md">
                                    {options}
                                  </div>
                                </div>
                              ))}
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
            <div className="pagination w-1.51 h-1.51 box-border rounded flex items-center justify-center cursor-pointer">
              <img src={prevIcon} alt="" />
            </div>
            <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">1</div>
            <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">2</div>
            <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">3</div>
            <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">4</div>
            <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">...</div>
            <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">10</div>
            <div className="pagination w-1.51 h-1.51 box-border rounded flex items-center justify-center cursor-pointer">
              <img src={nextIcon} alt="" />
            </div>
            <div className="font-Lato font-normal text-pageNumber leading-4 text-pagination cursor-pointer">Go to page:</div>
            <div>
              <Input name="pagination" id="page" type="text" className="page-input focus:outline-none px-0.5 rounded box-border w-1.47 h-1.51" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
