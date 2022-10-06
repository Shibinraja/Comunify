import React from 'react';
import { useTabs } from '@/hooks/useTabs';
import { TabSelector } from 'common/tabs/TabSelector';
import NewActivitiesList from './NewActivitiesList';
import { activitiesWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { ActivitiesWidgetData } from '../../../modules/dashboard/interface/dashboard.interface';
import { useSearchParams } from 'react-router-dom';
import { WidgetComponentProps } from '../../../common/widgetLayout/WidgetTypes';

const ActivitiesTab: React.FC<WidgetComponentProps> = (props: WidgetComponentProps) => {
  const { isManageMode, removeWidgetFromDashboard, widget, isSidePanelOpen } = props;

  const [selectedTab, setSelectedTab] = useTabs(['newActivities', 'highlights']);
  const [activitiesWidgetResponse, setActivitiesWidgetResponse] = React.useState<ActivitiesWidgetData[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  React.useEffect(() => {
    if (isManageMode === false && !isSidePanelOpen) {
      getActivityWidgetData();
    }
  }, [selectedTab]);

  React.useEffect(() => {
    if (isManageMode === false && !isSidePanelOpen) {
      if (startDate && endDate) {
        getActivityWidgetData();
      }
    }
  }, [startDate, endDate]);

  const workspaceId = getLocalWorkspaceId();

  // eslint-disable-next-line space-before-function-paren
  const getActivityWidgetData = async () => {
    setIsLoading(true);
    const data: ActivitiesWidgetData[] = await activitiesWidgetDataService(
      workspaceId,
      selectedTab ? selectedTab : '',
      startDate ? startDate : undefined,
      endDate ? endDate : undefined
    );
    setActivitiesWidgetResponse(data);
    setIsLoading(false);
  };

  const handleRemove = () => {
    removeWidgetFromDashboard(widget);
  };

  return (
    <div className="my-6">
      <div>
        <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Activities</h3>
      </div>
      <div
        className={`w-full h-full box-border bg-white dark:bg-secondaryDark dark:text-white  rounded-0.6 mt-1.868 border
           ${isManageMode ? 'widget-border relative' : 'border-borderPrimary'} dark:border-borderDark shadow-profileCard `}
      >
        <div className="w-full mt-6 flex flex-col ">
          <nav>
            <TabSelector
              isActive={selectedTab === 'newActivities'}
              onClick={() => setSelectedTab('newActivities')}
              style={`ml-1.625 mt-0.438 ${isManageMode ? 'text-sm' : 'text-xs'} pb-2  border-transparent`}
              styleActive={'gradient-bottom-border'}
            >
              New Activities
            </TabSelector>
            <TabSelector
              isActive={selectedTab === 'highlights'}
              onClick={() => setSelectedTab('highlights')}
              style={`ml-1.625 mt-0.438 ${isManageMode ? 'text-sm' : 'text-xs'} pb-2  border-transparent`}
              styleActive={'gradient-bottom-border'}
            >
              Highlights
            </TabSelector>
          </nav>
          {!activitiesWidgetResponse?.length && !isLoading && !isManageMode && !isSidePanelOpen && (
            <div className="flex items-center justify-center font-Poppins font-normal text-xs text-infoBlack pt-5">No data available</div>
          )}
          <div className="h-14.375 items-center relative overflow-y-auto block section ">
            <NewActivitiesList
              hidden={false}
              activitiesWidgetData={activitiesWidgetResponse ? activitiesWidgetResponse : []}
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

export default ActivitiesTab;
