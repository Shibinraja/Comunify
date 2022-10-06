import React, { useEffect, useRef, useState } from 'react';
import brickIcon from '../../../assets/images/brick.svg';
import calendarIcon from '../../../assets/images/calandar.svg';
import dropDownIcon from '../../../assets/images/profile-dropdown.svg';
import '../../../../node_modules/react-grid-layout/css/styles.css';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import { convertEndDate, convertStartDate, getLocalWorkspaceId } from '../../../lib/helper';
import { showErrorToast, showSuccessToast } from '../../../common/toast/toastFunctions';
import { getWidgetsLayoutService, saveWidgetsLayoutService } from '../services/dashboard.services';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';
import moment from 'moment';
import Button from '../../../common/button';

import WidgetContainer from '../../../common/widgets/widgetContainer/WidgetContainer';

Modal.setAppElement('#root');

const Dashboard: React.FC = () => {
  const [isSelectDropDownActive, setSelectDropDownActive] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [selected, setSelected] = useState<string>('');
  const [dateRange, setDateRange] = useState([null, null]);
  const datePickerRef = useRef<ReactDatePicker>(null);
  const [startDate, endDate] = dateRange;

  const selectOptions = [
    { id: Math.random(), dateRange: 'This Week' },
    { id: Math.random(), dateRange: 'Last Week' },
    { id: Math.random(), dateRange: 'This Month' }
  ];
  const [isManageMode, setIsManageMode] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<any[] | []>([]);
  const [transformedWidgetData, setTransformedWidgetData] = React.useState<any[]>(new Array(null));
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [startingDate, setStartingDate] = React.useState<string>();
  const [endingDate, setEndingDate] = React.useState<string>();
  const [isButtonLoading, setIsButtonLoading] = React.useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    //to clear any params in the url when the page is being reload/loaded first time
    navigate({
      pathname: location.pathname,
      search: ``
    });
    fetchWidgetLayoutData();
    setSelectedDateRange('this week');
  }, []);

  useEffect(() => {
    if (selected) {
      setNavigation(startingDate, endingDate);
    }
  }, [selected]);

  useEffect(() => {
    if (startDate && endDate) {
      const start: string = convertStartDate(startDate);
      const end: string = convertEndDate(endDate);
      setNavigation(start, end);
    }
  }, [startDate, endDate]);

  const handleDropDownActive = (): void => {
    if (widgets.length) {
      setSelectDropDownActive((prev) => !prev);
      setDateRange([null, null]);
    }
  };

  const setNavigation = (start?: string, end?: string) => {
    if (start && end) {
      const params = { startDate: start, endDate: end };
      navigate({
        pathname: location.pathname,
        search: `?${createSearchParams(params)}`
      });
    }
  };

  const workspaceId = getLocalWorkspaceId();

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setSelectDropDownActive(false);
    }
  };

  const handleClickDatePickerIcon = () => {
    const datePickerElement = datePickerRef.current;
    datePickerElement?.setFocus();
  };

  const handleCalendarOpenAndClearOtherFiler = () => {
    setStartingDate(undefined);
    setEndingDate(undefined);
    setSelected('');
  };

  const handleWidgetDrawer = () => {
    setIsManageMode((prev) => !prev);
  };

  // eslint-disable-next-line space-before-function-paren
  const saveWidgetLayout = async () => {
    setIsButtonLoading(true);
    try {
      const data = await saveWidgetsLayoutService(workspaceId, transformedWidgetData);
      await fetchWidgetLayoutData();
      if (data?.data) {
        setIsManageMode(false);
        setIsButtonLoading(false);
        showSuccessToast('Widget layout saved');
      }
      return data;
    } catch {
      setIsButtonLoading(false);
      showErrorToast('Failed to save widgets layout');
    }
  };
  // eslint-disable-next-line space-before-function-paren
  const fetchWidgetLayoutData = async () => {
    try {
      const response = await getWidgetsLayoutService(workspaceId);
      const widgetDataArray = response?.map((data: any) => ({
        id: data?.id,
        layout: { ...data.configs, i: data?.id },
        widget: { ...data?.widget, widgetId: data?.widgetId }
      }));
      setWidgets(widgetDataArray);
    } catch {
      showErrorToast('Failed to load widgets layout');
    }
  };

  const setSelectedDateRange = (option: string) => {
    // if (option.toLocaleLowerCase().trim() === '') {
    //   setStartingDate(moment().startOf('week').toISOString());
    //   setEndingDate(convertEndDate(new Date()));

    // }
    if (option === 'this week') {
      setSelected('This Week');
      setStartingDate(moment().startOf('week').toISOString());
      setEndingDate(convertEndDate(new Date()));
    } else if (option === 'last week') {
      setSelected('Last Week');
      setStartingDate(moment().startOf('week').subtract(1, 'week').toISOString());
      setEndingDate(moment().endOf('week').subtract(1, 'week').endOf('week').toISOString());
    } else if (option === 'this month') {
      setSelected('This Month');
      setStartingDate(moment().startOf('month').toISOString());
      setEndingDate(moment().endOf('month').toISOString());
    }
  };

  return (
    <>
      <div className="flex justify-between mt-10 pb-2">
        <div className="flex relative items-center">
          <div
            className={`flex items-center justify-between px-5 w-11.72 h-3.06 border border-borderPrimary rounded-0.6 shadow-shadowInput ${
              widgets?.length ? 'cursor-pointer' : 'cursor-not-allowed'
            }  `}
            ref={dropDownRef}
            onClick={handleDropDownActive}
          >
            <div className="font-Poppins font-semibold text-card capitalize text-dropGray dark:text-inputText leading-4">
              {selected ? selected : 'Select'}
            </div>
            <div className="bg-cover drop-icon">
              <img src={dropDownIcon} alt="" className={isSelectDropDownActive ? 'rotate-180' : 'rotate-0'} />
            </div>
          </div>
          {isSelectDropDownActive && (
            <div
              className={`absolute top-12 w-11.72 border z-10 border-borderPrimary bg-white dark:bg-secondaryDark  shadow-shadowInput rounded-0.6`}
              onClick={handleDropDownActive}
            >
              {selectOptions?.map((options: { id: number; dateRange: string }) => (
                <div key={`${options?.id}`} className="flex flex-col p-2 hover:bg-greyDark transition ease-in duration-300 cursor-pointer rounded-lg">
                  <div
                    onClick={() => setSelectedDateRange(options?.dateRange.toLocaleLowerCase().trim())}
                    className="h-1.93 px-3 flex items-center z-100 font-Poppins text-trial font-normal leading-4 text-searchBlack"
                  >
                    <div>{options?.dateRange}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pl-2.5 relative">
            <div>
              <DatePicker
                selectsRange={true}
                onCalendarOpen={handleCalendarOpenAndClearOtherFiler}
                disabled={!widgets?.length ? true : false}
                startDate={startDate}
                endDate={endDate}
                maxDate={new Date()}
                onChange={(update: any) => {
                  setDateRange(update);
                }}
                className={`export w-[15.5rem] h-3.06  bg-transparent dark:bg-primaryDark text-dropGray dark:text-inputText shadow-shadowInput rounded-0.6 pl-4 
                font-Poppins font-semibold text-xs border border-borderPrimary leading-1.12 
                focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-xs
                 placeholder:text-dropGray dark:placeholder:text-inputText placeholder:leading-1.12 ${!widgets?.length ? 'cursor-not-allowed' : ''}`}
                placeholderText="DD/MM/YYYY - DD/MM/YYYY"
                isClearable={true}
                ref={datePickerRef}
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="absolute right-[1.4rem] top-4 drop-icon">
              <img
                className="right-6 cursor-pointer"
                src={dateRange[0] === null && dateRange[1] === null ? calendarIcon : dateRange[0] !== null ? '' : calendarIcon}
                alt=""
                onClick={() => handleClickDatePickerIcon()}
              />
            </div>
          </div>
        </div>
        {isManageMode === false ? (
          <Button
            text=""
            onClick={handleWidgetDrawer}
            className={`flex justify-between w-11.68 btn-save-modal h-3.12 items-center px-5 rounded-0.3 shadow-connectButtonShadow ${
              window.location.href.includes('stage') ? 'cursor-not-allowed' : 'cursor-pointer'
            } `}
            disabled={window.location.href.includes('stage') ? true : false}
          >
            <div className="font-Poppins font-medium text-white leading-5 text-search ">Manage Widget</div>
            <div className="brick-icon bg-cover">
              <img src={brickIcon} alt="" />
            </div>
          </Button>
        ) : (
          <Button
            text=""
            disabled={isButtonLoading ? true : false}
            className={`flex justify-between w-11.68 btn-save-modal h-3.12 items-center px-5 rounded-0.3 shadow-connectButtonShadow ${
              isButtonLoading ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer'
            }`}
            onClick={saveWidgetLayout}
          >
            <div className="font-Poppins font-medium text-white leading-5 text-search ml-3">Save Layout</div>
            <div className="brick-icon bg-cover">
              <img src={brickIcon} alt="" />
            </div>
          </Button>
        )}
      </div>
      <div className="mb-4">
        <WidgetContainer isManageMode={isManageMode} widgets={widgets} setWidgets={setWidgets} setTransformedWidgetData={setTransformedWidgetData} />
      </div>
    </>
  );
};

export default Dashboard;
