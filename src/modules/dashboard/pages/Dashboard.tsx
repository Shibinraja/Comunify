/* eslint-disable @typescript-eslint/ban-types */
import React, { FC, useEffect, useRef, useState } from 'react';
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
import moment from 'moment';
import Button from '../../../common/button';
import WidgetContainer from '../../../common/widgets/widgetContainer/WidgetContainer';
import { ModalDrawer } from 'common/modals/ModalDrawer';

Modal.setAppElement('#root');

type widgetResponseData = {
  saveWidgetResponse: Array<{ id: string; layout: {}; widget: {} }>;
  saveTransformWidgetResponse: Array<{ id: string; layout: {}; widget: {} }>;
};

const Dashboard: FC = () => {
  const [isSelectDropDownActive, setSelectDropDownActive] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isManageMode, setIsManageMode] = useState<boolean>(false);
  const [widgetLoading, setWidgetLoading] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<any[] | []>([]);
  const [widgetResponse, setWidgetResponse] = useState<widgetResponseData>({
    saveWidgetResponse: [],
    saveTransformWidgetResponse: []
  });
  const [transformedWidgetData, setTransformedWidgetData] = useState<any[]>(new Array(null));
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [startingDate, setStartingDate] = useState<string>();
  const [endingDate, setEndingDate] = useState<string>();
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>(moment().startOf('week').toISOString());
  const [endDate, setEndDate] = useState<string>(convertEndDate(new Date()));

  const datePickerRef = useRef<ReactDatePicker>(null);
  const [startDateRange, endDateRange] = dateRange;

  const selectOptions = [
    { id: Math.random(), dateRange: 'This Week' },
    { id: Math.random(), dateRange: 'Last Week' },
    { id: Math.random(), dateRange: 'This Month' }
  ];

  useEffect(() => {
    fetchWidgetLayoutData();
    setSelectedDateRange('this week');
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (selected) {
      setDateFilter(startingDate, endingDate);
    }
  }, [selected]);

  useEffect(() => {
    if (widgets?.length) {
      setWidgetResponse((prevState) => ({ ...prevState, saveTransformWidgetResponse: widgets }));
    }
  }, [widgets]);

  useEffect(() => {
    if (startDateRange && endDateRange) {
      const start: string = convertStartDate(startDateRange);
      const end: string = convertEndDate(endDateRange);
      setDateFilter(start, end);
    }
  }, [startDateRange, endDateRange]);

  const handleDropDownActive = (): void => {
    if (widgets?.length) {
      setSelectDropDownActive((prev) => !prev);
      setDateRange([null, null]);
    }
  };

  const setDateFilter = (start?: string, end?: string) => {
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
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
      setWidgetLoading(true);
      const response = await getWidgetsLayoutService(workspaceId);
      const widgetDataArray = response?.map((data: any) => ({
        id: data?.id,
        layout: { ...data.configs, i: data?.id },
        widget: { ...data?.widget, widgetId: data?.widgetId }
      }));
      setWidgetLoading(false);
      setWidgets(widgetDataArray);
      setWidgetResponse((prevState) => ({ ...prevState, saveWidgetResponse: widgetDataArray }));
    } catch {
      setWidgetLoading(false);
      showErrorToast('Failed to load widgets layout');
    }
  };

  const setSelectedDateRange = (option: string) => {
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

  const handleNavigateBack = () => {
    if (widgetResponse.saveWidgetResponse?.length) {
      setModalOpen(true);
    }
    if (transformedWidgetData.length) {
      setModalOpen(true);
    }
    if (!transformedWidgetData.length) {
      setIsManageMode(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setWidgets(widgetResponse.saveTransformWidgetResponse);
  };

  //On Submit functionality when back button is clicked
  const handleOnSubmit = () => {
    if (modalOpen) {
      setWidgets(widgetResponse.saveWidgetResponse);
      setModalOpen(false);
      setIsManageMode(false);
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
                startDate={startDateRange}
                endDate={endDateRange}
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
                className={`${!widgets?.length ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
            className={`flex justify-between w-11.68 btn-save-modal h-3.12 items-center px-5 rounded-0.3 shadow-connectButtonShadow cursor-pointer`}
          >
            <div className="font-Poppins font-medium text-white leading-5 text-search ">Manage Widget</div>
            <div className="brick-icon bg-cover">
              <img src={brickIcon} alt="" />
            </div>
          </Button>
        ) : (
          <div className="flex justify-end items-center">
            <Button
              type="button"
              text=""
              className="mr-2.5 w-6.875 h-3.12 border-[#9B9B9B] border-2 items-center px-5 rounded-0.3 shadow-connectButtonShadow "
              onClick={handleNavigateBack}
            >
              <div className="font-Poppins font-medium text-[#808080] leading-5 text-[13px] ">Back</div>
            </Button>
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
          </div>
        )}
      </div>
      <div className="mb-4">
        <WidgetContainer
          isManageMode={isManageMode}
          widgets={widgets}
          setWidgets={setWidgets}
          setTransformedWidgetData={setTransformedWidgetData}
          filters={{ startDate, endDate }}
          widgetLoading = {widgetLoading}
        />
      </div>
      <ModalDrawer
        isOpen={modalOpen}
        isClose={handleModalClose}
        loader={false}
        onSubmit={handleOnSubmit}
        iconSrc={''}
        contextText={'Are you sure you want to go back? The changes you made may not be saved'}
      />
    </>
  );
};

export default Dashboard;
