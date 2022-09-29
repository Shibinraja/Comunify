import React, { useCallback, useEffect, useRef, useState } from 'react';
import brickIcon from '../../../assets/images/brick.svg';
import calendarIcon from '../../../assets/images/calandar.svg';
import dropDownIcon from '../../../assets/images/profile-dropdown.svg';
import '../../../../node_modules/react-grid-layout/css/styles.css';
import noWidgetIcon from '../../../assets/images/no-widget.svg';
import SidePanelWidgets, { widgetList } from 'common/widgetLayout/SidePanelWidgets';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import ReactGridLayout, { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { convertEndDate, convertStartDate, getLocalWorkspaceId } from '../../../lib/helper';
import { showErrorToast, showSuccessToast } from '../../../common/toast/toastFunctions';
import { getWidgetsLayoutService, saveWidgetsLayoutService } from '../services/dashboard.services';
import { PanelWidgetsType } from '../../../common/widgetLayout/WidgetTypes';
import { useLocation, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import Button from 'common/button';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
Modal.setAppElement('#root');

const Dashboard: React.FC = () => {
  const [isSelectDropDownActive, setSelectDropDownActive] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [selected, setSelected] = useState<string>('');
  const [dateRange, setDateRange] = useState([null, null]);
  const datePickerRef = useRef<ReactDatePicker>(null);
  const [startDate, endDate] = dateRange;
  const handleDropDownActive = (): void => {
    setSelectDropDownActive((prev) => !prev);
  };
  const selectOptions = [
    { id: Math.random(), dateRange: 'This Week' },
    { id: Math.random(), dateRange: 'Last Week' },
    { id: Math.random(), dateRange: 'This Month' }
  ];
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<any[] | []>([]);
  const [widgetKey, setWidgetKey] = useState<string | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [widgetListData] = React.useState(widgetList);
  const [transformedWidgetData, setTransformedWidgetData] = React.useState<any[]>(new Array(null));
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [startingDate, setStartingDate] = React.useState<string>();
  const [endingDate, setEndingDate] = React.useState<string>();

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    fetchWidgetLayoutData();
    setSelectedDateRange('Select');
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

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const removeWidget: string | null = searchParams.get('widgetName');

  useEffect(() => {
    removeWidgetFromState();
  }, [removeWidget]);

  useEffect(() => {
    if (isDrawerOpen) {
      setParamsToManageWidgets('manage');
    } else {
      setParamsToManageWidgets();
    }
  }, [isDrawerOpen]);

  const removeWidgetFromState = () => {
    try {
      const newWidgetArray = widgets?.filter((data) => data?.widget?.widgetLocation !== removeWidget);
      setWidgets(newWidgetArray);
      navigate({ pathname: location.pathname, search: `` });
      // showSuccessToast('Removed the selected the widget');
    } catch {
      showErrorToast('Failed to remove widget');
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

  const setParamsToManageWidgets = (action?: string) => {
    if (action === 'manage') {
      const params = { manageWidgets: action };
      navigate({
        pathname: location.pathname,
        search: `?${createSearchParams(params)}`
      });
    } else {
      navigate({
        pathname: location.pathname,
        search: ``
      });
    }
  };

  const workspaceId = getLocalWorkspaceId();

  const onDrop = useCallback(
    (items: Layout[], item: Layout, e: DragEvent) => {
      const raw = e.dataTransfer?.getData('droppableWidget');
      if (!raw) {
        return;
      }
      const droppableWidget: any = JSON.parse(raw);
      setWidgetKey(droppableWidget?.widget?.widgetLocation);

      const newWidgetArray = [...widgets];
      const droppedWidget: PanelWidgetsType = {
        layout: { ...droppableWidget.layout },
        widget: { ...droppableWidget.widget }
      };
      newWidgetArray.push(droppedWidget);
      setWidgets(newWidgetArray);
    },
    [widgets]
  );

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setSelectDropDownActive(false);
    }
  };

  const handleClickDatePickerIcon = () => {
    const datePickerElement = datePickerRef.current;
    datePickerElement?.setFocus();
  };

  const handleWidgetDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  // eslint-disable-next-line space-before-function-paren
  const saveWidgetLayout = async () => {
    try {
      const data = await saveWidgetsLayoutService(workspaceId, transformedWidgetData);
      await fetchWidgetLayoutData();
      if (data?.data) {
        setDrawerOpen(false);
        showSuccessToast('Widget layout saved');
      }
      return data;
    } catch {
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

  const onLayoutChange = useCallback(
    (currentLayout: ReactGridLayout.Layout[]) => {
      const widgetsToBeSaved = currentLayout.map((layout: Layout) => {
        const existingWidget = widgets.find((widget) => layout.i === widget.id);
        return {
          id: existingWidget?.id,
          widgetId: existingWidget?.widget?.widgetId || layout.i,
          status: 'Active',
          order: 1,
          config: {
            ...layout
          }
        };
      });

      setTransformedWidgetData(widgetsToBeSaved);
    },
    [widgets]
  );

  const setSelectedDateRange = (option: string) => {
    if (option.toLocaleLowerCase().trim() === 'select') {
      setStartingDate(moment().startOf('week').toISOString());
      setEndingDate(convertEndDate(new Date()));
    }
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
      <div className="flex justify-between mt-10 pb-28">
        <div className="flex relative items-center">
          <div
            className="flex items-center justify-between px-5 w-11.72 h-3.06 border border-borderPrimary rounded-0.6 shadow-shadowInput cursor-pointer "
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
              className="absolute top-12 w-11.72 border border-borderPrimary bg-white dark:bg-secondaryDark   shadow-shadowInput rounded-0.6 "
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
                startDate={startDate}
                endDate={endDate}
                onChange={(update: any) => {
                  setDateRange(update);
                }}
                className="export w-[15.5rem] h-3.06  bg-transparent dark:bg-primaryDark text-dropGray dark:text-inputText shadow-shadowInput rounded-0.6 pl-3 font-Poppins font-semibold text-xs border border-borderPrimary leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-xs placeholder:text-dropGray dark:placeholder:text-inputText placeholder:leading-1.12"
                placeholderText="DD/MM/YYYY - DD/MM/YYYY"
                isClearable={true}
                ref={datePickerRef}
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="absolute right-[1.4rem] top-4 drop-icon">
              <img className="right-6 cursor-pointer" src={calendarIcon} alt="" onClick={() => handleClickDatePickerIcon()} />
            </div>
          </div>
        </div>
        {isDrawerOpen === false ? (
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
          <div
            className="flex justify-between w-11.68 btn-save-modal h-3.12 items-center px-5 rounded-0.3 shadow-connectButtonShadow cursor-pointer"
            onClick={saveWidgetLayout}
          >
            <div className="font-Poppins font-medium text-white leading-5 text-search ml-3">Save Layout</div>
            <div className="brick-icon bg-cover">
              <img src={brickIcon} alt="" />
            </div>
          </div>
        )}
      </div>
      {isDrawerOpen && <SidePanelWidgets widgetKey={widgetKey !== null ? widgetKey : ''} />}
      <ResponsiveReactGridLayout
        autoSize
        preventCollision={false}
        useCSSTransforms
        isDroppable
        measureBeforeMount={false}
        compactType={null}
        onDrop={onDrop}
        allowOverlap={false}
        isDraggable={isDrawerOpen}
        isResizable={isDrawerOpen}
        rowHeight={undefined}
        isBounded
        onLayoutChange={onLayoutChange}
        style={{
          height: `${window.location.href.includes('stage') ? '0px' : '160vh'}`,
          maxHeight: `${window.location.href.includes('stage') ? '0px' : '156.25rem'} `
        }}
      >
        {widgets.map((widget) => (
          <div key={widget.layout.i} data-grid={widget.layout}>
            {widgetListData[widget?.widget?.widgetLocation as keyof typeof widgetListData]}
          </div>
        ))}
      </ResponsiveReactGridLayout>
      {Boolean(widgets?.length) === false && (
        <div className="flex flex-col items-center justify-center fixWidgetNoDataHeight">
          <img src={noWidgetIcon} alt="" className="w-[3.8125rem] h-[3.8125rem]" />
          <div className="font-Poppins font-medium text-tableDuration text-noReports leading-10 pt-5">{`${
            window.location.href.includes('stage') ? 'Widgets coming soon...' : 'No widgets added'
          }`}</div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
