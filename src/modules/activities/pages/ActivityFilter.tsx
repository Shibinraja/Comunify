/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useDebounce from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import { convertEndDate, convertStartDate } from '@/lib/helper';
import Button from 'common/button';
import settingsSlice from 'modules/settings/store/slice/settings.slice';
import {
  ChangeEvent, FC, Fragment, useEffect, useMemo, useRef, useState
} from 'react';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import { useParams } from 'react-router-dom';
import calendarIcon from '../../../assets/images/calandar.svg';
import downArrow from '../../../assets/images/filter-dropdown.svg';
import filterDownIcon from '../../../assets/images/report-dropdown.svg';
import searchIcon from '../../../assets/images/search.svg';
import usePlatform from '../../../hooks/usePlatform';
import { PlatformResponse, TagResponseData } from '../../settings/interface/settings.interface';
import activitiesSlice from '../store/slice/activities.slice';
import { ActivityStreamTypesProps } from './activity.types';

const ActivityFilter: FC<ActivityStreamTypesProps> = ({ page, limit, activityFilterExport, searchText, onPageChange }) => {
  const { workspaceId } = useParams();
  const dispatch = useAppDispatch();
  const [isFilterDropdownActive, setIsFilterDropdownActive] = useState<boolean>(false);
  const [isTagActive, setTagActive] = useState<boolean>(false);
  const [isActiveBetween, setActiveBetween] = useState<boolean>(false);
  const [isPlatformActive, setPlatformActive] = useState<boolean>(true);
  const [checkedPlatform, setCheckedPlatform] = useState<Record<string, unknown>>({});
  const [checkedTags, setCheckedTags] = useState<Record<string, unknown>>({});
  const [tagSearchText, setTagSearchText] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [filterCount, setFilterCount] = useState<number>(0);
  const [saveRefObject, setSaveRefObject] = useState<HTMLDivElement | null>(null);

  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const datePickerRefStart = useRef<ReactDatePicker>(null);
  const datePickerRefEnd = useRef<ReactDatePicker>(null);

  const debouncedTagValue = useDebounce(tagSearchText, 300);

  const { data: TagFilterResponse } = useAppSelector((state) => state.settings.TagFilterResponse);
  const { PlatformFilterResponse } = usePlatform();

  const ActivityFilterList = Object.values(checkedPlatform).concat(Object.values(checkedTags));

  const loader = useSkeletonLoading(activitiesSlice.actions.getActiveStreamData.type);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedTagValue) {
      getFilteredMembersTagList(1, debouncedTagValue);
    }
  }, [debouncedTagValue]);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    setSaveRefObject(dropDownRef.current);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setIsFilterDropdownActive(false);
    }
  };

  const handlePlatformActive = (val: boolean) => {
    setPlatformActive(val);
  };

  const handleTagActive = (val: boolean) => {
    setTagActive(val);
  };

  const handleFilterDropdown = (): void => {
    setIsFilterDropdownActive((prev) => !prev);
    dispatch(
      settingsSlice.actions.tagFilterData({
        settingsQuery: { page: 1, limit, tags: { searchedTags: '', checkedTags: '' } },
        workspaceId: workspaceId!
      })
    );
  };

  const handleActiveBetween = (val: boolean) => {
    setActiveBetween(val);
  };

  const handlePlatformsCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const platform: string = event.target.name;
    setCheckedPlatform((preValue) => ({ ...preValue, [platform]: event.target.checked }));
  };

  const handleTagsCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const tag: string = event.target.name;
    setCheckedTags((preValue) => ({ ...preValue, [tag]: event.target.checked }));
  };

  const handleTagSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (!searchText) {
      getFilteredMembersTagList(1, '');
    }
    setTagSearchText(searchText);
  };

  const selectActiveBetweenDate = (event: ChangeEvent<Date>, date: Date, dateTime: string) => {
    event.stopPropagation();
    dropDownRef.current = saveRefObject;
    if (dateTime === 'start') {
      setStartDate(date);
    }
    if (dateTime === 'end') {
      setEndDate(date);
    }
  };

  const handleClickDatePickerIcon = (type: string) => {
    if (type === 'start') {
      const datePickerElement = datePickerRefStart.current;
      datePickerElement!.setFocus();
    }

    if (type === 'end') {
      const datePickerElement = datePickerRefEnd.current;
      datePickerElement!.setFocus();
    }
  };

  const getFilteredMembersTagList = (pageNumber: number, tagText: string) => {
    dispatch(
      settingsSlice.actions.tagFilterData({
        settingsQuery: {
          page: pageNumber,
          limit,
          tags: { searchedTags: tagText, checkedTags: '' }
        },
        workspaceId: workspaceId!
      })
    );
  };

  const disableApplyBtn = useMemo(() => {
    if (startDate === undefined && endDate === undefined && ActivityFilterList.length === 0) {
      return true;
    }

    if (startDate && endDate) {
      return false;
    }

    if (startDate || endDate) {
      return true;
    }
    return false;
  }, [startDate, endDate, ActivityFilterList]);

  const submitFilterChange = (): void => {
    const checkPlatform: Array<string> = [];
    const checkTags: Array<string> = [];

    if (ActivityFilterList[0] === Boolean(false)) {
      setCheckedPlatform({});
      setCheckedTags({});
    }

    if (Object.keys(checkedPlatform).length > 0) {
      Object.keys(checkedPlatform).map((platform: string) => {
        if (checkedPlatform[platform] === true) {
          checkPlatform.push(platform);
        }
      });
    }

    if (Object.keys(checkedTags).length > 0) {
      Object.keys(checkedTags).map((tag: string) => {
        if (checkedTags[tag] === true) {
          checkTags.push(tag);
        }
      });
    }

    activityFilterExport({
      checkTags: checkTags.toString(),
      checkPlatform: checkPlatform.toString(),
      endDate: endDate && convertEndDate(endDate!),
      startDate: startDate && convertStartDate(startDate!)
    });

    if (!disableApplyBtn) {
      dispatch(
        activitiesSlice.actions.getActiveStreamData({
          activeStreamQuery: {
            page,
            limit,
            search: searchText,
            tags: { searchedTags: '', checkedTags: checkTags.toString() },
            platforms: checkPlatform.toString(),
            'activity.lte': endDate && convertEndDate(endDate!),
            'activity.gte': startDate && convertStartDate(startDate!)
          },
          workspaceId: workspaceId!
        })
      );
      onPageChange(1);
    }
    handleFilterDropdown();
  };

  useEffect(() => {
    handleFilterCount();
  }, [checkedPlatform, checkedTags]);

  const handleFilterCount = () => {
    const getFilterCount = (filterObject: any) =>
      Object.entries(filterObject).reduce((preValue, arr) => {
        let count: number = preValue;
        if (arr[1] === true) {
          count++;
        }
        return count;
      }, 0);

    const dateEntered = startDate || endDate ? 1 : 0;

    const count = dateEntered + getFilterCount(checkedPlatform) + getFilterCount(checkedTags);
    setFilterCount(count);
  };

  return (
    <div className="relative mr-5" ref={dropDownRef}>
      <div
        className="flex justify-between items-center px-1.08 app-input-card-border rounded-0.6 box-border w-9.59 h-3.06 cursor-pointer bg-white "
        onClick={handleFilterDropdown}
      >
        <div className="box-border flex rounded-0.6 shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12">
          Filters
          <p className="ml-1 bg-signUpDomain px-2 w-content rounded-lg text-memberDay">{`${filterCount}`}</p>
        </div>{' '}
        <div>
          <img src={filterDownIcon} alt="" className={isFilterDropdownActive ? 'rotate-180' : 'rotate-0'} />
        </div>
      </div>
      {isFilterDropdownActive && (
        <div className="absolute app-result-card-border box-border bg-white rounded-0.3 w-16.56 shadow-shadowInput z-40 pb-1.56 ">
          <div className="flex flex-col ">
            <div
              className="flex justify-between items-center app-result-card-border w-full box-border bg-signUpDomain h-3.06 px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handlePlatformActive(isPlatformActive ? false : true);
                handleActiveBetween(false);
                handleTagActive(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Choose platform</div>
              <div>
                <img src={downArrow} alt="" className={isPlatformActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isPlatformActive && (
              <div className="flex flex-col gap-y-5 p-3 max-h-[10rem] overflow-scroll">
                {PlatformFilterResponse &&
                  PlatformFilterResponse.map(
                    (platform: PlatformResponse, index: number) =>
                      platform?.isConnected && (
                        <div className="flex items-center" key={index}>
                          <div className="mr-2">
                            <input
                              type="checkbox"
                              className="checkbox"
                              id={platform.id as string}
                              name={platform.name as string}
                              checked={(checkedPlatform[platform.name] as boolean) || false}
                              onChange={handlePlatformsCheckBox}
                            />
                          </div>
                          <label
                            className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial cursor-pointer"
                            htmlFor={platform.id as string}
                          >
                            {platform?.name}
                          </label>
                        </div>
                      )
                  )}
              </div>
            )}

            <div
              className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06 px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handleTagActive(isTagActive ? false : true);
                handlePlatformActive(false);
                handleActiveBetween(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Tags</div>
              <div>
                <img src={downArrow} alt="" className={isTagActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isTagActive && (
              <div>
                <div className="flex relative items-center pt-2 pb-3">
                  <input
                    type="text"
                    name="search"
                    id="searchId"
                    className="inputs mx-auto focus:outline-none px-3 box-border bg-white shadow-shadowInput rounded-0.6 h-2.81 w-15.06 placeholder:text-searchGray placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.12"
                    placeholder="Search Tags"
                    onChange={handleTagSearchTextChange}
                  />
                  <div className="absolute right-5 w-0.78 h-0.75  z-40">
                    <img src={searchIcon} alt="" />
                  </div>
                </div>
                <div className="flex flex-col gap-y-5 px-3 max-h-[12.5rem] overflow-scroll">
                  {TagFilterResponse &&
                    TagFilterResponse.map((tags: TagResponseData, index: number) => (
                      <div key={index} className="flex items-center mb-2">
                        <div className="mr-2">
                          <input
                            type="checkbox"
                            className="checkbox"
                            id={tags.id as string}
                            name={tags.name as string}
                            checked={(checkedTags[tags.name] as boolean) || false}
                            onChange={handleTagsCheckBox}
                          />
                        </div>
                        <label
                          className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial cursor-pointer"
                          htmlFor={tags.id as string}
                        >
                          {tags.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div
              className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06 px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handleActiveBetween(isActiveBetween ? false : true);
                handlePlatformActive(false);
                handleTagActive(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Activity between</div>
              <div>
                <img src={downArrow} alt="" className={isActiveBetween ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isActiveBetween && (
              <Fragment>
                <div className="flex flex-col px-3 pt-4">
                  <label htmlFor="Start Date p-1 font-Inter font-normal leading-4 text-trial text-searchBlack">Start Date</label>
                  <div className="relative flex items-center">
                    <DatePicker
                      selected={startDate}
                      maxDate={new Date()}
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'start')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                      ref={datePickerRefStart}
                      dateFormat="dd/MM/yyyy"
                      onMonthChange={() =>  {
                        dropDownRef.current = null;
                      }}
                    />
                    <img
                      className="absolute icon-holder right-6 cursor-pointer"
                      src={calendarIcon}
                      alt=""
                      onClick={() => handleClickDatePickerIcon('start')}
                    />
                  </div>
                </div>
                <div className="flex flex-col px-3 pb-4 pt-3">
                  <label htmlFor="Start Date p-1 font-Inter font-Inter font-normal leading-4 text-trial text-searchBlack">End Date</label>
                  <div className="relative flex items-center">
                    <DatePicker
                      selected={endDate}
                      minDate={startDate}
                      maxDate={new Date()}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'end')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                      ref={datePickerRefEnd}
                      dateFormat="dd/MM/yyyy"
                      onMonthChange={() =>  {
                        dropDownRef.current = null;
                      }}
                    />
                    <img
                      className="absolute icon-holder right-6 cursor-pointer"
                      src={calendarIcon}
                      alt=""
                      onClick={() => handleClickDatePickerIcon('end')}
                    />
                  </div>
                </div>
              </Fragment>
            )}

            <div className="buttons px-2 flex mt-1.56">
              <Button
                disabled={loader ? true : false}
                type="button"
                onClick={() => {
                  setCheckedPlatform({});
                  setCheckedTags({});
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setFilterCount(0);
                  dispatch(
                    activitiesSlice.actions.getActiveStreamData({
                      activeStreamQuery: {
                        page,
                        limit,
                        search: searchText
                      },
                      workspaceId: workspaceId!
                    })
                  );
                }}
                text="Reset"
                className="border border-backdropColor text-black rounded-0.31 h-2.063 w-1/2 mr-1 mt-1 cursor-pointer text-card font-Manrope font-semibold leading-1.31 hover:text-white hover:bg-backdropColor"
              />
              <Button
                disabled={loader ? true : false}
                onClick={submitFilterChange}
                type="button"
                text="Apply"
                className={`border-none btn-save-modal rounded-0.31 h-2.063 w-1/2 mt-1 cursor-pointer text-card font-Manrope font-semibold leading-1.31 text-white ${
                  loader ? ' opacity-50 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFilter;
