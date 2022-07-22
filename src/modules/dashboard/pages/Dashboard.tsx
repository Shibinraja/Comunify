import QuickInfo from 'common/quickInfo/QuickInfo';
import React from 'react';
import ActivitiesTab from '../activitiesTab/pages/ActivitiesTab';
import MembersTab from '../membersTab/pages/MembersTab';
import brickIcon from '../../../assets/images/brick.svg';
const Dashboard : React.FC  = () => {
  return (
    <>
    <div className='flex justify-end'>
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
