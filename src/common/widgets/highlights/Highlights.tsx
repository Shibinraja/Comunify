import React, { FC, useEffect, useState } from 'react';
import { useTabs } from '@/hooks/useTabs';
import { TabSelector } from 'common/tabs/TabSelector';
import NewActivitiesList from '../activitiesTab/NewActivitiesList';
import { activitiesWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { ActivitiesWidgetData } from '../../../modules/dashboard/interface/dashboard.interface';
import { WidgetComponentProps } from '../../../common/widgetLayout/WidgetTypes';
import { useAppSelector } from '@/hooks/useRedux';

const Highlights: FC<WidgetComponentProps> = (props: WidgetComponentProps) => {
  const { isManageMode, removeWidgetFromDashboard, widget, isSidePanelOpen, filters } = props;
  const [selectedTab, setSelectedTab] = useTabs(['highlights']);
  const [activitiesWidgetResponse, setActivitiesWidgetResponse] = useState<ActivitiesWidgetData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultTab = 'highlights';

  const workspaceIdToken = useAppSelector((state) => state.auth.workspaceId);

  const widgetPreviewLocation = window.location.href.includes('/report-details');

  useEffect(() => {
    if (isManageMode === false && !isSidePanelOpen) {
      if (filters?.startDate && filters?.endDate) {
        getActivityWidgetData();
      }
    }
  }, filters && Object.values(filters));

  const workspaceId = getLocalWorkspaceId();

  // eslint-disable-next-line space-before-function-paren
  const getActivityWidgetData = async () => {
    setIsLoading(true);
    const newFilter = { ...filters };
    newFilter['type'] = defaultTab ? defaultTab : selectedTab as string;
    newFilter['limit'] = 5;
    const data: ActivitiesWidgetData[] = await activitiesWidgetDataService(workspaceId || workspaceIdToken, newFilter);
    setActivitiesWidgetResponse(data);
    setIsLoading(false);
  };

  const handleRemove = () => {
    removeWidgetFromDashboard(widget);
  };

  return (
    <div className={`${!isManageMode ? 'h-full' : 'cursor-grabbing my-6 '}  `}>
      <div className='mb-6'>
        <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Highlights</h3>
      </div>
      <div
        className={`w-full  box-border bg-white dark:bg-secondaryDark dark:text-white  rounded-0.6 mt-1.868 border
         ${isManageMode ? 'widget-border relative h-full' : 'border-borderPrimary '} dark:border-borderDark shadow-profileCard  h-[85%]`}
      >
        <div className="w-full mt-6 flex flex-col">
          <nav>
            <TabSelector
              isActive={selectedTab === 'highlights'}
              onClick={() => setSelectedTab('highlights')}
              style={`ml-1.625 mt-0.438 ${isManageMode ? 'text-sm' : 'text-xs'} pb-2  border-transparent`}
              styleActive={'gradient-bottom-border'}
            >
              Highlights
            </TabSelector>
          </nav>
          <div className={`items-center relative block section overflow-y-auto ${!widgetPreviewLocation ? 'h-14.375' : ''}`}>
            {!activitiesWidgetResponse?.length && !isLoading && !isManageMode && !isSidePanelOpen && (
              <div className="flex items-center justify-center font-Poppins font-normal text-xs text-infoBlack h-full">No data available</div>
            )}

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

export default Highlights;
