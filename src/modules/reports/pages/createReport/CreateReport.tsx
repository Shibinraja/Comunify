/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import usePlatform from '@/hooks/usePlatform';
import { convertEndDate, convertStartDate } from '@/lib/helper';
import Button from 'common/button';
import Input from 'common/input';
import { alphanumeric_regex } from 'constants/constants';
import { startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subYears } from 'date-fns';
import { Form, Formik } from 'formik';
import {
  createReportInitialValues,
  customReportDateLinkProps,
  CustomReportDateType,
  ReportOptions,
  ScheduleReportDateType,
  ScheduleReportsEnum
} from 'modules/reports/interfaces/reports.interface';
import { ConnectedPlatforms } from 'modules/settings/interface/settings.interface';
// eslint-disable-next-line object-curly-newline
import { ChangeEvent, Fragment, ReactNode, useEffect, useRef, useState, KeyboardEvent } from 'react';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import calendarIcon from '../../../../assets/images/calandar.svg';
import dropdownIcon from '../../../../assets/images/filter-dropdown.svg';
import './CreateReport.css';

const initialValues: Partial<createReportInitialValues> = {
  name: '',
  description: '',
  emails: [],
  schedule: '',
  platform: [''],
  startDate: '',
  endDate: '',
  singleDate: ''
};

const CreateReport = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const [cursor, setCursor] = useState<number>(0);
  const [isReportActive, setIsReportActive] = useState(false);
  const [isPlatformActive, setIsPlatformActive] = useState(false);
  const [checkedRadioId, setCheckedRadioId] = useState<Record<string, unknown>>({ Yes: true });
  const [selectedReport, setSelectedReport] = useState('');
  const [checkedPlatform, setCheckedPlatform] = useState<Record<string, unknown>>({});
  const [checkedAllPlatform, setCheckedAllPlatform] = useState<boolean>(false);
  const [platformId, setPlatformId] = useState<Record<string, unknown>>({});
  const [customDate, setCustomDate] = useState<{ startDate: Date | undefined; endDate: Date | undefined; singleDate: Date | undefined }>({
    startDate: undefined,
    endDate: undefined,
    singleDate: undefined
  });
  const [customDateLink, setCustomDateLink] = useState<Partial<customReportDateLinkProps>>({
    '1day': false,
    '7day': false,
    '1month': false,
    '1year': false
  });

  const reportUpdateValuesData = JSON.parse(localStorage.getItem('reportUpdateValues')!);
  const reportValuesData = JSON.parse(localStorage.getItem('reportValues')!);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const reportOptionRef = useRef<HTMLDivElement>(null);
  const formikRef: any = useRef();
  const reportRef = useRef<HTMLLIElement>(null);
  const datePickerRefFrom = useRef<ReactDatePicker>(null);
  const datePickerRefTo = useRef<ReactDatePicker>(null);

  const { PlatformsConnected } = usePlatform();
  const scheduledReportOptions = [...ReportOptions].splice(0, 3);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (reportUpdateValuesData && !formikRef?.current?.values.name) {
      formikRef?.current?.resetForm({
        values: {
          name: reportUpdateValuesData.name,
          description: reportUpdateValuesData.description,
          ...{ emails: reportUpdateValuesData.workspaceReportSettings[0].emailRecipients.map((email: { email: string }) => email.email) },
          ...(reportUpdateValuesData?.workspaceReportSettings[0]?.createdAt
            ? { startDate: reportUpdateValuesData?.workspaceReportSettings[0]?.createdAt }
            : {}),
          ...(reportUpdateValuesData?.workspaceReportSettings[0]?.reportEndAt
            ? { endDate: reportUpdateValuesData?.workspaceReportSettings[0]?.reportEndAt }
            : {}),
          ...(reportUpdateValuesData?.workspaceReportSettings[0]?.scheduleRepeat
            ? { schedule: reportUpdateValuesData?.workspaceReportSettings[0]?.scheduleRepeat }
            : { schedule: '' })
        }
      });
      const reportResponseValues = reportUpdateValuesData?.workspaceReportSettings[0];

      reportResponseValues?.reportPlatforms?.map(
        (platform: { workspacePlatformId: string; workspacePlatform: { platformSettings: { platforms: { id: string } } } }) => {
          const connectedPlatformId = platform.workspacePlatformId;
          const platformId = platform.workspacePlatform.platformSettings.platforms.id;
          setCheckedPlatform((preValue) => ({ ...preValue, [connectedPlatformId]: true }));
          setPlatformId((preValue) => ({ ...preValue, [platformId]: true }));
        }
      );
      if (reportResponseValues?.scheduleRepeat !== ScheduleReportDateType['NoSchedule']) {
        setCheckedRadioId({ ['Yes']: true });
        const scheduleReportId = reportResponseValues?.scheduleRepeat;
        handleSelectedReport(ScheduleReportDateType[scheduleReportId]);
      } else {
        setCheckedRadioId({ ['No']: true });
        handleSelectedReport('');
        setCustomDate((prevDate) => ({
          ...prevDate,
          startDate: new Date(reportResponseValues.reportStartAt),
          endDate: new Date(reportResponseValues.reportEndAt),
          singleDate: undefined
        }));
      }
    }
  }, [reportUpdateValuesData]);

  useEffect(() => {
    if (reportValuesData && !formikRef?.current?.values.name) {
      formikRef.current.resetForm({
        values: {
          name: reportValuesData.name,
          description: reportValuesData.description,
          emails: reportValuesData.emails,
          ...(reportValuesData.startDate ? { startDate: reportValuesData.startDate } : {}),
          ...(reportValuesData.endDate ? { endDate: reportValuesData.endDate } : {})
        }
      });
      reportValuesData.platform.map((platformId: string) => setCheckedPlatform((preValue) => ({ ...preValue, [platformId]: true })));
      reportValuesData.platformId.map((platformId: string) => setPlatformId((preValue) => ({ ...preValue, [platformId]: true })));
      if (reportValuesData?.schedule !== ScheduleReportDateType['NoSchedule']) {
        setCheckedRadioId({ ['Yes']: true });
        const scheduleReportId = reportValuesData?.schedule;
        handleSelectedReport(ScheduleReportDateType[scheduleReportId]);
      } else {
        setCheckedRadioId({ ['No']: true });
        handleSelectedReport('');
        setCustomDate((prevDate) => ({
          ...prevDate,
          startDate: new Date(reportValuesData.startDate),
          endDate: new Date(reportValuesData.endDate),
          singleDate: undefined
        }));
      }
    }
  }, [reportValuesData]);

  useEffect(() => {
    const checkPlatform: Array<string> = [];
    if (Object.keys(checkedPlatform).length > 0) {
      Object.keys(checkedPlatform).map((platform: string) => {
        if (checkedPlatform[platform] === true) {
          checkPlatform.push(platform);
        }
      });
    }
    // Formik ref to enable to make the custom dropdown with field touch and set the value for the fields.
    formikRef?.current?.setFieldValue('platform', checkPlatform, true);
  }, [checkedPlatform]);

  useEffect(() => {
    if (customDate.singleDate) {
      formikRef?.current?.setValues({
        ...formikRef?.current?.values,
        singleDate: convertStartDate(customDate.singleDate),
        startDate: convertStartDate(customDate.singleDate),
        endDate: convertEndDate(customDate.singleDate)
      });
      // formikRef?.current?.setFieldValue('singleDate', customDate.startDate ? customDate.startDate : customDate.singleDate, true);
    }
  }, [customDate.singleDate]);

  useEffect(() => {
    if (isReportActive) {
      reportRef?.current?.focus();
    }
  }, [isReportActive]);

  const handleSelectedReport = (selectedReport: string): void => {
    // Formik ref to enable to make the custom dropdown with field touch and set the value for the fields.
    formikRef?.current?.setFieldTouched('schedule');
    formikRef?.current?.setFieldValue('schedule', selectedReport);
    setSelectedReport(selectedReport === '' ? 'NoSchedule' : selectedReport);
    setIsReportActive(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setIsPlatformActive(false);
    }

    if (reportOptionRef && reportOptionRef.current && !reportOptionRef.current.contains(event.target as Node)) {
      setIsReportActive(false);
    }
  };

  const handleClickDatePickerIcon = (type: string) => {
    if (type === 'start') {
      const datePickerElement = datePickerRefFrom.current;
      datePickerElement?.setFocus();
    } else {
      const datePickerElement = datePickerRefTo.current;
      datePickerElement?.setFocus();
    }
  };

  // Function to change the Primary Member List
  const handleRadioBtn = (event: ChangeEvent<HTMLInputElement>) => {
    const checked_id: string = event.target.name;
    setCheckedRadioId({ [checked_id]: event.target.checked });
  };

  const handlePlatformAllCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    PlatformsConnected.forEach((platformId) => {
      setCheckedPlatform((preValue) => ({ ...preValue, [platformId.id]: event.target.checked }));
      setPlatformId((preValue) => ({ ...preValue, [platformId.platformId]: event.target.checked }));
    });
    setCheckedAllPlatform(event.target.checked);
  };

  const handlePlatformsCheckBox = (event: ChangeEvent<HTMLInputElement>, platformConnectedId: string, platformId: string) => {
    const platform: string = platformConnectedId;
    setCheckedPlatform((preValue) => ({ ...preValue, [platform]: event.target.checked }));
    setPlatformId((preValue) => ({ ...preValue, [platformId]: event.target.checked }));
    formikRef?.current?.setFieldTouched('platform');
    setCheckedAllPlatform(false);
  };

  const selectCustomBetweenDate = (event: ChangeEvent<Date>, date: Date, dateTime: string) => {
    event.stopPropagation();
    setCustomDateLink({});
    formikRef?.current?.setFieldTouched('startDate', true);
    formikRef?.current?.setFieldTouched('endDate', true);

    if (date && dateTime === 'start') {
      setCustomDate((prevDate) => ({ ...prevDate, startDate: !date ? undefined : date, singleDate: undefined }));
    }

    if (date && dateTime === 'end') {
      setCustomDate((prevDate) => ({ ...prevDate, endDate: !date ? undefined : date, singleDate: undefined }));
    }
    handleSelectedReport('NoSchedule');
  };

  // Function to convert the day and subtract based on no of days/ months.
  const selectCustomDate = (date: string) => {
    const todayDate = new Date();
    setCustomDate({ startDate: undefined, endDate: undefined, singleDate: undefined });
    handleSelectedReport('NoSchedule');
    formikRef?.current?.setFieldTouched('startDate');
    if (date === CustomReportDateType.Day) {
      setCustomDate((prevDate) => ({ ...prevDate, singleDate: subDays(todayDate, 1) }));
      setCustomDateLink({ [date]: true });
    }
    if (date === CustomReportDateType.Week) {
      setCustomDate((prevDate) => ({ ...prevDate, singleDate: subDays(todayDate, 7) }));
      setCustomDateLink({ [date]: true });
    }
    if (date === CustomReportDateType.Month) {
      setCustomDate((prevDate) => ({ ...prevDate, singleDate: subMonths(todayDate, 1) }));
      setCustomDateLink({ [date]: true });
    }
    if (date === CustomReportDateType.Year) {
      setCustomDate((prevDate) => ({ ...prevDate, singleDate: subYears(todayDate, 1) }));
      setCustomDateLink({ [date]: true });
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    let emailId: string | string[] = event.target.value;
    emailId = emailId.split(',');
    formikRef?.current?.setFieldValue('emails', emailId);
  };

  const handleSubmit = (values: Partial<createReportInitialValues>): void => {
    const newValues = { ...values };
    const checkPlatform: Array<string> = [];
    const checkPlatformId: Array<string> = [];

    if (Object.keys(checkedPlatform).length > 0) {
      Object.keys(checkedPlatform).map((platform: string) => {
        if (checkedPlatform[platform] === true) {
          checkPlatform.push(platform);
        }
      });
    }

    if (Object.keys(platformId).length > 0) {
      Object.keys(platformId).map((platform: string) => {
        if (platformId[platform] === true) {
          checkPlatformId.push(platform);
        }
      });
    }
    delete newValues['singleDate'];
    newValues['schedule'] = ScheduleReportDateType[selectedReport as unknown as ScheduleReportDateType];
    newValues['platform'] = checkPlatform;
    (newValues['startDate'] as string | undefined) = customDate.startDate
      ? convertStartDate(customDate.startDate)
      : customDate.singleDate
      ? convertStartDate(customDate.singleDate)
      : convertEndDate(new Date());
    (newValues['endDate'] as string | undefined) = customDate.endDate
      ? convertEndDate(customDate.endDate)
      : customDateLink[CustomReportDateType.Day]
      ? customDate.singleDate && convertEndDate(customDate.singleDate)
      : convertEndDate(new Date());
    newValues['platformId'] = checkPlatformId;

    if (selectedReport === 'NoSchedule') {
      delete newValues['emails'];
    } else if (!newValues['emails'] || (newValues['emails'] as Array<string>).length < 1) {
      delete newValues['emails'];
    }
    if (checkedRadioId[ScheduleReportsEnum.Yes]) {
      const todayDate = new Date();
      if (Number(newValues['schedule']) === ScheduleReportDateType.Daily) {
        newValues['startDate'] = convertStartDate(startOfDay(todayDate));
      }
      if (Number(newValues['schedule']) === ScheduleReportDateType.Weekly) {
        newValues['startDate'] = convertStartDate(startOfWeek(todayDate, { weekStartsOn: 1 }));
      }
      if (Number(newValues['schedule']) === ScheduleReportDateType.Monthly) {
        newValues['startDate'] = convertStartDate(startOfMonth(todayDate));
      }
      newValues['endDate'] = convertEndDate(todayDate);
    }

    if (reportUpdateValuesData) {
      localStorage.setItem('reportValues', JSON.stringify(newValues));
      navigate(
        `/${workspaceId}/reports/report-widgets?reportId=${reportUpdateValuesData.id}&startDate=${newValues.startDate}&endDate=${newValues.endDate}`
      );
    }

    if (!reportUpdateValuesData) {
      localStorage.setItem('reportValues', JSON.stringify(newValues));
      navigate(`/${workspaceId}/reports/report-widgets?startDate=${newValues.startDate}&endDate=${newValues.endDate}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && cursor > 0) {
      setCursor((prevState: number) => prevState - 1);
    }
    if (e.keyCode === 40 && cursor < scheduledReportOptions.length - 1) {
      setCursor((prevState: number) => prevState + 1);
    }
    if (e.keyCode === 13) {
      handleSelectedReport(scheduledReportOptions[cursor].name);
      setIsReportActive(false);
    }
  };

  const handleTabChange = (e: KeyboardEvent<HTMLDivElement>, dropdownEvent: string) => {
    if (e.keyCode === 9) {
      if (dropdownEvent === 'platform') {
        setIsPlatformActive(false);
      }
      if (dropdownEvent === 'schedule') {
        setIsReportActive(false);
      }
    } else {
      if (dropdownEvent === 'platform') {
        setIsPlatformActive(true);
      }
      if (dropdownEvent === 'schedule') {
        if (e.keyCode === 13) {
          setIsReportActive(false);
        }
        if (e.keyCode !== 13) {
          setIsReportActive(true);
        }
      }
    }
  };

  const navigateToReports = () => {
    navigate(`/${workspaceId}/reports`);
  };

  return (
    <div className="report mt-4.56 ">
      <div className="flex flex-col">
        <h3 className="font-Poppins font-semibold text-infoBlack leading-2.18 text-infoData">
          {reportUpdateValuesData ? 'Edit Report' : 'Create Report'}
        </h3>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnChange={true}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .required('Report name is required')
              .min(4, 'Report name should be more than 4 character long')
              .max(25, 'Report name should not exceed 25 characters')
              .matches(alphanumeric_regex, 'Report name is not valid')
              .trim(),
            description: Yup.string()
              .max(250, 'Description should not exceed 250 characters')
              .matches(alphanumeric_regex, 'Description is not valid')
              .trim(),
            schedule: Yup.lazy((value: string) => {
              if (Object.keys(checkedRadioId).includes('Yes') && value === 'NoSchedule') {
                return Yup.string().required('Schedule Report is required');
              }

              if (Object.keys(checkedRadioId).includes('No') && value === 'NoSchedule') {
                return Yup.string().notRequired();
              }

              if (Object.keys(checkedRadioId).includes('No') && !value) {
                return Yup.string().notRequired();
              }

              if (!value) {
                return Yup.string().required('Schedule Report is required');
              }

              return Yup.string().notRequired();
            }),
            emails: Yup.array()
              .transform(function (value, originalValue) {
                if (this.isType(value) && value !== null) {
                  return value;
                }
                return originalValue ? originalValue.split(/[\s,]+/) : [];
              })
              .of(Yup.string().email(({ value }) => `${value} is not a valid email`)),
            platform: Yup.array().min(1, 'Platform is required'),
            startDate: Yup.lazy((value) => {
              if (Object.keys(checkedRadioId).includes('Yes') && !value) {
                return Yup.string().notRequired();
              }
              if (!value) {
                return Yup.string().required('Custom Date is required');
              }

              return Yup.string().notRequired();
            }),
            endDate: Yup.lazy((value) => {
              if (Object.keys(checkedRadioId).includes('Yes') && !value) {
                return Yup.string().notRequired();
              }
              if (!value) {
                return Yup.string().required('Custom Date is required');
              }

              return Yup.string().notRequired();
            })
            // singleDate: Yup.string().when(['startDate', 'endDate'], {
            //   is: (startDate: string, endDate: string) =>
            //     // console.log('err', startDate, endDate);
            //     !startDate || !endDate,
            //   then: Yup.lazy(() => {
            //     if (Object.keys(checkedRadioId).includes('Yes')) {
            //       return Yup.string().notRequired();
            //     }
            //     return Yup.string().required('Custom Date is required');
            //   }),
            //   otherwise: Yup.string().notRequired()
            // })
          })}
        >
          {({ handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }): JSX.Element => (
            <Form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 relative mt-1.8 w-full  xl:w-[686px] 3xl:w-1/2">
                <div className="flex flex-col w-full">
                  <label htmlFor="name" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
                    Report Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="reportNameId"
                    className="w-full h-3.06 mt-0.375 shadow-reportInput text-trial font-Poppins rounded-0.3 focus:outline-none p-3 placeholder:font-Poppins placeholder:text-thinGray placeholder:text-trial placeholder:font-normal placeholder:leading-1.31 app-result-card-border"
                    placeholder="Report Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    errors={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </div>
                <div className="flex flex-col ml-5 w-20.5 2xl:w-full">
                  <label htmlFor="description" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
                    Description
                  </label>
                  <Input
                    type="text"
                    name="description"
                    id="descriptionId"
                    className="w-full h-3.06 mt-0.375 text-trial font-Poppins shadow-reportInput rounded-0.3 focus:outline-none p-3 placeholder:font-Poppins placeholder:text-thinGray placeholder:text-trial placeholder:font-normal placeholder:leading-1.31 app-result-card-border"
                    placeholder="Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    errors={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </div>
                <div className="flex flex-row mt-1.8 w-20.5">
                  <label htmlFor="reportName" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
                    Schedule the report ?
                  </label>
                  <label htmlFor={'confirmSchedule'} className="flex items-center pl-1.56">
                    <input
                      type="radio"
                      className="hidden peer"
                      id={'confirmSchedule'}
                      value={'yes'}
                      name={'Yes'}
                      checked={(checkedRadioId[ScheduleReportsEnum.Yes] as boolean) || false}
                      onChange={handleRadioBtn}
                    />{' '}
                    <span className="w-3 h-3 mr-1.5 border text-infoBlack font-Poppins text-card leading-1.31 border-[#ddd] rounded-full inline-flex peer-checked:bg-[#ABCF6B]"></span>
                    Yes
                  </label>
                  <label htmlFor={'cancelSchedule'} className="flex items-center pl-1.56">
                    <input
                      type="radio"
                      className="hidden peer"
                      id={'cancelSchedule'}
                      value={'no'}
                      name={'No'}
                      checked={(checkedRadioId[ScheduleReportsEnum.No] as boolean) || false}
                      onChange={handleRadioBtn}
                    />{' '}
                    <span className="w-3 h-3 mr-1.5 border text-infoBlack font-Poppins text-card leading-1.31 border-[#ddd] rounded-full inline-flex peer-checked:bg-[#ABCF6B]"></span>
                    No
                  </label>
                </div>
                <div className="flex flex-col ml-5 "></div>
                {(checkedRadioId[ScheduleReportsEnum.No] as ReactNode) && (
                  <Fragment>
                    <div className=" flex-flex-col mt-1.8">
                      <label htmlFor="chooseCondition" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
                        Choose Condition
                      </label>
                      <div className="flex gap-[0.63rem] mt-0.375 ">
                        <div
                          className={`w-4.06 3xl:w-1/4 h-3.06 app-result-card-border shadow-reportInput rounded-0.3 flex items-center justify-center font-Poppins font-semibold text-card text-dropGray leading-1.12 cursor-pointer ${
                            customDateLink[CustomReportDateType.Day] ? 'border-gradient-rounded-member' : 'app-input-card-border'
                          } `}
                          onClick={() => selectCustomDate('1day')}
                        >
                          1 Day
                        </div>
                        <div
                          className={`w-[71px] 3xl:w-1/4 h-3.06 app-result-card-border shadow-reportInput rounded-0.3 flex items-center justify-center font-Poppins font-semibold text-card text-dropGray leading-1.12 cursor-pointer ${
                            customDateLink[CustomReportDateType.Week] ? 'border-gradient-rounded-member' : 'app-input-card-border'
                          } `}
                          onClick={() => selectCustomDate('7day')}
                        >
                          1 Week
                        </div>
                        <div
                          className={`w-[75px] 3xl:w-1/4 h-3.06 app-result-card-border shadow-reportInput rounded-0.3 flex items-center justify-center font-Poppins font-semibold text-card text-dropGray leading-1.12 cursor-pointer ${
                            customDateLink[CustomReportDateType.Month] ? 'border-gradient-rounded-member' : 'app-input-card-border'
                          } `}
                          onClick={() => selectCustomDate('1month')}
                        >
                          1 Month
                        </div>
                        <div
                          className={`w-[75px] 3xl:w-1/4 h-3.06 app-result-card-border shadow-reportInput rounded-0.3 flex items-center justify-center font-Poppins font-semibold text-card text-dropGray leading-1.12 cursor-pointer ${
                            customDateLink[CustomReportDateType.Year] ? 'border-gradient-rounded-member' : 'app-input-card-border'
                          }`}
                          onClick={() => selectCustomDate('1year')}
                        >
                          1 Year
                        </div>
                      </div>
                      {Boolean((touched.startDate && errors.startDate) || (touched.endDate && errors.endDate)) && (
                        <p className="text-lightRed font-normal text-error relative font-Inter mt-0.287  pl-1">
                          {errors?.startDate || errors?.endDate}
                        </p>
                      )}
                    </div>
                    <div className="mt-1.8 flex-flex-col pl-5">
                      <label htmlFor="name" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
                        Custom Date
                      </label>
                      <div className="flex mt-0.375 gap-[0.64rem] ">
                        <div className="relative flex items-center w-[158.76px] 3xl:w-1/2 ">
                          <DatePicker
                            selected={customDate.startDate}
                            onChange={(date: Date, event: ChangeEvent<Date>) => {
                              selectCustomBetweenDate(event, date, 'start');
                              setFieldValue('startDate', date);
                            }}
                            className="w-9.92 2xl:w-full h-3.06 app-result-card-border shadow-reportInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                            placeholderText="From"
                            ref={datePickerRefFrom}
                            dateFormat="dd/MM/yyyy"
                            name="fromDate"
                            onBlur={handleBlur}
                            maxDate={new Date()}
                          />
                          <img
                            className="absolute icon-holder right-4 cursor-pointer"
                            src={calendarIcon}
                            alt=""
                            onClick={() => handleClickDatePickerIcon('start')}
                          />
                        </div>
                        <div className="relative flex items-center w-[158.76px] 3xl:w-1/2">
                          <DatePicker
                            selected={customDate.endDate}
                            onChange={(date: Date, event: ChangeEvent<Date>) => {
                              selectCustomBetweenDate(event, date, 'end');
                              setFieldValue('endDate', date);
                            }}
                            className="w-9.92 2xl:w-full h-3.06 app-result-card-border shadow-reportInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                            placeholderText="To"
                            ref={datePickerRefTo}
                            dateFormat="dd/MM/yyyy"
                            name="toDate"
                            onBlur={handleBlur}
                            minDate={customDate.startDate}
                            maxDate={new Date()}
                          />
                          <img
                            className="absolute icon-holder right-4 cursor-pointer"
                            src={calendarIcon}
                            alt=""
                            onClick={() => handleClickDatePickerIcon('end')}
                          />
                        </div>
                      </div>
                    </div>
                  </Fragment>
                )}
                <div className="mt-5 flex flex-col w-full relative" ref={dropDownRef}>
                  <label htmlFor="name" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
                    Choose Platform
                  </label>
                  <div
                    className={`w-full h-3.06 app-result-card-border focus:outline-none flex items-center px-3 mt-0.375 shadow-reportInput rounded-0.3 font-Poppins font-normal text-trial text-thinGray leading-1.31 relative  ${
                      reportUpdateValuesData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={() => setIsPlatformActive((prevActive) => !prevActive)}
                    onBlur={() => setFieldTouched('platform')}
                    onKeyDown={(e) => handleTabChange(e, 'platform')}
                  >
                    <input className="w-[1px] border-none focus:outline-none" type="text" />
                    Select
                    <div className="absolute right-4">
                      <img src={dropdownIcon} alt="" className={isPlatformActive ? 'rotate-0' : 'rotate-180'} />
                    </div>
                  </div>
                  {isPlatformActive && (
                    <div className="flex-flex-col  app-result-card-border box-border w-full rounded-0.3 shadow-reportInput cursor-pointer absolute top-[4.8rem] bg-white z-40">
                      <div
                        className={`flex items-center gap-2 hover:bg-signUpDomain  transition ease-in duration-100 p-3 h-[43px]  ${
                          reportUpdateValuesData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <div>
                          <input
                            type="checkbox"
                            className={`checkbox ${reportUpdateValuesData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            id="all"
                            name="all"
                            onChange={(event) => handlePlatformAllCheckBox(event)}
                            checked={checkedAllPlatform}
                            disabled={reportUpdateValuesData ? true : false}
                          />
                        </div>
                        <label
                          className={`font-Poppins font-normal text-searchBlack leading-1.31 text-trial  ${
                            reportUpdateValuesData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          htmlFor="all"
                        >
                          All
                        </label>
                      </div>
                      {PlatformsConnected &&
                        PlatformsConnected?.map((platform: ConnectedPlatforms) => (
                          <Fragment key={platform.id}>
                            <div
                              className={`flex items-center gap-2 hover:bg-signUpDomain  transition ease-in duration-100 p-3 h-[43px] ${
                                reportUpdateValuesData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              <div>
                                <input
                                  type="checkbox"
                                  className={`checkbox ${reportUpdateValuesData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                  id={platform.id as string}
                                  name={platform.id as string}
                                  checked={(checkedPlatform[platform.id] as boolean) || false}
                                  onChange={(event) => handlePlatformsCheckBox(event, platform.id, platform.platformId)}
                                  disabled={reportUpdateValuesData ? true : false}
                                />
                              </div>
                              <label
                                className={`font-Poppins font-normal text-searchBlack leading-1.31 text-trial  ${
                                  reportUpdateValuesData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                                htmlFor={platform.id as string}
                              >
                                {platform?.name}
                              </label>
                            </div>
                          </Fragment>
                        ))}
                    </div>
                  )}
                  {Boolean(touched.platform && errors.platform) && (
                    <p className="text-lightRed font-normal text-error relative font-Inter mt-0.287  pl-1">{errors?.platform}</p>
                  )}
                </div>

                {(checkedRadioId[ScheduleReportsEnum.Yes] as ReactNode) && (
                  <Fragment>
                    <div
                      className="mt-5 flex flex-col ml-5 w-20.5 2xl:w-full relative"
                      ref={reportOptionRef}
                      onBlur={() => setFieldTouched('schedule')}
                      onKeyDown={(e) => handleTabChange(e, 'schedule')}
                    >
                      <label htmlFor="name" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
                        Schedule Report
                      </label>
                      <div
                        onClick={() => setIsReportActive(!isReportActive)}
                        className="relative w-full h-3.06 app-result-card-border focus:outline-none flex items-center px-3 mt-0.375 shadow-reportInput rounded-0.3 font-Poppins font-normal text-trial text-thinGray leading-1.31 cursor-pointer "
                      >
                        <input className="w-[1px] border-none focus:outline-none" type="text" />
                        {selectedReport === 'NoSchedule' ? 'Select' : !selectedReport ? 'Select' : selectedReport}
                        <div className="absolute right-4">
                          <img src={dropdownIcon} alt="" className={isReportActive ? 'rotate-0' : 'rotate-180'} />
                        </div>
                      </div>
                      {Boolean(touched.schedule && errors.schedule) && (
                        <p className="text-lightRed font-normal text-error relative font-Inter mt-0.287  pl-1">{errors?.schedule}</p>
                      )}
                      {isReportActive && (
                        <div className="absolute w-full bg-white app-result-card-border box-border rounded-0.3 shadow-reportInput z-10">
                          <ul id="report" className="flex flex-col justify-center">
                            {scheduledReportOptions?.map((options, index: number) => (
                              <li
                                ref={reportRef}
                                onKeyDown={handleKeyDown}
                                tabIndex={0}
                                className={`${
                                  cursor === index ? 'bg-signUpDomain' : null
                                } h-3.06 font-Poppins font-normal text-searchBlack text-trial leading-1.31 flex items-center p-3 hover:bg-signUpDomain transition ease-in duration-100 focus:outline-none`}
                                onClick={() => {
                                  handleSelectedReport(options.name);
                                }}
                                defaultValue={selectedReport}
                                key={options.id}
                              >
                                {options.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className={`mt-5 flex flex-col w-full  ${touched.emails && errors.emails ? 'report-email' : ' '}`}>
                      <label htmlFor="emails" className="text-trial font-Poppins text-infoBlack font-normal leading-1.31">
                        Alternate Recipient Mail IDs
                      </label>
                      <Input
                        type="text"
                        name="emails"
                        id="email-id"
                        placeholder="Email Id"
                        className="w-full h-3.06 mt-0.375 text-trial font-Poppins shadow-reportInput rounded-0.3 focus:outline-none p-3 placeholder:font-Poppins placeholder:text-thinGray placeholder:text-trial placeholder:font-normal placeholder:leading-1.31 app-result-card-border"
                        onBlur={handleBlur}
                        onChange={handleEmailChange}
                        value={values.emails}
                        errors={Boolean(touched.emails && errors.emails)}
                        helperText={touched.emails && errors.emails}
                      />
                    </div>
                  </Fragment>
                )}
              </div>

              <div className="buttons flex justify-end w-full mt-20 mr-10">
                <Button
                  type="button"
                  text="CANCEL"
                  className="cancel cursor-pointer font-Poppins font-medium text-error leading-5 border-cancel text-thinGray box-border rounded w-6.875 h-3.12"
                  onClick={navigateToReports}
                />
                <Button
                  type="submit"
                  text="NEXT"
                  className="ml-2.5 cursor-pointer font-Poppins font-medium text-error leading-5 btn-save-modal text-white w-7.68 h-3.12 border-none rounded shadow-contactBtn"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateReport;
