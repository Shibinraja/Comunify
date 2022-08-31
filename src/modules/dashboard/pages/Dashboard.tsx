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
        <div className="flex relative items-center w-8/12">
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
              className="absolute top-12 w-11.72 border border-borderPrimary bg-white dark:bg-secondaryDark  shadow-shadowInput rounded-0.6 "
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
              />
            </div>
            <div className="absolute right-4 top-4 drop-icon">
              <img className="right-6 cursor-pointer" src={calendarIcon} alt="" onClick={() => handleClickDatepickerIcon()} />
            </div>
          </div>
        </div>
        <div className="w-4/12 flex justify-end">
          <div className="flex justify-between w-11.68 btn-save-modal h-3.12 items-center px-5 rounded-0.3 shadow-connectButtonShadow cursor-pointer">
            <div className="font-Poppins font-medium text-white leading-5 text-search ">Manage Widget</div>
            <div className="brick-icon bg-cover">
              <img src={brickIcon} alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* If No Data */}
      {/* <div className="flex flex-col justify-center items-center w-full h-full">
        <div>
          <svg width="61" height="61" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.20744 0.141595C4.68077 0.481895 3.35464 1.20426 2.27443 2.28398C1.3808 3.17721 0.781898 4.13976 0.337112 5.39822C0.114001 6.02919 0 6.69355 0 7.3628V14.2863V21.2099C0 21.8791 0.114001 22.5435 0.337112 23.1745C1.20711 25.6356 2.92227 27.3394 5.42005 28.224C6.02016 28.4365 6.65212 28.545 7.28874 28.545H14.2652H21.192C21.8614 28.545 22.5261 28.4311 23.1573 28.2081C25.6195 27.3385 27.3242 25.6241 28.2091 23.1275C28.4217 22.5276 28.5303 21.8959 28.5303 21.2595V14.2863V7.31318C28.5303 6.67679 28.4217 6.04507 28.2091 5.44524C27.3242 2.94859 25.6195 1.23421 23.1573 0.364604C22.526 0.141563 21.8615 0.026625 21.192 0.0246276L14.5636 0.0048551C8.55301 -0.0131622 6.77088 0.0160711 6.20744 0.141595ZM38.6771 0.141595C37.1504 0.481895 35.8243 1.20426 34.7441 2.28398C33.8505 3.17721 33.2516 4.13976 32.8068 5.39822C32.5837 6.02919 32.4697 6.69355 32.4697 7.3628V14.2863V21.2099C32.4697 21.8791 32.5837 22.5435 32.8068 23.1745C33.6768 25.6356 35.3919 27.3394 37.8897 28.224C38.4898 28.4365 39.1218 28.545 39.7584 28.545H46.7348H53.6616C54.3311 28.545 54.9957 28.4311 55.627 28.2081C58.0892 27.3385 59.7938 25.6241 60.6788 23.1275C60.8914 22.5276 61 21.8959 61 21.2595V14.2863V7.31318C61 6.67679 60.8914 6.04507 60.6788 5.44524C59.7938 2.94859 58.0892 1.23421 55.627 0.364604C54.9956 0.141563 54.3312 0.026625 53.6616 0.0246276L47.0333 0.0048551C41.0227 -0.0131622 39.2405 0.0160711 38.6771 0.141595ZM22.4022 4.1777C23.2621 4.59986 23.956 5.29346 24.3784 6.15304C24.5968 6.59767 24.7104 7.08645 24.7104 7.58183V14.2863V21.0117C24.7104 21.4934 24.5999 21.9686 24.3875 22.4009C23.9717 23.2473 23.2337 23.9868 22.3932 24.3993C21.9543 24.6148 21.4718 24.7268 20.9828 24.7268H14.2652H7.53666C7.05483 24.7268 6.57942 24.6164 6.14691 24.4041C5.3002 23.9885 4.56032 23.2508 4.14764 22.4107C3.93199 21.9718 3.81861 21.4898 3.81601 21.0008L3.78224 14.6443C3.75586 9.68991 3.78522 7.35721 3.87905 6.92385C4.14955 5.67624 5.27035 4.44951 6.54598 4.00517C7.11718 3.80614 7.69746 3.79242 14.4442 3.81807L20.9729 3.843C21.4685 3.84489 21.9572 3.95934 22.4022 4.1777ZM54.8718 4.1777C55.7318 4.59986 56.4257 5.29346 56.8481 6.15304C57.0665 6.59767 57.18 7.08645 57.18 7.58183V14.2863V21.0117C57.18 21.4934 57.0696 21.9686 56.8571 22.4009C56.4414 23.2473 55.7034 23.9868 54.8629 24.3993C54.4239 24.6148 53.9414 24.7268 53.4525 24.7268H46.7348H40.0063C39.5245 24.7268 39.0491 24.6164 38.6166 24.4041C37.7699 23.9885 37.03 23.2508 36.6173 22.4107C36.4017 21.9718 36.2883 21.4898 36.2857 21.0008L36.2519 14.6443C36.2255 9.68991 36.2549 7.35721 36.3487 6.92385C36.6192 5.67624 37.74 4.44951 39.0156 4.00517C39.5868 3.80614 40.1671 3.79242 46.9139 3.81807L53.4425 3.843C53.9382 3.84489 54.4269 3.95934 54.8718 4.1777ZM6.20744 32.5965C4.68077 32.9368 3.35464 33.6592 2.27443 34.7389C1.3808 35.6322 0.781898 36.5947 0.337112 37.8532C0.114001 38.4841 0 39.1485 0 39.8177V46.7413V53.6648C0 54.3341 0.114001 54.9985 0.337112 55.6294C1.20711 58.0905 2.92227 59.7944 5.42005 60.6789C6.02016 60.8914 6.65212 61 7.28874 61H14.2652H21.192C21.8614 61 22.5261 60.8861 23.1573 60.663C25.6195 59.7934 27.3242 58.0791 28.2091 55.5824C28.4217 54.9826 28.5303 54.3509 28.5303 53.7145V46.7413V39.7681C28.5303 39.1317 28.4217 38.5 28.2091 37.9002C27.3242 35.4035 25.6195 33.6892 23.1573 32.8196C22.526 32.5965 21.8615 32.4816 21.192 32.4796L14.5636 32.4598C8.55301 32.4418 6.77088 32.471 6.20744 32.5965ZM45.3023 32.4773C45.2039 32.5012 44.7204 32.5859 44.228 32.6656C39.9488 33.3578 35.9464 36.3486 33.9337 40.3577C32.8753 42.4657 32.4795 44.1806 32.4737 46.6816C32.4693 48.6267 32.6022 49.5292 33.1353 51.1745C34.2981 54.7635 36.9486 57.8268 40.3896 59.5589C41.4019 60.0685 42.9662 60.5966 44.1683 60.8345C45.4013 61.0786 48.3328 61.0461 49.5998 60.774C54.6541 59.6892 58.7676 56.0106 60.3344 51.1745C60.8602 49.5516 61 48.6206 61 46.7413C61 45.7474 60.9296 44.6557 60.8344 44.1759C59.7019 38.4613 55.4492 34.0483 49.8386 32.7656C48.9134 32.5541 45.8016 32.3564 45.3023 32.4773ZM22.4022 36.6327C23.2621 37.0548 23.956 37.7484 24.3784 38.608C24.5968 39.0526 24.7104 39.5414 24.7104 40.0368V46.7413V53.4666C24.7104 53.9483 24.5999 54.4236 24.3875 54.8559C23.9717 55.7022 23.2337 56.4417 22.3932 56.8542C21.9543 57.0697 21.4718 57.1818 20.9828 57.1818H14.2652H7.53665C7.05483 57.1818 6.57942 57.0714 6.14691 56.859C5.3002 56.4434 4.56032 55.7058 4.14764 54.8657C3.93199 54.4268 3.81861 53.9447 3.81601 53.4558L3.78224 47.0993C3.75586 42.1449 3.78522 39.8122 3.87905 39.3788C4.14955 38.1312 5.27035 36.9045 6.54598 36.4601C7.11718 36.2611 7.69746 36.2474 14.4442 36.273L20.9729 36.298C21.4685 36.2998 21.9572 36.4143 22.4022 36.6327ZM48.5898 36.4243C50.6578 36.7848 52.6117 37.8107 54.1405 39.3389C58.2437 43.4401 58.2471 50.0546 54.1483 54.1514C50.0486 58.2493 43.4744 58.2485 39.3408 54.1496C35.21 50.0536 35.21 43.429 39.3408 39.333C41.8288 36.8658 45.1432 35.8235 48.5898 36.4243Z"
              fill="url(#paint0_linear_4298_2182)"
            />
            <defs>
              <linearGradient id="paint0_linear_4298_2182" x1="61" y1="55.0326" x2="-5.95694" y2="46.4448" gradientUnits="userSpaceOnUse">
                <stop stopColor="#69B5E5" />
                <stop offset="1" stopColor="#ABCF6B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="text-2xl pt-2 text-slimGray"> "No widgets added" </span>
      </div> */}
      <div className="flex flex-col">
        <div className="flex flex-col mt-1.8">
          <QuickInfo />
        </div>
        <div className="flex flex-col mt-1.8">
          <HealthCard />
        </div>
        <div className=" flex flex-row mt-2.47">
          <div className=" flex flex-col w-full">
            <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 mt-1.258 dark:text-white">Activities</h3>
            <ActivitiesTab />
          </div>
          <div className=" flex flex-col ml-1.86 w-full">
            <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18  mt-1.258 dark:text-white">Members</h3>
            <MembersTab />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
