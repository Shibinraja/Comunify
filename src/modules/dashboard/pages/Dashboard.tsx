import QuickInfo from 'common/quickInfo/QuickInfo';
import React from 'react';
import ActivitiesTab from '../activitiesTab/pages/ActivitiesTab';
import MembersTab from '../membersTab/pages/MembersTab';

const Dashboard : React.FC  = () => {
  return (
    <>
      <div className="flex flex-col">
        <QuickInfo />
      </div>
      <div className=" flex flex-row mt-2.47 container mx-auto">
        <div className=" flex flex-col">
          <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 mt-1.258">
            Activites
          </h3>
          <ActivitiesTab />
        </div>
        <div className=" flex flex-col ml-1.86">
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
