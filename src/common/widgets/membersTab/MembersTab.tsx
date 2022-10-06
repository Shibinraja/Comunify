/* eslint-disable indent */
import React from 'react';
import { TabSelector } from 'common/tabs/TabSelector';
import { useTabs } from '@/hooks/useTabs';
import ActiveMembersList from './ActiveMembersList';
import infoIcon from '../../../assets/images/info.svg';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { membersWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { MemberWidgetData } from '../../../modules/dashboard/interface/dashboard.interface';
import { useSearchParams } from 'react-router-dom';

import { WidgetComponentProps } from '../../../common/widgetLayout/WidgetTypes';

const MembersTab: React.FC<WidgetComponentProps> = (props: WidgetComponentProps) => {
  const { isManageMode, removeWidgetFromDashboard, widget, isSidePanelOpen } = props;

  const workspaceId = getLocalWorkspaceId();

  const [selectedTab, setSelectedTab] = useTabs(['topContributor', 'active', 'inActive']);
  const [memberWidgetData, setMemberWidgetData] = React.useState<MemberWidgetData[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  React.useEffect(() => {
    if (isManageMode === false && !isSidePanelOpen) {
      getMembersWidgetData();
    }
  }, [selectedTab]);

  React.useEffect(() => {
    if (isManageMode === false && isSidePanelOpen) {
      if (startDate && endDate) {
        getMembersWidgetData();
      }
    }
  }, [startDate, endDate]);

  // eslint-disable-next-line space-before-function-paren
  const getMembersWidgetData = async () => {
    setIsLoading(true);
    const data: MemberWidgetData[] = await membersWidgetDataService(
      workspaceId,
      selectedTab ? selectedTab : '',
      startDate ? startDate : undefined,
      endDate ? endDate : undefined
    );
    setMemberWidgetData(data);
    setIsLoading(false);
  };

  const handleRemove = () => {
    removeWidgetFromDashboard(widget);
  };

  return (
    <div className="my-6">
      <div>
        <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Members</h3>
      </div>
      <div
        className={`w-full h-full box-border
        ${
          isManageMode ? 'widget-border relative' : 'border-borderPrimary'
        } bg-white dark:bg-secondaryDark dark:text-white rounded-0.6 mt-1.868 border  
         dark:border-borderDark shadow-profileCard `}
      >
        <div className="w-full mt-6 flex flex-col ">
          <nav>
            <TabSelector
              isActive={selectedTab === 'topContributor'}
              onClick={() => setSelectedTab('topContributor')}
              style={`ml-1.625 mt-0.438 ${isManageMode ? 'text-sm' : 'text-xs'} pb-2  border-transparent`}
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
              style={`ml-1.625 mt-0.438 ${isManageMode ? 'text-sm' : 'text-xs'} pb-2  border-transparent`}
              styleActive={'gradient-bottom-border'}
            >
              Active
            </TabSelector>
            <TabSelector
              isActive={selectedTab === 'inActive'}
              onClick={() => setSelectedTab('inActive')}
              style={`ml-1.625 mt-0.438 ${isManageMode ? 'text-sm' : 'text-xs'} pb-2  border-transparent`}
              styleActive={'gradient-bottom-border'}
            >
              Inactive
            </TabSelector>
          </nav>
          <div className="h-14.375 items-center relative overflow-y-auto ml-1.661 block section">
          {!memberWidgetData?.length && !isLoading && !isManageMode && !isSidePanelOpen && (
            <div className="flex items-center justify-center font-Poppins font-normal text-xs text-infoBlack h-full">No data available</div>
          )}
          
            <ActiveMembersList
              hidden={false}
              membersWidgetData={memberWidgetData ? memberWidgetData : []}
              isLoading={isLoading}
              isManageMode={isManageMode && isManageMode}
              isSidePanelOpen={isSidePanelOpen}
            />
          </div>
        </div>
        {isManageMode && (
          <div
            onClick={handleRemove}
            className="absolute -right-3 bg-widgetClose rounded-full flex items-center justify-center h-6 w-6 text-white text-2xl -top-3 cursor-pointer"
          >
            -
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersTab;
