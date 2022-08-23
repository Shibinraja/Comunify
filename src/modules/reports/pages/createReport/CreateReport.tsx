import React, { useRef, useState } from 'react';
import './CreateReport.css';
import DatePicker from 'react-datepicker';
import dropdownIcon from '../../../../assets/images/filter-dropdown.svg';
import calendarIcon from '../../../../assets/images/calandar.svg';

import 'react-datepicker/dist/react-datepicker.css';
import Button from 'common/button';
import Input from 'common/input';
import { useNavigate } from 'react-router';

const CreateReport = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isReportActive, setIsReportActive] = useState(false);
  const [isPlatformActive, setIsPlatformActive] = useState(false);
  const datepickerRefFrom = useRef<any>(null);
  const datepickerRefTo = useRef<any>(null);

  const options = ['Daily', 'Weekly', 'Monthly'];
  const [selectedReport, setselectedReport] = useState('');

  const handleClickDatepickerIcon = (type: string) => {
    if (type === 'start') {
      const datepickerElement = datepickerRefFrom.current;
      datepickerElement.setFocus(true);
    } else {
      const datepickerElement = datepickerRefTo.current;
      datepickerElement.setFocus(true);
    }
  };

  const navigateToReports = () => {
    navigate('/reports');
  };

  return (
    <div className="report mt-4.56 ">
      <div className="flex flex-col">
        <h3 className="font-Poppins font-semibold text-infoBlack leading-2.18 text-infoData">Create Report</h3>
        <form className="grid grid-cols-2 relative mt-1.8 w-[70%] 2xl:w-1/2">
          <div className="flex flex-col">
            <label htmlFor="reportName" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
              Report Name
            </label>
            <Input
              type="text"
              name="reportName"
              id="reportNAmeId"
              className="w-20.5 2xl:w-full h-3.06 mt-0.375 shadow-reportInput rounded-0.3 focus:outline-none p-3 placeholder:font-Poppins placeholder:text-thinGray placeholder:text-trial placeholder:font-normal placeholder:leading-1.31 app-result-card-border"
              placeholder="Report Name"
            />
          </div>
          <div className="flex flex-col pl-5">
            <label htmlFor="description" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
              Description
            </label>
            <Input
              type="text"
              name='="description'
              id="descriptionId"
              className="w-20.5 2xl:w-full h-3.06 mt-0.375 shadow-reportInput rounded-0.3 focus:outline-none p-3 placeholder:font-Poppins placeholder:text-thinGray placeholder:text-trial placeholder:font-normal placeholder:leading-1.31 app-result-card-border"
              placeholder="Description"
            />
          </div>
          <div className=" flex-flex-col mt-1.8">
            <label htmlFor="chooseCondition" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
              Choose Condition
            </label>
            <div className="flex gap-[1.375rem] mt-0.375 ">
              <div className="w-4.06 2xl:w-1/4 h-3.06 app-result-card-border shadow-reportInput rounded-0.3 flex items-center justify-center font-Poppins font-semibold text-card text-dropGray leading-1.12 cursor-pointer">
                1 Day
              </div>
              <div className="w-4.06 2xl:w-1/4 h-3.06 app-result-card-border shadow-reportInput rounded-0.3 flex items-center justify-center font-Poppins font-semibold text-card text-dropGray leading-1.12 cursor-pointer">
                1 Week
              </div>
              <div className="w-4.06 2xl:w-1/4 h-3.06 app-result-card-border shadow-reportInput rounded-0.3 flex items-center justify-center font-Poppins font-semibold text-card text-dropGray leading-1.12 cursor-pointer">
                1 Month
              </div>
              <div className="w-4.06 2xl:w-1/4 h-3.06 app-result-card-border shadow-reportInput rounded-0.3 flex items-center justify-center font-Poppins font-semibold text-card text-dropGray leading-1.12 cursor-pointer">
                1 Year
              </div>
            </div>
          </div>
          <div className="mt-1.8 flex-flex-col pl-5">
            <label htmlFor="name" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
              Custom Date
            </label>
            <div className="flex mt-0.375 gap-2">
              <div className="relative flex items-center 2xl:w-1/2 ">
                <DatePicker
                  selected={fromDate}
                  onChange={(date: Date) => setFromDate(date)}
                  className="w-9.92 2xl:w-full h-3.06 app-result-card-border shadow-reportInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                  placeholderText="From"
                  ref={datepickerRefFrom}
                />
                <img
                  className="absolute icon-holder right-4 cursor-pointer"
                  src={calendarIcon}
                  alt=""
                  onClick={() => handleClickDatepickerIcon('start')}
                />
              </div>
              <div className="relative flex items-center 2xl:w-1/2 ">
                <DatePicker
                  selected={toDate}
                  onChange={(date: Date) => setToDate(date)}
                  className="w-9.92 2xl:w-full h-3.06 app-result-card-border shadow-reportInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                  placeholderText="To"
                  ref={datepickerRefTo}
                />
                <img
                  className="absolute icon-holder right-4 cursor-pointer"
                  src={calendarIcon}
                  alt=""
                  onClick={() => handleClickDatepickerIcon('end')}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-col " onClick={() => setIsPlatformActive(!isPlatformActive)}>
            <label htmlFor="name" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
              Choose Platform
            </label>
            <div className="w-20.5 2xl:w-full h-3.06 app-result-card-border flex items-center px-3 mt-0.375 shadow-reportInput rounded-0.3 font-Poppins font-normal text-trial text-thinGray leading-1.31 cursor-pointer relative">
              Select
              <div className="absolute right-4">
                <img src={dropdownIcon} alt="" className={isPlatformActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isPlatformActive && (
              <div className="flex-flex-col  app-result-card-border box-border w-20.5 rounded-0.3 shadow-reportInput cursor-pointer absolute -bottom-[.2rem] bg-white z-40">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-signUpDomain  transition ease-in duration-100 p-3">
                  <div>
                    <input type="checkbox" className="checkbox" />
                  </div>
                  <div>All</div>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-signUpDomain  transition ease-in duration-100 p-3">
                  <div>
                    <input type="checkbox" className="checkbox" />
                  </div>
                  <div>Slack</div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-col pl-5 " onClick={() => setIsReportActive(!isReportActive)}>
            <label htmlFor="name" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
              Schedule Report
            </label>
            <div className="relative w-20.5 2xl:w-full h-3.06 app-result-card-border flex items-center px-3 mt-0.375 shadow-reportInput rounded-0.3 font-Poppins font-normal text-trial text-thinGray leading-1.31 cursor-pointer ">
              {selectedReport ? selectedReport : 'Select'}
              <div className="absolute right-4">
                <img src={dropdownIcon} alt="" className={isReportActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isReportActive && (
              <div className="flex flex-col app-result-card-border box-border w-20.5 rounded-0.3 shadow-reportInput cursor-pointer absolute -bottom-[2.6rem] bg-white">
                {options.map((options) => (
                  <ul
                    className="cursor-pointer hover:bg-signUpDomain  transition ease-in duration-100 "
                    onClick={() => {
                      setselectedReport(options);
                    }}
                    key={options.toString()}
                  >
                    <li value={selectedReport} className="text-searchBlack font-Poppins font-normal leading-1.31 text-trial p-3">
                      {options}
                    </li>
                  </ul>
                ))}
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-col">
            <label htmlFor="email" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
              Alternate Recipient Mail IDs
            </label>
            <Input
              type="email"
              name="email"
              id="email-id"
              placeholder="Email Id"
              className="w-20.5 2xl:w-full h-3.06 mt-0.375 shadow-reportInput rounded-0.3 focus:outline-none p-3 placeholder:font-Poppins placeholder:text-thinGray placeholder:text-trial placeholder:font-normal placeholder:leading-1.31 app-result-card-border"
            />
          </div>
        </form>

        <div className="buttons flex justify-end w-full 2xl:w-[60%] mt-20">
          <Button
            type="button"
            text="CANCEL"
            className="cancel cursor-pointer font-Poppins font-medium text-error leading-5 border-cancel text-thinGray box-border rounded w-6.875 h-3.12"
            onClick={navigateToReports}
          />
          <Button
            type="button"
            text="NEXT"
            className="ml-2.5 cursor-pointer font-Poppins font-medium text-error leading-5 btn-save-modal text-white w-7.68 h-3.12 border-none rounded shadow-contactBtn"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
