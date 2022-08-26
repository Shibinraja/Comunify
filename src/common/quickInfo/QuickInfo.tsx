/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import membersSlice from 'modules/members/store/slice/members.slice';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';

const QuickInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const { workspaceId } = useParams();

  useEffect(() => {
    dispatch(membersSlice.actions.membersCountAnalytics({ workspaceId: workspaceId! }));
    dispatch(membersSlice.actions.membersActivityAnalytics({ workspaceId: workspaceId! }));
  }, []);

  const {
    membersCountAnalyticsData: { totalMembers, newMembers },
    membersActivityAnalyticsData: { activeMembers, inActiveMembers }
  } = useAppSelector((state) => state.members);

  return (
    <div className="mt-5 ">
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Quick Info</h3>
      <div className="grid grid-cols-4 info-data py-6 box-border bg-white dark:bg-secondaryDark  rounded-0.6 mt-1.868 border border-borderPrimary dark:border-borderDark shadow-profileCard">
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold dark:text-white">{totalMembers.count}</div>
          <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-success">{totalMembers.title}</div>
          <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs dark:text-greyDark">{totalMembers.analyticMessage}</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold dark:text-white">{newMembers.count}</div>
          <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-primary">{newMembers.title}</div>
          <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs dark:text-greyDark">{newMembers.analyticMessage}</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold dark:text-white">{activeMembers.count}</div>
          <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-warn">{activeMembers.title}</div>
          <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs dark:text-greyDark">
            {activeMembers.analyticMessage}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold dark:text-white">{inActiveMembers.count}</div>
          <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-info">{inActiveMembers.title}</div>
          <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs dark:text-greyDark">
            {inActiveMembers.analyticMessage}
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuickInfo;
