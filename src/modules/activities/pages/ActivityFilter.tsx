/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangeEvent, FC, Fragment, useEffect, useRef, useState } from 'react';
import { ActivityStreamTypesProps } from './activity.types';
import downArrow from '../../../assets/images/filter-dropdown.svg';
import searchIcon from '../../../assets/images/search.svg';
import filterDownIcon from '../../../assets/images/report-dropdown.svg';
import calendarIcon from '../../../assets/images/calandar.svg';
import DatePicker, { ReactDatePicker } from 'react-datepicker';
import Button from 'common/button';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ActiveStreamTagResponse } from '../interfaces/activities.interface';
import useDebounce from '@/hooks/useDebounce';
import { useParams } from 'react-router-dom';
import activitiesSlice from '../store/slice/activities.slice';
import { PlatformResponse } from '../../settings/interface/settings.interface';
import usePlatform from '../../../hooks/usePlatform';
import settingsSlice from 'modules/settings/store/slice/settings.slice';

const ActivityFilter: FC<ActivityStreamTypesProps> = ({ page, limit, activityFilterExport }) => {
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

  const dropDownRef = useRef<HTMLDivElement>(null);
  const datePickerRefStart = useRef<ReactDatePicker>(null);
  const datePickerRefEnd = useRef<ReactDatePicker>(null);

  const debouncedTagValue = useDebounce(tagSearchText, 300);
  const disableApplyBtn = Object.values(checkedPlatform).concat(Object.values(checkedTags));

  const { TagFilterResponse } = useAppSelector((state) => state.settings);
  const PlatformFilterResponse = usePlatform();

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedTagValue) {
      getFilteredMembersTagList(debouncedTagValue);
    }
  }, [debouncedTagValue]);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
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
    if (searchText === '') {
      getFilteredMembersTagList('');
    }
    setTagSearchText(searchText);
  };

  const selectActiveBetweenDate = (event: ChangeEvent<Date>, date: Date, dateTime: string) => {
    event.stopPropagation();
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

  const getFilteredMembersTagList = (tagText: string) => {
    dispatch(
      settingsSlice.actions.tagFilterData({
        settingsQuery: { tags: { searchedTags: tagText, checkedTags: '' } },
        workspaceId: workspaceId!
      })
    );
  };

  const submitFilterChange = (): void => {
    const checkPlatform: Array<string> = [];
    const checkTags: Array<string> = [];

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
      endDate: endDate && format(endDate!, 'yyyy-MM-dd'),
      startDate: startDate && format(startDate!, 'yyyy-MM-dd')
    });

    dispatch(
      activitiesSlice.actions.getActiveStreamData({
        activeStreamQuery: {
          page,
          limit,
          search: '',
          tags: { searchedTags: '', checkedTags: checkTags.toString() },
          platforms: checkPlatform.toString(),
          'activity.lte': endDate && format(endDate!, 'yyyy-MM-dd'),
          'activity.gte': startDate && format(startDate!, 'yyyy-MM-dd')
        },
        workspaceId: workspaceId!
      })
    );
    handleFilterDropdown();
  };

  return (
    <div className="relative mr-5" ref={dropDownRef}>
      <div
        className="flex justify-between items-center px-1.08 app-input-card-border rounded-0.6 box-border w-9.59 h-3.06 cursor-pointer bg-white "
        onClick={handleFilterDropdown}
      >
        <div className="font-Poppins font-normal text-card text-dropGray leading-1.12">Filters</div>
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
              <div className="flex flex-col gap-y-5 justify-center p-3 max-h-[10rem] overflow-scroll">
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
                          <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">{platform?.name}</div>
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
                <div className="flex flex-col gap-y-5 justify-center px-3 max-h-[12.5rem] overflow-scroll">
                  {TagFilterResponse &&
                    TagFilterResponse.map((tags: ActiveStreamTagResponse, index: number) => (
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
                        <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">{tags.name}</div>
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
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'start')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                      ref={datePickerRefStart}
                      dateFormat="dd/MM/yyyy"
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
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'end')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                      ref={datePickerRefEnd}
                      dateFormat="dd/MM/yyyy"
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

            <div className="buttons px-3 ">
              <Button
                disabled={
                  (startDate === undefined ? true : false) && (endDate === undefined ? true : false) && disableApplyBtn.includes(true) !== true
                    ? true
                    : false
                }
                onClick={submitFilterChange}
                type="button"
                text="Apply"
                className={`border-none btn-save-modal rounded-0.31 h-2.063 w-full mt-1.56 cursor-pointer text-card font-Manrope font-semibold leading-1.31 text-white ${
                  (disableApplyBtn.includes(true) !== true ? 'cursor-not-allowed' : '') &&
                  (startDate === undefined ? 'cursor-not-allowed' : '') &&
                  (endDate === undefined ? 'cursor-not-allowed' : '')
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
