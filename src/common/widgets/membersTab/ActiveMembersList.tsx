import React from 'react';
import { TabPanel } from 'common/tabs/TabPanel';
import { MemberWidgetData } from '../../../modules/dashboard/interface/dashboard.interface';

type Props = {
  hidden: boolean;
  membersWidgetData: MemberWidgetData[] | [];
};

const ActiveMembersList: React.FC<Props> = ({ hidden, membersWidgetData }) => (
  <TabPanel hidden={hidden}>
    <div>
      <ul className="mt-1.474 ">
        {Boolean(membersWidgetData?.length) &&
          membersWidgetData.map((item: MemberWidgetData) => (
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
    </div>
  </TabPanel>
);

export default ActiveMembersList;
