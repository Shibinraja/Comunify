import QuickInfo from 'common/quickInfo/QuickInfo';
import React, { useEffect, useRef, useState } from 'react';
import ActivitiesTab from '../activitiesTab/pages/ActivitiesTab';
import MembersTab from '../membersTab/pages/MembersTab';
import brickIcon from '../../../assets/images/brick.svg';
import dropDownIcon from '../../../assets/images/profile-dropdown.svg';
import calendarIcon from '../../../assets/images/calandar.svg';
import widgetSearchIcon from '../../../assets/images/widget-search.svg';
import noWidgetIcon from '../../../assets/images/no-widget.svg';
import HealthCard from 'common/healthCard/HealthCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from 'common/input';
import Button from 'common/button';
import Modal from 'react-modal';
Modal.setAppElement('#root');

const Dashboard: React.FC = () => {
  const [isSelectDropDownActive, setSelectDropDownActive] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const [dateRange, setDateRange] = useState([null, null]);
  const datepickerRef = useRef<any>(null);
  const [startDate, endDate] = dateRange;
  const handleDropDownActive = (): void => {
    setSelectDropDownActive((prev) => !prev);
  };
  const selectOptions = ['This Week', 'Last Week', 'Month'];
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isWidgetModalOpen, setWidgetModalOpen] = useState(false);

  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setSelectDropDownActive(false);
    }
  };

  const handleClickDatepickerIcon = () => {
    const datepickerElement = datepickerRef.current;
    datepickerElement.setFocus(true);
  };

  const handleWidgetDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="flex justify-between mt-10 ">
        {isDrawerOpen && (
          <div className="w-1/4 xl:w-1/5 widgetDrawerGradient left-0 top-0 h-full px-7 absolute z-40 opacity-90">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="text-center font-Poppins font-semibold text-2xl pt-24">Add Widget</div>
                <div className="pt-4 relative">
                  <Input
                    type="text"
                    name="search"
                    id="searchId"
                    placeholder="Search widgets"
                    className="py-3 bg-white text-xs focus:outline-none px-4 rounded-0.6 pr-8 placeholder:font-Poppins placeholder:font-normal placeholder:text-widgetSearch placeholder:text-xs"
                  />
                  <div className="absolute top-8 right-5">
                    <img src={widgetSearchIcon} alt="" />
                  </div>
                </div>
              </div>
              {/* <div className="hidden">
                <QuickInfo />
              </div> */}
              {/* <div className="mt-1.8 hidden">
                <HealthCard />
              </div> */}
              {/* <div className="flex mt-1.8 w-full hidden">
                <div>
                  <ActivitiesTab />
                </div>
                <div>
                  <MembersTab />
                </div>
              </div> */}
              <Button
                text="Request for a Widget"
                type="submit"
                className="font-Poppins rounded-lg text-base font-semibold text-white py-3.5 mt-7 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
                onClick={() => setWidgetModalOpen(true)}
              />
              <Modal
                isOpen={isWidgetModalOpen}
                shouldCloseOnOverlayClick={false}
                onRequestClose={() => setWidgetModalOpen(false)}
                className="w-24.31 pb-12 mx-auto rounded-lg border-fetching-card bg-white shadow-modal"
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
                  <h3 className="text-center font-Inter font-semibold text-xl mt-1.8 text-black leading-6">Request for a Widget</h3>
                  <form className="flex flex-col relative  px-1.93 mt-9">
                    <label htmlFor="name " className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack ">
                      Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      id="nameId"
                      className="mt-0.375 inputs app-result-card-border box-border bg-white shadow-inputShadow rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                      placeholder="Enter Name"
                    />
                    <label htmlFor="description" className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack mt-1.06">
                      Description
                    </label>
                    <textarea
                      name=""
                      id=""
                      className="mt-0.375 inputs text-area app-result-card-border rounded-0.3 w-20.5 h-6.06 shadow-inputShadow focus:outline-none p-3 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31"
                      placeholder="Description"
                    ></textarea>
                    <div className="flex items-center justify-end mt-1.8">
                      <Button
                        text="Cancel"
                        type="submit"
                        className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-5.25  rounded border-none"
                        onClick={() => setWidgetModalOpen(false)}
                      />
                      <Button
                        text="Save"
                        type="submit"
                        className="text-white font-Poppins text-error font-medium leading-5 btn-save-modal cursor-pointer rounded shadow-contactBtn w-5.25 border-none h-2.81"
                      />
                    </div>
                  </form>
                </div>
              </Modal>
            </div>
          </div>
        )}
        <div className="flex relative items-center">
          <div
            className="flex items-center justify-between px-5 w-11.72 h-3.06 border border-borderPrimary rounded-0.6 shadow-shadowInput cursor-pointer "
            ref={dropDownRef}
            onClick={handleDropDownActive}
          >
            <div className="font-Poppins font-semibold text-card text-dropGray dark:text-inputText leading-4">{selected ? selected : 'Select'}</div>
            <div className="bg-cover drop-icon">
              <img src={dropDownIcon} alt="" className={isSelectDropDownActive ? 'rotate-180' : 'rotate-0'} />
            </div>
          </div>
          {isSelectDropDownActive && (
            <div
              className="absolute top-12 w-11.72 border border-borderPrimary bg-white dark:bg-secondaryDark   shadow-shadowInput rounded-0.6 "
              onClick={handleDropDownActive}
            >
              {selectOptions.map((options: string, index: number) => (
                <div key={index} className="flex flex-col p-2 hover:bg-greyDark transition ease-in duration-300 cursor-pointer rounded-lg">
                  <div
                    className="text-searchBlack dark:text-white font-Poppins font-normal text-trial leading-1.31"
                    onClick={() => setSelected(options)}
                  >
                    {options}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pl-2.5 relative">
            <div>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update: any) => {
                  setDateRange(update);
                }}
                className="export w-[15.5rem] h-3.06  bg-transparent dark:bg-primaryDark text-dropGray dark:text-inputText shadow-shadowInput rounded-0.6 pl-3 font-Poppins font-semibold text-xs border border-borderPrimary leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-xs placeholder:text-dropGray dark:placeholder:text-inputText placeholder:leading-1.12"
                placeholderText="DD/MM/YYYY - DD/MM/YYYY"
                isClearable={true}
                ref={datepickerRef}
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="absolute right-4 top-4 drop-icon">
              <img className="right-6 cursor-pointer" src={calendarIcon} alt="" onClick={() => handleClickDatepickerIcon()} />
            </div>
          </div>
        </div>
        <div
          className="flex justify-between w-11.68 btn-save-modal h-3.12 items-center px-5 rounded-0.3 shadow-connectButtonShadow cursor-pointer"
          onClick={handleWidgetDrawer}
        >
          <div className="font-Poppins font-medium text-white leading-5 text-search ">Manage Widget</div>
          <div className="brick-icon bg-cover">
            <img src={brickIcon} alt="" />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-1.8">
        <QuickInfo />
      </div>
      <div className="flex flex-col mt-1.8">
        <HealthCard />
      </div>
      <div className=" flex flex-row mt-2.47">
        <div className=" flex flex-col w-full">
          <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 mt-1.258">Activities</h3>
          <ActivitiesTab />
        </div>
        <div className=" flex flex-col ml-1.86 w-full">
          <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18  mt-1.258 ">Members</h3>
          <MembersTab />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center fixTableHead-nomember hidden">
        <img src={noWidgetIcon} alt="" className="w-[3.8125rem] h-[3.8125rem]" />
        <div className="font-Poppins font-medium text-tableDuration text-noReports leading-10 pt-5">No widgets added</div>
      </div>
    </>
  );
};

export default Dashboard;
