/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Button from 'common/button';
import { ChangeEvent, useEffect, useRef, useState, type FC } from 'react';
import membersSlice from '../store/slice/members.slice';
import downArrow from '../../../assets/images/sub-down-arrow.svg';
import dropdownIcon from '../../../assets/images/Vector.svg';
import searchIcon from '../../../assets/images/search.svg';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { MemberTypesProps } from './membertypes';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendarIcon from '../../../assets/images/calandar.svg';
import { format } from 'date-fns';
import { getLocalWorkspaceId } from '@/lib/helper';
import useDebounce from '@/hooks/useDebounce';
import { MembersPlatformResponse, MembersTagResponse } from '../interface/members.interface';

const MembersFilter: FC<MemberTypesProps> = ({ page, limit }) => {
  const [isFilterDropdownActive, setisFilterDropdownActive] = useState<boolean>(false);
  const [isPlatformActive, setPlatformActive] = useState<boolean>(true);
  const [isTagActive, setTagActive] = useState<boolean>(false);
  const [isLocationActive, setLocationActive] = useState<boolean>(false);
  const [isOrganizationActive, setOrganizationActive] = useState<boolean>(false);
  const [checkedPlatform, setCheckedPlatform] = useState<Record<string, unknown>>({});
  const [checkedTags, setCheckedTags] = useState<Record<string, unknown>>({});
  const [checkedLocation, setCheckedLocation] = useState<Record<string, unknown>>({});
  const [checkedOrganization, setCheckedOrganization] = useState<Record<string, unknown>>({});
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [tagSearchText, setTagSearchText] = useState<string>('');
  const [locationSearchText, setLocationSearchText] = useState<string>('');
  const [organizationSearchText, setOrganizationSearchText] = useState<string>('');
  const [isActiveBetween, setActiveBetween] = useState<boolean>(false);

  const workspaceId = getLocalWorkspaceId();
  const dispatch = useAppDispatch();
  const dropDownRef = useRef<HTMLDivElement>(null);
  const { membersLocationFilterResponse, membersOrganizationFilterResponse, membersTagFilterResponse, membersPlatformFilterResponse } =
    useAppSelector((state) => state.members);

  const debouncedLocationValue = useDebounce(locationSearchText, 300);
  const debouncedOrganizationValue = useDebounce(organizationSearchText, 300);
  const debouncedTagValue = useDebounce(tagSearchText, 300);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedLocationValue) {
      getFilteredMembersFilterList(debouncedLocationValue);
    }
  }, [debouncedLocationValue]);

  useEffect(() => {
    if (debouncedOrganizationValue) {
      getFilteredMembersFilterList('', debouncedOrganizationValue);
    }
  }, [debouncedOrganizationValue]);

  useEffect(() => {
    if (debouncedTagValue) {
      getFilteredMembersTagList(debouncedTagValue);
    }
  }, [debouncedTagValue]);

  //

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && dropDownRef.current.contains(event.target as Node)) {
      setisFilterDropdownActive(true);
    } else {
      setisFilterDropdownActive(false);
    }
  };

  const handleFilterDropdown = (): void => {
    setisFilterDropdownActive((prev) => !prev);
  };

  const handlePlatformActive = (val: boolean) => {
    setPlatformActive(val);
  };

  const handleLocationActive = (val: boolean) => {
    setLocationActive(val);
  };

  const handleTagActive = (val: boolean) => {
    setTagActive(val);
  };

  const handleOrganizationActive = (val: boolean) => {
    setOrganizationActive(val);
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

  const handleLocationCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const location: string = event.target.name;
    setCheckedLocation((preValue) => ({ ...preValue, [location]: event.target.checked }));
  };

  const handleOrganizationCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const organization: string = event.target.name;
    setCheckedOrganization((preValue) => ({ ...preValue, [organization]: event.target.checked }));
  };

  const handleTagSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (searchText === '') {
      getFilteredMembersTagList('');
    }
    setTagSearchText(searchText);
  };

  const handleLocationSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (searchText === '') {
      getFilteredMembersFilterList(searchText);
    }
    setLocationSearchText(searchText);
  };

  const handleOrganizationSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (searchText === '') {
      getFilteredMembersFilterList('', searchText);
    }
    setOrganizationSearchText(searchText);
  };

  const getFilteredMembersTagList = (tagText: string) => {
    dispatch(
      membersSlice.actions.membersTagFilter({
        membersQuery: { tags: { searchedTags: tagText, checkedTags: '' } },
        workspaceId: workspaceId!
      })
    );
  };

  const selectActiveBetweenDate = (event: ChangeEvent<Date>, date: Date, dateTime: string) => {
    event.stopPropagation();
    if (dateTime === 'start') {
      setStartDate(date);
      setisFilterDropdownActive(true);
    }

    if (dateTime === 'end') {
      setEndDate(date);
      setisFilterDropdownActive(true);
    }
  };

  // Function to dispatch the search text to hit api of member filter list.
  const getFilteredMembersFilterList = (locationText: string, organizationText?: string) => {
    if (typeof locationText === 'string') {
      dispatch(
        membersSlice.actions.membersLocationFilter({
          membersQuery: { location: { searchedLocation: locationText, checkedLocation: '' } },
          workspaceId: workspaceId!
        })
      );
    }

    if (typeof organizationText === 'string') {
      dispatch(
        membersSlice.actions.membersOrganizationFilter({
          membersQuery: { organization: { searchedOrganization: organizationText, checkedOrganization: '' } },
          workspaceId: workspaceId!
        })
      );
    }
  };

  const submitFilterChange = (): void => {
    const checkPlatform: Array<string> = [];
    const checkTags: Array<string> = [];
    const checkOrganization: Array<string> = [];
    const checkLocation: Array<string> = [];

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

    if (Object.keys(checkedOrganization).length > 0) {
      Object.keys(checkedOrganization).map((organization: string) => {
        if (checkedOrganization[organization] === true) {
          checkOrganization.push(organization);
        }
      });
    }

    if (Object.keys(checkedLocation).length > 0) {
      Object.keys(checkedLocation).map((location: string) => {
        if (checkedLocation[location] === true) {
          checkLocation.push(location);
        }
      });
    }

    dispatch(
      membersSlice.actions.membersList({
        membersQuery: {
          page,
          limit,
          search: '',
          tags: { searchedTags: '', checkedTags: checkTags.toString() },
          platforms: checkPlatform.toString(),
          organization: { searchedOrganization: '', checkedOrganization: checkOrganization.toString() },
          location: { searchedLocation: '', checkedLocation: checkLocation.toString() },
          'lastActivity.lte': endDate && format(endDate!, 'yyyy-MM-dd'),
          'lastActivity.gte': startDate && format(startDate!, 'yyyy-MM-dd')
        },
        workspaceId: workspaceId!
      })
    );
  };

  return (
    <div className="box-border cursor-pointer rounded-0.6 shadow-contactCard app-input-card-border relative " ref={dropDownRef}>
      <div className="flex h-3.06  items-center justify-between px-5 " onClick={handleFilterDropdown}>
        <div className="box-border rounded-0.6 shadow-contactCard font-Poppins font-semibold text-card text-memberDay leading-1.12">Filters</div>
        <div>
          <img src={dropdownIcon} alt="" className={isFilterDropdownActive ? 'rotate-180' : 'rotate-0'} />
        </div>
      </div>
      {isFilterDropdownActive && (
        <div className="absolute w-16.56 pb-0 bg-white border z-40 rounded-0.3">
          <div className="flex flex-col pb-5">
            <div
              className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06  px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handlePlatformActive(isPlatformActive ? false : true);
                handleTagActive(false);
                handleLocationActive(false);
                handleOrganizationActive(false);
                handleActiveBetween(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Platform</div>
              <div>
                <img src={downArrow} alt="" className={isPlatformActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isPlatformActive && (
              <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125 pb-3">
                {membersPlatformFilterResponse &&
                  membersPlatformFilterResponse.map(
                    (platform: MembersPlatformResponse, index: number) =>
                      platform.name !== null && (
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
                          <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">{platform.name}</div>
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
                handleLocationActive(false);
                handleOrganizationActive(false);
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
                    className="inputs mx-auto focus:outline-none px-3 box-border bg-white shadow-profileCard rounded-0.6 h-2.81 w-15.06 placeholder:text-searchGray placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.12"
                    placeholder="Search Tags"
                    onChange={handleTagSearchTextChange}
                  />
                  <div className="absolute right-5 w-0.78 h-0.75  z-40">
                    <img src={searchIcon} alt="" />
                  </div>
                </div>
                <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125">
                  {membersTagFilterResponse &&
                    membersTagFilterResponse.map((tags: MembersTagResponse, index: number) => (
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
                handleLocationActive(false);
                handleOrganizationActive(false);
                handleTagActive(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Active between</div>
              <div>
                <img src={downArrow} alt="" className={isActiveBetween ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isActiveBetween && (
              <>
                <div className="flex flex-col px-3 pt-4">
                  <label htmlFor="Start Date p-1 font-Inter font-normal leading-4 text-trial text-searchBlack">Start Date</label>
                  <div className="relative flex items-center">
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date, event: ChangeEvent<Date>) => selectActiveBetweenDate(event, date, 'start')}
                      className="export w-full h-3.06  shadow-shadowInput rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                      placeholderText="DD/MM/YYYY"
                    />
                    <img className="absolute icon-holder right-6 cursor-pointer" src={calendarIcon} alt="" />
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
                    />
                    <img className="absolute icon-holder right-6 cursor-pointer" src={calendarIcon} alt="" />
                  </div>
                </div>
              </>
            )}
            <div
              className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06 px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handleLocationActive(isLocationActive ? false : true);
                handleTagActive(false);
                handlePlatformActive(false);
                handleOrganizationActive(false);
                handleActiveBetween(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Location</div>
              <div>
                <img src={downArrow} alt="" className={isLocationActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isLocationActive && (
              <div>
                <div className="flex relative items-center pt-2 pb-3">
                  <input
                    type="text"
                    name="locationName"
                    id="locationName"
                    className="inputs mx-auto focus:outline-none px-3 box-border bg-white shadow-profileCard rounded-0.6 h-2.81 w-15.06 placeholder:text-searchGray placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.12"
                    placeholder="Search Location"
                    onChange={handleLocationSearchTextChange}
                  />
                  <div className="absolute right-5 w-0.78 h-0.75  z-40">
                    <img src={searchIcon} alt="" />
                  </div>
                </div>
                <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125 bg-white">
                  {membersLocationFilterResponse &&
                    membersLocationFilterResponse.map(
                      (location: { location: string }, index: number) =>
                        location.location !== null && (
                          <div key={index} className="flex items-center mb-2">
                            <div className="mr-2">
                              <input
                                type="checkbox"
                                id={location.location as string}
                                name={location.location as string}
                                className="checkbox"
                                checked={(checkedLocation[location.location] as boolean) || false}
                                onChange={handleLocationCheckBox}
                              />
                            </div>
                            <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">{location.location}</div>
                          </div>
                        )
                    )}
                </div>
              </div>
            )}

            <div
              className="flex justify-between items-center drop w-full box-border bg-signUpDomain h-3.06  px-3 mx-auto  cursor-pointer"
              onClick={() => {
                handleOrganizationActive(isOrganizationActive ? false : true);
                handleTagActive(false);
                handlePlatformActive(false);
                handleLocationActive(false);
                handleActiveBetween(false);
              }}
            >
              <div className="text-searchBlack font-Poppins text-trial leading-1.31 font-semibold">Organization</div>
              <div>
                <img src={downArrow} alt="" className={isOrganizationActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isOrganizationActive && (
              <div>
                <div className="flex relative items-center pt-2 pb-3 ">
                  <input
                    type="text"
                    name="organization"
                    id="orgaanizationId"
                    className="inputs mx-auto focus:outline-none px-3 box-border bg-white shadow-profileCard rounded-0.6 h-2.81 w-15.06 placeholder:text-searchGray placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.12"
                    placeholder="Search Organization"
                    onChange={handleOrganizationSearchTextChange}
                  />
                  <div className="absolute right-5 w-0.78 h-0.75  z-40">
                    <img src={searchIcon} alt="" />
                  </div>
                </div>
                <div className="flex flex-col gap-y-5 justify-center px-3 mt-1.125 bg-white">
                  {membersOrganizationFilterResponse &&
                    membersOrganizationFilterResponse.map(
                      (organization: { organization: string }, index: number) =>
                        organization.organization !== null && (
                          <div key={index} className="flex items-center">
                            <div className="mr-2">
                              <input
                                type="checkbox"
                                className="checkbox"
                                id={organization.organization as string}
                                name={organization.organization as string}
                                checked={(checkedOrganization[organization.organization] as boolean) || false}
                                onChange={handleOrganizationCheckBox}
                              />
                            </div>
                            <div className="font-Poppins font-normal text-searchBlack leading-1.31 text-trial">{organization.organization}</div>
                          </div>
                        )
                    )}
                </div>
              </div>
            )}
            <div className="buttons px-2">
              <Button
                onClick={submitFilterChange}
                type="button"
                text="Apply"
                className="border-none btn-save-modal rounded-0.31 h-2.063 w-full mt-1.56 cursor-pointer text-card font-Manrope font-semibold leading-1.31 text-white transition ease-in duration-300 hover:shadow-buttonShadowHover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersFilter;
