import QuickInfo from 'common/quickInfo/QuickInfo';
import React, { useEffect, useRef, useState } from 'react';
import ActivitiesTab from '../activitiesTab/pages/ActivitiesTab';
import MembersTab from '../membersTab/pages/MembersTab';
import brickIcon from '../../../assets/images/brick.svg';
import dropDownIcon from '../../../assets/images/profile-dropdown.svg';

const Dashboard: React.FC = () => {

  const [isSelectDropDownActive, setSelectDropDownActive] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const handleDropDownActive = (): void => {
    setSelectDropDownActive((prev) => !prev);
  };
  const selectOptions = ['This Week', 'Last Week', 'Month'];

  const dropDownRef:any=useRef();

  const handleOutsideClick=(event:MouseEvent) => {
    if (dropDownRef && dropDownRef.current && dropDownRef.current.contains(event.target)) {
      setSelectDropDownActive(true);
    } else {
      setSelectDropDownActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="container mx-auto flex justify-between">
        <div className="flex relative">
          <div className="flex items-center justify-between px-5 w-11.72 h-3.06 app-input-card-border rounded-0.6 shadow-integrationCardShadow cursor-pointer "
            ref={dropDownRef}
            onClick={handleDropDownActive}>
            <div className="font-Poppins font-semibold text-card text-dropGray leading-4">{selected ? selected : 'Select'}</div>
            <div className="bg-cover ">
              <img src={dropDownIcon} alt="" className={isSelectDropDownActive ? 'rotate-180' : 'rotate-0'} />
            </div>
          </div>
          {isSelectDropDownActive &&
            <div className="absolute top-12 w-11.72 app-input-card-border bg-white shadow-integrationCardShadow rounded-0.6" onClick={handleDropDownActive}>
              {selectOptions.map((options: string, index: number) =>
                <div key={index} className="flex flex-col p-2 hover:bg-signUpDomain transition ease-in duration-300 cursor-pointer">
                  <div className="text-searchBlack font-Poppins font-normal text-trial leading-1.31" onClick={() => setSelected(options)}>{options}</div>
                </div>
              )}
            </div>
          }

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
      <div className=" flex flex-row mt-2.47 container mx-auto">
        <div className=" flex flex-col w-full">
          <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 mt-1.258">
            Activities
          </h3>
          <ActivitiesTab />
        </div>
        <div className=" flex flex-col ml-1.86 w-full">
          <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18  mt-1.258 ">
            Members
          </h3>
          <MembersTab />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
