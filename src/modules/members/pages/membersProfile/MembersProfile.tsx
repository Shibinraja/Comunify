import React, { useEffect, useRef, useState } from 'react';
import profileImage from '../../../../assets/images/profile-member.svg';
import dropDownIcon from '../../../../assets/images/profile-dropdown.svg';
import slackIcon from '../../../../assets/images/slack.svg';
import closeIcon from '../../../../assets/images/close-member.svg';
import yellowDottedIcon from '../../../../assets/images/yellow_dotted.svg';
import unsplashIcon from '../../../../assets/images/unsplash_mj.svg';
import searchIcon from '../../../../assets/images/search.svg';
import calendarIcon from '../../../../assets/images/calandar.svg';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from 'common/button';
import Modal from 'react-modal';
import MembersProfileGraph from '../membersProfileGraph/MembersProfileGraph';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import membersSlice from '../../store/slice/members.slice';
import { useAppSelector } from '../../../../hooks/useRedux';
import { MembersProfileActivityGraphData, PlatformsData } from '../../interface/members.interface';
import { getLocalWorkspaceId } from '../../../../lib/helper';
Modal.setAppElement('#root');

const MembersProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isSelectDropDownActive, setSelectDropDownActive] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const [isIntegrationDropDownActive, setIntegrationDropDownActive] = useState<boolean>(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isFilterDropDownActive, setFilterDropdownActive] = useState<boolean>(false);

  const handleModal = (val: boolean) => {
    setIsModalOpen(val);
  };

  const handleTagModal = (val: boolean) => {
    setTagModalOpen(val);
  };

  const handleDropDownActive = (): void => {
    setSelectDropDownActive((prev) => !prev);
  };

  const handleFilterDropDownActive = (): void => {
    setFilterDropdownActive((prev) => !prev);
  };

  const handleIntegrationDropDownActive = (): void => {
    setIntegrationDropDownActive((prev) => !prev);
  };

  const navigateToReviewMerge = () => {
    navigate('/members/members-review');
  };

  const dispatch: AppDispatch = useDispatch();

  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && dropDownRef.current.contains(event.target as Node)) {
      setSelectDropDownActive(true);
    } else {
      setSelectDropDownActive(false);
    }
  };

  const workspaceId = getLocalWorkspaceId();

  useEffect(() => {
    dispatch(membersSlice.actions.getMembersActivityGraphData({ workspaceId, memberId: '98dd1af5-e8ce-4924-a133-61409b3f56e2' }));
    dispatch(membersSlice.actions.platformData());
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const activityGraphData: MembersProfileActivityGraphData = useAppSelector((state) => state.members.membersProfileActivityGraphData);
  const platformData: PlatformsData[] = useAppSelector((state) => state.members.platformsData);
  const selectPlatformToDisplayOnGraph = (id: string, name: string) => {
    setSelected(name);

    switch (name) {
      case 'All':
        dispatch(membersSlice.actions.getMembersActivityGraphData({ workspaceId, memberId: '98dd1af5-e8ce-4924-a133-61409b3f56e2' }));
        break;
      case 'Slack':
        dispatch(
          membersSlice.actions.getMembersActivityGraphDataPerPlatform({
            workspaceId,
            memberId: '98dd1af5-e8ce-4924-a133-61409b3f56e2',
            platform: name.toLocaleLowerCase().trim()
          })
        );
        break;
      default:
        break;
    }
  };

  const integrationOption = ['All Integrations', 'Slack', 'Vanilla', 'Higherlogic'];

  return (
    <div className="flex pt-3.93 w-full">
      <div className="flex flex-col w-full">
        <div className="p-5 flex flex-col box-border  rounded-0.6 shadow-contactCard app-input-card-border">
          <div className="flex justify-between items-center relative">
            <div className="font-Poppins font-semibold text-base leading-9 text-accountBlack">Member Activity by Source</div>
            <div className="select relative">
              <div
                className="flex justify-around items-center cursor-pointer box-border w-9.59 h-3.06 rounded-0.6 shadow-contactCard app-input-card-border "
                ref={dropDownRef}
                onClick={handleDropDownActive}
              >
                <div className="font-Poppins font-semibold text-card text-memberDay leading-4">{selected ? selected : 'Select'}</div>
                <div>
                  <img src={dropDownIcon} alt="" className={isSelectDropDownActive ? 'rotate-180' : 'rotate-0'} />
                </div>
              </div>
              {isSelectDropDownActive && (
                <div
                  className="absolute flex flex-col text-left px-5 pt-2  cursor-pointer box-border w-full bg-white z-40 rounded-0.6 shadow-contactCard pb-2 app-input-card-border"
                  onClick={handleDropDownActive}
                >
                  <div
                    className='className="rounded-0.3 h-1.93 flex items-center font-Poppins text-trial font-normal leading-4 text-searchBlack hover:bg-signUpDomain transition ease-in duration-100'
                    onClick={() => selectPlatformToDisplayOnGraph('', 'All')}
                  >
                    All
                  </div>
                  {platformData?.map((data: PlatformsData) => (
                    <div
                      key={data?.id}
                      className="rounded-0.3 h-1.93 flex items-center font-Poppins text-trial font-normal leading-4 text-searchBlack hover:bg-signUpDomain transition ease-in duration-100"
                      onClick={() => selectPlatformToDisplayOnGraph(data?.id, data?.name)}
                    >
                      {data?.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="chart pt-5 ">
            <MembersProfileGraph activityGraphData={activityGraphData} />
          </div>
        </div>
        <div className="flex pt-2.18 items-center">
          <div className="flex flex-col w-full">
            <div className="font-Poppins font-normal text-card leading-4 text-renewalGray">Last Active Date</div>
            <div className="font-Poppins font-semibold text-base leading-6 text-accountBlack">22 May 2022</div>
          </div>
          <div className="select relative mr-2">
            <div
              className="flex justify-around items-center cursor-pointer box-border w-9.59 h-3.06 rounded-0.6 shadow-contactCard app-input-card-border"
              onClick={handleIntegrationDropDownActive}
            >
              <div className="font-Poppins font-semibold text-card text-memberDay leading-4">
                {selectedIntegration ? selectedIntegration : 'All Integrations'}
              </div>
              <div>
                <img src={dropDownIcon} alt="" className={isIntegrationDropDownActive ? 'rotate-180' : 'rotate-0'} />
              </div>
            </div>
            {isIntegrationDropDownActive && (
              <div
                className="absolute flex flex-col text-left pt-2 px-2 cursor-pointer box-border w-full bg-white z-40 rounded-0.6 shadow-contactCard pb-2 app-input-card-border"
                onClick={handleIntegrationDropDownActive}
              >
                {integrationOption.map((options: string) => (
                  <div key={options} className="w-full hover:bg-signUpDomain rounded-0.3 transition ease-in duration-100">
                    <div
                      key={options}
                      className="h-1.93 px-3 flex items-center font-Poppins text-trial font-normal leading-4 text-searchBlack "
                      onClick={() => setSelectedIntegration(options)}
                    >
                      {options}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="select relative">
            <div
              className="flex justify-around items-center cursor-pointer box-border w-9.59 h-3.06 rounded-0.6 shadow-contactCard app-input-card-border"
              onClick={handleFilterDropDownActive}
            >
              <div className="font-Poppins font-semibold text-card text-memberDay leading-4">Filters</div>
              <div>
                <img src={dropDownIcon} alt="" className={isFilterDropDownActive ? 'rotate-180' : 'rotate-0'} />
              </div>
            </div>
            {isFilterDropDownActive && (
              <div className="absolute flex flex-col text-left px-2 pt-2  cursor-pointer box-border w-full bg-white z-40 rounded-0.6 shadow-contactCard pb-2 app-input-card-border">
                <div className="relative flex items-center ">
                  <DatePicker
                    selected={fromDate}
                    onChange={(date: Date) => setFromDate(date)}
                    className=" h-3.06 app-result-card-border shadow-reportInput w-full rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                    placeholderText="From"
                  />
                  <img className="absolute icon-holder right-4 cursor-pointer" src={calendarIcon} alt="" />
                </div>
                <div className="relative flex items-center pt-1">
                  <DatePicker
                    selected={toDate}
                    onChange={(date: Date) => setToDate(date)}
                    className=" h-3.06 app-result-card-border shadow-reportInput w-full rounded-0.3 px-3 font-Poppins font-semibold text-card text-dropGray leading-1.12 focus:outline-none placeholder:font-Poppins placeholder:font-semibold placeholder:text-card placeholder:text-dropGray placeholder:leading-1.12"
                    placeholderText="To"
                  />
                  <img className="absolute icon-holder right-4 cursor-pointer" src={calendarIcon} alt="" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-1.56 pt-8 px-1.62 box-border w-full rounded-0.6 shadow-contactCard app-input-card-border pb-5">
          <div className="flex justify-between ">
            <div className="font-Poppins text-card leading-4 font-medium">May 2022</div>
            <div className="font-Poppins font-normal leading-4 text-renewalGray text-preview cursor-pointer">Preview All</div>
          </div>
          <div className="flex flex-col pt-8 gap-0.83 justify-center height-member-activity overflow-scroll mt-5 member-section">
            <div className="flex items-center">
              <div>
                <img src={yellowDottedIcon} alt="" />
              </div>
              <div className="pl-0.68">
                <img src={slackIcon} alt="" />
              </div>
              <div className="flex flex-col pl-0.89">
                <div className="font-Poppins font-normal text-card leading-4">Kamil Pavlicko sent 1 message to thread</div>
                <div className="font-Poppins left-4 font-normal text-profileEmail text-duration">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center">
              <div>
                <img src={yellowDottedIcon} alt="" />
              </div>
              <div className="pl-0.68">
                <img src={slackIcon} alt="" />
              </div>
              <div className="flex flex-col pl-0.89">
                <div className="font-Poppins font-normal text-card leading-4">Kamil Pavlicko sent 1 message to thread</div>
                <div className="font-Poppins left-4 font-normal text-profileEmail text-duration">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center">
              <div>
                <img src={yellowDottedIcon} alt="" />
              </div>
              <div className="pl-0.68">
                <img src={slackIcon} alt="" />
              </div>
              <div className="flex flex-col pl-0.89">
                <div className="font-Poppins font-normal text-card leading-4">Kamil Pavlicko sent 1 message to thread</div>
                <div className="font-Poppins left-4 font-normal text-profileEmail text-duration">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center">
              <div>
                <img src={yellowDottedIcon} alt="" />
              </div>
              <div className="pl-0.68">
                <img src={slackIcon} alt="" />
              </div>
              <div className="flex flex-col pl-0.89">
                <div className="font-Poppins font-normal text-card leading-4">Kamil Pavlicko sent 1 message to thread</div>
                <div className="font-Poppins left-4 font-normal text-profileEmail text-duration">2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex flex-col ml-1.8">
        <div className=" flex flex-col ">
          <div className="profile-card items-center btn-save-modal justify-center pro-bag rounded-t-0.6 w-18.125 shadow-contactBtn box-border h-6.438 "></div>
          <div className="flex flex-col profile-card items-center justify-center bg-white rounded-b-0.6 w-18.125 shadow-contactCard box-border h-11.06">
            <div className="-mt-24 ">
              <img src={profileImage} alt="profileImage" className="bg-cover " />
            </div>
            <div className="mt-0.688 text-profileBlack font-semibold font-Poppins leading-1.31 text-trial">Dmitry Kargaev</div>
            <div className="text-center pt-0.125 font-Poppins text-profileBlack text-member">dmrity125@mail.com | neoito technologies</div>
            <div className="flex gap-1 pt-1.12">
              <div>
                <img src={slackIcon} alt="" />
              </div>
              <div>
                <img src={slackIcon} alt="" />
              </div>
              <div>
                <img src={slackIcon} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-1.37 box-border w-18.125 rounded-0.6 shadow-profileCard app-input-card-border">
          <div className="flex flex-col p-5">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="font-Poppins font-medium text-error leading-5 text-profileBlack">Tags</div>
              <div className="font-Poppins font-medium text-error leading-5 text-addTag cursor-pointer" onClick={() => handleTagModal(true)}>
                ADD TAG
              </div>
              <div className="flex items-center justify-center">
                <Modal
                  isOpen={isTagModalOpen}
                  shouldCloseOnOverlayClick={false}
                  onRequestClose={() => setIsModalOpen(false)}
                  className="w-24.31 h-18.75 mx-auto  rounded-lg modals-tag bg-white shadow-modal"
                  style={{
                    overlay: {
                      display: 'flex',
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      alignItems: 'center'
                    }
                  }}
                >
                  <div className="flex flex-col">
                    <h3 className="text-center font-Inter font-semibold text-xl mt-1.8 text-black leading-6">Add Tag</h3>
                    <form className="flex flex-col relative px-1.93 mt-9">
                      <label htmlFor="billingName " className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack ">
                        Tag Name
                      </label>
                      <input
                        type="text"
                        className="mt-0.375 inputs box-border bg-white shadow-inputShadow rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-trial placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                        placeholder="Enter Tag Name"
                      />
                      <div className="flex absolute right-1 top-24 pr-6 items-center">
                        <Button
                          type="button"
                          text="CANCEL"
                          className="mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel px-2 py-3  rounded border-none"
                          onClick={() => setTagModalOpen(false)}
                        />
                        <Button
                          type="button"
                          text="SAVE"
                          className="save text-white font-Poppins text-error font-medium leading-5 cursor-pointer rounded shadow-contactBtn px-5 py-3  border-none btn-save-modal"
                        />
                      </div>
                    </form>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="flex flex-wrap pt-1.56 gap-2">
              <div className="labels flex  items-center px-2  h-8 rounded bg-tagSection">
                <div className="font-Poppins text-profileBlack font-normal text-card leading-4">Influencer</div>
                <div className="pl-2">
                  <img src={closeIcon} alt="" />
                </div>
              </div>
              <div className="labels flex  items-center px-2 h-8 rounded bg-tagSection">
                <div className="font-Poppins text-profileBlack font-normal text-card leading-4">Admin</div>
                <div className="pl-2">
                  <img src={closeIcon} alt="" />
                </div>
              </div>
              <div className="labels flex  items-center px-2 h-8 rounded bg-tagSection">
                <div className="font-Poppins text-profileBlack font-normal text-card leading-4">Charity</div>
                <div className="pl-2">
                  <img src={closeIcon} alt="" />
                </div>
              </div>
              <div className="labels flex  items-center px-2 h-8 rounded bg-tagSection">
                <div className="font-Poppins text-profileBlack font-normal text-card leading-4">Creator</div>
                <div className="pl-2">
                  <img src={closeIcon} alt="" />
                </div>
              </div>
              <div className="labels flex  items-center px-2 h-8 rounded bg-tagSection">
                <div className="font-Poppins text-profileBlack font-normal text-card leading-4">Social</div>
                <div className="pl-2">
                  <img src={closeIcon} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-1.8">
          <Button
            type="button"
            text="Merge Members"
            className="cursor-pointer border-none font-Poppins font-medium text-search leading-5 btn-save-modal hover:shadow-buttonShadowHover transition ease-in duration-300 text-white shadow-contactBtn rounded-0.3 w-full h-3.06"
            onClick={() => handleModal(true)}
          />
        </div>
        <Modal
          isOpen={isModalOpen}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => setIsModalOpen(false)}
          className="w-24.31 pb-28 mx-auto  mt-32 rounded-lg modals-tag bg-white shadow-modal "
          style={{
            overlay: {
              display: 'flex',
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              alignItems: 'center'
            }
          }}
        >
          <div className="flex flex-col ml-1.8 pt-9 ">
            <h3 className="font-Inter font-semibold text-xl leading-1.43">Merge Members</h3>
            <div className="flex relative items-center mt-1.43">
              <input
                type="text"
                className="input-merge-search focus:outline-none px-3 pr-8 box-border w-20.5 h-3.06 rounded-0.6 shadow-profileCard placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.31 placeholder:text-searchGray"
                placeholder="Search Members"
              />
              <div className="absolute right-12 w-0.78 h-3 z-40">
                <img src={searchIcon} alt="" />
              </div>
            </div>
            <div className="flex-flex-col relative mt-1.8">
              <div className="flex">
                <div className="mr-0.34">
                  <input type="checkbox" className="checkbox" />
                </div>
                <div className="flex flex-col">
                  <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">Emerson Schleifer</div>
                  <div className="text-tagEmail font-Poppins font-normal leading-1.31 text-email pl-1">dmrity125@mail.com | neoito technologies</div>
                  <div className="flex mt-2.5">
                    <div className="mr-0.34 w-1.001 h-1.001">
                      <img src={slackIcon} alt="" />
                    </div>
                    <div className="mr-0.34 w-1.001 h-1.001">
                      <img src={unsplashIcon} alt="" />
                    </div>
                    <div className="mr-0.34 w-1.001 h-1.001">
                      <img src={slackIcon} alt="" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex absolute right-8 mt-1.8">
                <Button
                  type="button"
                  text="CANCEL"
                  className="mr-2.5 font-Poppins text-error font-medium border-cancel  leading-1.31 text-thinGray cursor-pointer w-5.25 h-2.81 rounded box-border"
                  onClick={() => setIsModalOpen(false)}
                />
                <Button
                  type="button"
                  text="SUBMIT"
                  className="submit border-none text-white font-Poppins text-error font-medium leading-1.31 cursor-pointer w-5.25 h-2.81 rounded shadow-contactBtn btn-save-modal"
                  onClick={navigateToReviewMerge}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MembersProfile;
