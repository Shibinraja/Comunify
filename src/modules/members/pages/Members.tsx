import MembersCard from 'common/membersCard/membersCard';
import Modal from 'react-modal';
import  './Members.css';
import editIcon from '../../../assets/images/edit.svg';
import dragIcon from '../../../assets/images/drag.svg';
import { FC, useState } from 'react';
import Button from 'common/button';
import searchIcon from '../../../assets/images/search.svg';
import calandarIcon from '../../../assets/images/calandar.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import exportImage from '../../../assets/images/export.svg';
import downArrow from '../../../assets/images/sub-down-arrow.svg';
import dropdownIcon from '../../../assets/images/Vector.svg';
import closeIcon from '../../../assets/images/tag-close.svg';
import nextIcon from '../../../assets/images/next-page-icon.svg';
import prevIcon from '../../../assets/images/previous-page-icon.svg';
import {useNavigate} from 'react-router-dom';
import Input from 'common/input';
import { dummyDragData, membersTableData } from './MembersTableData';

Modal.setAppElement('#root');

const Members:FC = () => {

  const navigate = useNavigate();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [toDate, setToDate] = useState<Date>();
  const [isFilterDropdownActive, setisFilterDropdownActive] = useState<boolean>(false);

  const handleFilterDropdown = (): void => {
    setisFilterDropdownActive((prev) => !prev);
  };

  const handleModalClose=()=>{
    setisModalOpen(false);
  }

  const navigateToProfile=()=>{
    navigate('/members/profile');
  }

  return (
  <div className="container flex flex-col">
     <h3 className="font-Poppins font-semibold text-infoBlack text-infoData leading-9">
        Members
      </h3>
      <div className="flex mt-1.8 items-center ">
        <div className="flex relative items-center ">
          <input
            type="text"
            className="focus:outline-none px-3 box-border w-19.06 h-3.06  rounded-0.6 shadow-profileCard placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.31 placeholder:text-searchGray"
            placeholder="Search By Name or Email"
          />
          <div className="absolute right-5 w-0.78 h-0.75 ">
            <img src={searchIcon} alt="" />
          </div>
        </div>
        <div className="day w-3.003 h-3.06 flex items-center justify-center ml-3.19 box-border rounded-0.6 app-input-card-border shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12">
          1D
        </div>
        <div className="day w-3.003 h-3.06 flex items-center justify-center ml-0.653 box-border rounded-0.6 app-input-card-border shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12">
          7D
        </div>
        <div className="day w-3.003 h-3.06 flex items-center justify-center ml-0.653 box-border rounded-0.6 app-input-card-border shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12">
          1M
        </div>
        <div>
          <div className="relative flex items-center ml-0.653 ">
            <DatePicker
              selected={toDate}
              onChange={(date: any) => setToDate(date)}
              className="export w-9.92 h-3.06    shadow-contactCard rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
              placeholderText="Custom Date"
            />
            <img
              className="absolute icon-holder left-32 cursor-pointer"
              src={calandarIcon}
              alt=""
            />
          </div>
        </div>
        <div className="ml-1.30">
          <div className="box-border cursor-pointer rounded-0.6 shadow-contactCard app-input-card-border relative ">
            <div
              className="flex w-9.59 h-3.06  items-center justify-between px-5 "
              onClick={handleFilterDropdown}
            >
              <div className="box-border rounded-0.6 shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12">
                Filters
              </div>
              <div>
                <img src={dropdownIcon} alt="" />
              </div>
            </div>
            {isFilterDropdownActive && (
              <div
                className="absolute w-16.56 pb-0 bg-white border z-40 rounded-0.3"
                onClick={handleFilterDropdown}
              >
                <div className="flex flex-col pb-5">
                  <div className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06 mt-5 px-3 mx-auto  cursor-pointer">
                    <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">
                      Platform
                    </div>
                    <div>
                      <img src={downArrow} alt="" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Slack
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Higher Logic
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Vanilla Forums
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06 mt-5 px-3 mx-auto  cursor-pointer">
                    <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">
                      Tags
                    </div>
                    <div>
                      <img src={downArrow} alt="" />
                    </div>
                  </div>
                  <div className="flex relative items-center mt-5">
                    <input
                      type="text"
                      className="inputs mx-auto focus:outline-none px-3 box-border bg-white shadow-profileCard rounded-0.6 h-2.81 w-15.06 placeholder:text-searchGray placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.12"
                      placeholder="Search Tags"
                    />
                    <div className="absolute right-5 w-0.78 h-0.75  z-40">
                      <img src={searchIcon} alt="" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Admin
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Influencer
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Influencer
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06 mt-5 px-3 mx-auto  cursor-pointer">
                    <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">
                      Location
                    </div>
                    <div>
                      <img src={downArrow} alt="" />
                    </div>
                  </div>
                  <div className="flex relative items-center mt-5">
                    <input
                      type="text"
                      className="inputs mx-auto focus:outline-none px-3 box-border bg-white shadow-profileCard rounded-0.6 h-2.81 w-15.06 placeholder:text-searchGray placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.12"
                      placeholder="Report Name"
                    />
                    <div className="absolute right-5 w-0.78 h-0.75  z-40">
                      <img src={searchIcon} alt="" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Texas
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        London
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Texas
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06 mt-5 px-3 mx-auto  cursor-pointer">
                    <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">
                      Organization
                    </div>
                    <div>
                      <img src={downArrow} alt="" />
                    </div>
                  </div>
                  <div className="flex relative items-center mt-5">
                    <input
                      type="text"
                      className="inputs mx-auto focus:outline-none px-3 box-border bg-white shadow-profileCard rounded-0.6 h-2.81 w-15.06 placeholder:text-searchGray placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.12"
                      placeholder="Report Name"
                    />
                    <div className="absolute right-5 w-0.78 h-0.75  z-40">
                      <img src={searchIcon} alt="" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Microsoft
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Hp
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <input type="checkbox" />
                      </div>
                      <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">
                        Lenovo
                      </div>
                    </div>
                    <div className="buttons ">
                      <Button
                        type="button"
                        text="Apply"
                        className="border-none btn-save-modal rounded-0.31 h-2.063 w-full mt-1.56 cursor-pointer text-card font-Manrope font-semibold leading-1.31 text-white transition ease-in duration-300 hover:shadow-buttonShadowHover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="ml-0.652">
          <div className="export w-6.98 rounded-0.6 shadow-contactCard box-border bg-white items-center app-input-card-border h-3.06 justify-evenly flex ml-0.63 cursor-pointer">
            <h3 className="text-memberDay leading-1.12 font-Poppins font-semibold text-card">
              Export
            </h3>
            <img src={exportImage} alt="" />
          </div>
        </div>
      </div>
      <div className="member-card pt-10">
        <MembersCard/>
      </div>
    <div className="memberTable mt-1.8">
      <div className="py-2 overflow-x-auto mt-1.868">
        <div className="inline-block min-w-full overflow-hidden align-middle w-61.68 rounded-t-0.6 border-table no-scroll-bar overflow-x-auto overflow-y-auto h-screen sticky top-0 fixTableHead max-h-34">
          <table className="min-w-full relative  rounded-t-0.6 ">
            <thead className="h-3.25  top-0 w-61.68 no-scroll-bar sticky ">
              <tr className="min-w-full">
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray ">
                  Name
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Platforms Connected
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Tags
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Last Activity
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Organization
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Location
                </th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {membersTableData.map((data, i) => (
                <tr className="border-b" key={i}>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer" onClick={navigateToProfile}>
                        {data.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-x-2">
                      <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        <img src={data.platform.img1} alt="" />
                      </div>
                      <div className="font-Poppins  font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        <img src={data.platform.img1} alt="" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 flex gap-2 items-center font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        <div className="bg-tagSection rounded w-5.25 h-8 flex justify-between px-3 items-center">
                          <div className="font-Poppins font-normal text-card text-profileBlack leading-5">Tag1</div>
                          <div>
                            <img src={closeIcon} alt="" />
                          </div>
                        </div>
                        <div className="bg-tagSection rounded w-5.25 h-8 flex justify-between px-3 items-center">
                          <div className="font-Poppins font-normal text-card text-profileBlack leading-5">Tag2</div>
                          <div>
                            <img src={closeIcon} alt="" />
                          </div>
                        </div>
                        <div className="font-Poppins font-semibold leading-5 text-tag text-card underline">
                          2 More
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        {data.lastActivity}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        {data.organization}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        {data.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex ">
                      <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                        {data.email}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                <div className="px-6 py-6 flex items-center gap-0.66 justify-center w-full rounded-b-lg ">
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
                    <Input name="pagination" id="page" type="text" className="page-input focus:outline-none px-0.5 rounded box-border w-1.47 h-1.51"/>
                  </div>
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
              <h3 className="font-Inter font-semibold text-xl mt-1.8  leading-6">
                Customize Column
              </h3>
                  <div  className="pb-10">
                      {dummyDragData.map((item: any, index: number) => (
                            <div>
                              <div className="flex flex-col mt-6">
                                <div className="flex justify-between items-center px-2 cursor-pointer rounded-0.3 h-2.81 bg-white box-border border-table shadow-inputShadow">
                                  <div className="flex items-center gap-1">
                                    <div>
                                      <input type="checkbox" name="" id="" />
                                    </div>
                                    <div className="font-Poppins font-normal text-infoBlack text-trial leading-1.31">
                                      {item.name}
                                    </div>
                                  </div>
                                  <div>
                                    <img src={dragIcon} alt="" />
                                  </div>
                                </div>
                              </div>
                            </div>
                      ))}            
                    </div>
              <div className="felx buttons absolute -bottom-16 right-[27px]">
                   <Button
                      text="CANCEL"
                      type="submit"
                      className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-5.25  rounded border-none"
                      onClick={handleModalClose}
                   />
                    <Button
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
