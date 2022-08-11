import React, { useEffect, useRef, useState } from 'react';
import Input from 'common/input';
import nextIcon from '../../../assets/images/next-page-icon.svg';
import prevIcon from '../../../assets/images/previous-page-icon.svg';
import slackIcon from '../../../assets/images/slack.svg';
import profileImage from '../../../assets/images/ellip.svg';
import closeIcon from '../../../assets/images/close.svg';
import downArrow from '../../../assets/images/filter-dropdown.svg';
import searchIcon from '../../../assets/images/search.svg';
import filterDownIcon from '../../../assets/images/report-dropdown.svg';
import exportImage from '../../../assets/images/export.svg';
import noActivityIcon from '../../../assets/images/no-reports.svg';

import { activityData } from './ActivityTableData';
import Modal from 'react-modal';
import Button from 'common/button';
import './Activity.css';

Modal.setAppElement('#root');

const Activity: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isTagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [isFilterDropdownActive, setisFilterDropdownActive] = useState<boolean>(false);

  const [isPlatformActive, setPlatformActive] = useState<boolean>(true);
  const [isStatusActive, setStatusActive] = useState<boolean>(false);

  const dropDownRef = useRef<HTMLDivElement>(null);

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

  const handleFilterDropdown = (val: boolean): void => {
    setisFilterDropdownActive(val);
  };

  const handleModal = (val: boolean) => {
    setModalOpen(val);
  };
  const handleTagModal = (val: boolean) => {
    setTagModalOpen(val);
  };

  const handlePlatformActive = (val: boolean) => {
    setPlatformActive(val);
  };

  const handleStatusActive = (val: boolean) => {
    setStatusActive(val);
  };

  return (
    <div className="  flex flex-col   mt-1.8">
      <div className="flex items-center">
        <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 w-full">Activities</h3>
        <div>
          <Input
            type="text"
            name="search"
            id="searchId"
            className="app-input-card-border focus:outline-none px-4 mr-0.76 box-border h-3.06 w-19.06 bg-white  rounded-0.6 placeholder:text-reportSearch placeholder:text-card placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.12 font-Poppins"
            placeholder="Search By Name or Email"
          />
        </div>
        <div className="relative mr-5" ref={dropDownRef}>
          <div
            className="flex justify-between items-center px-1.08 app-input-card-border rounded-0.6 box-border w-9.59 h-3.06 cursor-pointer bg-white "
            onClick={() => handleFilterDropdown(isFilterDropdownActive ? false : true)}
          >
            <div className="font-Poppins font-normal text-card text-dropGray leading-1.12">Filters</div>
            <div>
              <img src={filterDownIcon} alt="" className={isFilterDropdownActive ? 'rotate-180' : 'rotate-0'} />
            </div>
          </div>
          {isFilterDropdownActive && (
            <div className="absolute app-result-card-border box-border bg-white rounded-0.3 w-16.56 shadow-shadowInput z-40 pb-1.56 ">
              <div className="flex flex-col mt-1.43">
                <div className="flex relative items-center mx-auto">
                  <Input
                    type="text"
                    name="reportName"
                    id="report"
                    className="mx-auto focus:outline-none px-3 box-border bg-white  rounded-0.6 app-input-card-border h-2.81 w-15.06 placeholder:text-searchGray placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.12"
                    placeholder="Report Name"
                  />
                  <div className="absolute right-5 top-4 w-0.78 h-3 z-40">
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
                  <div>
                    <img src={downArrow} alt="" className={isPlatformActive ? 'rotate-0' : 'rotate-180'} />
                  </div>
                </div>
                {isPlatformActive && (
                  <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" className="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">All</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" className="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">Salesforce</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" className="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">Khoros</div>
                    </div>
                  </div>
                )}

                <div
                  className="flex justify-between items-center app-result-card-border w-full box-border bg-signUpDomain h-3.06 px-3 mx-auto cursor-pointer"
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
          <div className="app-input-card-border w-6.98 h-3.06 rounded-0.6 shadow-shadowInput box-border bg-white items-center justify-evenly flex ml-0.63 cursor-pointer">
            <h3 className="text-dropGray leading-1.12 font-Poppins font-semibld text-card">Export</h3>
            <img src={exportImage} alt="" />
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="py-2 overflow-x-auto mt-1.868">
          <div className="inline-block min-w-full  align-middle w-61.68 rounded-0.6 border-table no-scroll-bar  overflow-y-auto h-screen sticky top-0 fixActivityTableHead min-h-[31.25rem]">
            <table className="min-w-full relative  rounded-t-0.6 ">
              <thead className="h-3.25  top-0 w-61.68 no-scroll-bar sticky ">
                <tr className="min-w-full">
                  <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray ">Members</th>
                  <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">Date & Time</th>
                  <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">Summary</th>
                  <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">Source</th>
                  <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                    Activity Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {activityData.map((data, i) => (
                  <tr className="h-4.06 " key={i}>
                    <td className="px-6 py-3 border-b">
                      <div className="flex ">
                        <div className="py-3 mr-2">
                          <input type="checkbox" className="checkbox" />
                        </div>
                        <div>
                          <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">{data.memberName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 pt-5 border-b">
                      <div className="flex flex-col">
                        <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">{data.dura.date}</div>
                        <div className="font-medium font-Poppins text-card leading-1.31 text-tableDuration">{data.dura.time}</div>
                      </div>
                    </td>
                    <td className="px-6 pt-5 border-b ">
                      <div className="flex ">
                        <div className="mr-2">
                          <img src={data.image} alt="" />
                        </div>
                        <div className="flex flex-col">
                          <div
                            className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer"
                            onClick={() => handleModal(true)}
                          >
                            {data.summary.title}
                          </div>
                          <div className="font-medium font-Poppins text-card leading-1.31 text-tableDuration">{data.summary.date}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3 border-b">
                      <a href="" className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 underline cursor-pointer">
                        {data.source}
                      </a>
                    </td>
                    <td className="px-6 py-3 border-b font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">{data.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Modal
              isOpen={isModalOpen}
              shouldCloseOnOverlayClick={true}
              onRequestClose={() => setModalOpen(false)}
              className="mode w-32.5 mx-auto pb-10 border-none px-2.18 bg-white shadow-modal rounded"
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
              <div className="pt-9 flex flex-col">
                <div className="flex justify-between">
                  <div className="font-Inter font-semibold text-black text-xl leading-6">Activity</div>
                  <div className="font-Poppins text-error leading-5 text-tag font-medium cursor-pointer" onClick={() => handleTagModal(true)}>
                    ADD TAG
                  </div>
                  <Modal
                    isOpen={isTagModalOpen}
                    shouldCloseOnOverlayClick={false}
                    onRequestClose={() => setModalOpen(false)}
                    className="w-24.31 h-18.75 mx-auto  mt-32 rounded-lg modals-tag bg-white shadow-modal"
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
                          className="mt-0.375 inputs box-border bg-white shadow-shadowInput rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-trial placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                          placeholder="Enter Tag Name"
                        />
                        <div className="flex absolute right-1 top-24 pr-6 items-center">
                          <Button
                            type="button"
                            text="CANCEL"
                            className="mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel px-2 py-3 rounded border-none"
                            onClick={() => setTagModalOpen(false)}
                          />
                          <Button
                            type="button"
                            text="SAVE"
                            className="save text-white font-Poppins text-error font-medium leading-5 cursor-pointer rounded shadow-contactBtn px-5 py-3 border-none btn-save-modal"
                          />
                        </div>
                      </form>
                    </div>
                  </Modal>
                </div>
                <div className="mt-8 flex items-center">
                  <div className="bg-cover">
                    <img src={profileImage} alt="" />
                  </div>
                  <div className="flex flex-col pl-0.563">
                    <div className="font-medium text-trial text-infoBlack font-Poppins leading-1.31">Emerson Schleifer</div>
                    <div className="font-Poppins text-email leading-5 text-tagEmail font-normal">dmrity125@mail.com | neoito technologies</div>
                  </div>
                </div>
                <div className="bg-activitySubCard rounded flex flex-col pt-2.5 pl-0.81 pb-8 mt-5">
                  <div className="flex items-center">
                    <div>
                      <img src={slackIcon} alt="" />
                    </div>
                    <div className="pl-0.563 font-Poppins font-medium text-infoBlack text-card leading-1.12">Sent a message in slack</div>
                    <div className="pl-2.5 text-tagChannel font-Poppins font-medium text-card leading-1.12">#channel 1</div>
                  </div>
                  <div className="mt-5 font-Poppins font-medium text-infoBlack text-card leading-1.12">
                    The journey of a thousand miles begins with one step.
                  </div>
                  <div className="mt-1.18 flex relative">
                    <div className="font-Poppins font-medium text-card leading-1.12 text-tag underline cursor-pointer">VIEW ON SLACK</div>
                    <div className="absolute right-3 top-5 font-Poppins font-medium text-card leading-1.12 text-slimGray">12:10pm | May 4</div>
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

      <div className="mt-5 pl-5 hidden">
        <div className="w-12.87 h-4.57 profile-card-header rounded-t-0.6"></div>
        <div className="w-12.87 pb-3 rounded-b-0.6 profile-card-body profile-inner shadow-profileCard flex flex-col items-center bg-white">
          <div className="w-4.43 h-4.43 -mt-10 flex items-center justify-center">
            <img src={profileImage} alt="" />
          </div>
          <div className="font-semibold font-Poppins text-card text-profileBlack leading-1.12">Randy Dias</div>
          <div className="text-profileEmail font-Poppins font-normal text-profileBlack text-center w-6.875 mt-0.146">
            randy125@mail.com neoito technologies pvt ltd
          </div>
          <div className="flex mt-2.5">
            <div className="bg-cover bg-center mr-1 w-0.92 h-0.92">
              <img src={slackIcon} alt="" />
            </div>
            <div className="bg-cover bg-center mr-1 w-0.92 h-0.92">
              <img src={slackIcon} alt="" />
            </div>
            <div className="bg-cover bg-center mr-1 w-0.92 h-0.92">
              <img src={slackIcon} alt="" />
            </div>
          </div>
          <div className="mt-0.84 font-normal font-Poppins text-card underline text-profileBlack leading-5 cursor-pointer">VIEW PROFILE</div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full fixActivityTableHead hidden">
        <div>
          <img src={noActivityIcon} alt="" />
        </div>
        <div className="pt-5 font-Poppins font-medium text-tableDuration text-lg leading-10">No activities to display</div>
      </div>
    </div>
  );
};

export default Activity;
