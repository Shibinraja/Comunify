import QuickInfo from 'common/quickInfo/QuickInfo';
import React, { useEffect, useRef, useState } from 'react';
import ActivitiesTab from '../activitiesTab/pages/ActivitiesTab';
import MembersTab from '../membersTab/pages/MembersTab';
import brickIcon from '../../../assets/images/brick.svg';
import dropDownIcon from '../../../assets/images/profile-dropdown.svg';
import calendarIcon from '../../../assets/images/calandar.svg';
import HealthCard from 'common/healthCard/HealthCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="flex justify-between mt-10">
        <div className="flex relative items-center">
          <div
            className="flex items-center justify-between px-5 w-11.72 h-3.06 app-input-card-border rounded-0.6 shadow-shadowInput cursor-pointer "
            ref={dropDownRef}
            onClick={handleDropDownActive}
          >
            <div className="font-Poppins font-semibold text-card text-dropGray leading-4">{selected ? selected : 'Select'}</div>
            <div className="bg-cover ">
              <img src={dropDownIcon} alt="" className={isSelectDropDownActive ? 'rotate-180' : 'rotate-0'} />
            </div>
          </div>
          {isSelectDropDownActive && (
            <div className="absolute top-12 w-11.72 app-input-card-border bg-white shadow-shadowInput rounded-0.6" onClick={handleDropDownActive}>
              {selectOptions.map((options: string, index: number) => (
                <div key={index} className="flex flex-col p-2 hover:bg-signUpDomain transition ease-in duration-300 cursor-pointer">
                  <div className="text-searchBlack font-Poppins font-normal text-trial leading-1.31" onClick={() => setSelected(options)}>
                    {options}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pl-2.5">
            <div>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update: any) => {
                  setDateRange(update);
                }}
                className="export w-[15.5rem] h-3.06  shadow-shadowInput rounded-0.6 pl-3 pr-10 font-Poppins font-semibold text-xs text-dropGray app-input-card-border focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-xs placeholder:text-dropGray"
                placeholderText="DD/MM/YYYY - DD/MM/YYYY"
                isClearable={true}
                ref={datepickerRef}
                dateFormat='dd/MM/yyyy'
              />
            </div>
            <div className="absolute right-6 top-4">
              <img className="right-6 cursor-pointer" src={calendarIcon} alt="" onClick={() => handleClickDatepickerIcon()} />
            </div>
          </div>
        </div>
        <div className="flex justify-between w-11.68 btn-save-modal h-3.12 items-center px-5 rounded-0.3 shadow-connectButtonShadow cursor-pointer">
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
    </>
  );
};

export default Dashboard;
