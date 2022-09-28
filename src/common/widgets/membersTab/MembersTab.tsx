import React, { useState } from 'react';
import { TabSelector } from 'common/tabs/TabSelector';
import { useTabs } from '@/hooks/useTabs';
import ActiveMembersList from './ActiveMembersList';
import infoIcon from '../../../assets/images/info.svg';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { membersWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { MemberWidgetData } from '../../../modules/dashboard/interface/dashboard.interface';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const MembersTab: React.FC = () => {
  const workspaceId = getLocalWorkspaceId();

  const [selectedTab, setSelectedTab] = useTabs(['top contributor', 'active', 'inactive']);
  const [memberWidgetData, setMemberWidgetData] = React.useState<MemberWidgetData[]>();

  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  // eslint-disable-next-line no-unused-vars
  const [isDrag, setIsDrag] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    getMembersWidgetData();
  }, [selectedTab]);

  React.useEffect(() => {
    if (startDate && endDate) {
      getMembersWidgetData();
    }
  }, [startDate, endDate]);

  // eslint-disable-next-line space-before-function-paren
  const getMembersWidgetData = async () => {
    const data: MemberWidgetData[] = await membersWidgetDataService(
      workspaceId,
      selectedTab ? selectedTab : '',
      startDate ? startDate : undefined,
      endDate ? endDate : undefined
    );
    setMemberWidgetData(data);
  };

  const setWidgetNameAsParams = () => {
    const params = { widgetName: 'MembersTab' };
    navigate({ pathname: location.pathname, search: `?${createSearchParams(params)}` });
  };

  return (
    <div className="my-6">
      <div>
        <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Members Tab</h3>
      </div>
      <div
        className={`w-full h-full box-border
        ${isDrag ? 'widget-border relative' : 'border-borderPrimary'} bg-white dark:bg-secondaryDark dark:text-white rounded-0.6 mt-1.868 border  
         dark:border-borderDark shadow-profileCard `}
      >
        <div className="w-full mt-6 flex flex-col ">
          <nav>
            <TabSelector
              isActive={selectedTab === 'top contributor'}
              onClick={() => setSelectedTab('top contributor')}
              style={'ml-1.625 mt-0.438 text-sm pb-2  border-transparent'}
              styleActive={'gradient-bottom-border'}
            >
              Top Contributors
              <span className="pl-2 group relative">
                <img src={infoIcon} alt="" />
                <div className="absolute group-hover:visible invisible mt-4 bg-toolTip text-left p-5 text-white dark:text-white font-Poppins text-email font-normal leading-4 rounded-0.6">
                  Top contributors are the Members <br /> with most number of activities
                </div>
              </span>
            </TabSelector>
            <TabSelector
              isActive={selectedTab === 'active'}
              onClick={() => setSelectedTab('active')}
              style={'ml-1.625 mt-0.438 text-sm pb-2  border-transparent'}
              styleActive={'gradient-bottom-border'}
            >
              Active
            </TabSelector>
            <TabSelector
              isActive={selectedTab === 'inactive'}
              onClick={() => setSelectedTab('inactive')}
              style={'ml-1.625 mt-0.438 text-sm pb-2  border-transparent'}
              styleActive={'gradient-bottom-border'}
            >
              Inactive
            </TabSelector>
          </nav>
          <div className="h-14.375 items-center relative overflow-y-auto ml-1.661 block section">
            <ActiveMembersList hidden={false} membersWidgetData={memberWidgetData ? memberWidgetData : []} />
          </div>
        </div>
        <div
          onClick={setWidgetNameAsParams}
          className="absolute -right-3 bg-widgetClose rounded-full flex items-center justify-center h-6 w-6 text-white text-2xl -top-3 cursor-pointer"
        >
          -
        </div>
      </div>
    </div>
  );
};

export default MembersTab;
