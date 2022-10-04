import React from 'react';
import { TabPanel } from 'common/tabs/TabPanel';
import { MemberWidgetData } from '../../../modules/dashboard/interface/dashboard.interface';
import Skeleton from 'react-loading-skeleton';
import { activityData } from '../../../modules/activities/pages/ActivityTableData';

type Props = {
  hidden: boolean;
  membersWidgetData: MemberWidgetData[] | [];
  isLoading: boolean;
  isManageMode?: boolean;
  isSidePanelOpen: boolean;
};

const ActiveMembersList: React.FC<Props> = ({ hidden, membersWidgetData, isLoading, isManageMode, isSidePanelOpen }) => (
  <TabPanel hidden={hidden}>
    {!isManageMode && !isSidePanelOpen ? (
      <div>
        {!isLoading ? (
          <ul className="mt-1.474 ">
            {membersWidgetData.map((item: MemberWidgetData) => (
              <>
                <li key={`${item?.comunifyMemberId + item?.email + Math.random()}}`} className="mb-4 ">
                  <div className="w-full flex justify-start items-center">
                    <div className="">
                      <img className="h-[1.875rem] w-[1.9594rem] rounded-full" src={item?.profileUrl} alt="" />
                    </div>

                    <div className="ml-0.865">
                      <div>
                        <p className="font-medium pt-0.5 text-xs font-Poppins">{item?.name}</p>
                      </div>
                      <div className="font-Poppins text-membersCreatedAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                        <p>{new Date(`${item?.lastActivity}`).getHours()} hours ago</p>
                      </div>
                    </div>
                  </div>
                </li>
              </>
            ))}
          </ul>
        ) : (
          <Skeleton count={4} width={500} height={30} className="mt-4 mb-4 ml-5" />
        )}
      </div>
    ) : (
      <div>
        <ul className="mt-1.474 ">
          {activityData.map((item) => (
            <>
              <li key={`${Math.random()}}`} className="mb-4 ">
                <div className="w-full flex justify-start items-center">
                  <div className="">
                    <img className="h-[1.875rem] w-[1.9594rem] rounded-full" src={item?.image} alt="" />
                  </div>

                  <div className="ml-0.865">
                    <div>
                      <p className="font-medium pt-0.5 text-xs font-Poppins">{item?.memberName}</p>
                    </div>
                    <div className="font-Poppins text-membersCreatedAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                      <p>{item?.duration.time}</p>
                    </div>
                  </div>
                </div>
              </li>
            </>
          ))}
        </ul>
      </div>
    )}
  </TabPanel>
);

export default ActiveMembersList;
