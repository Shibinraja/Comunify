import React, { useState } from 'react';
import { useTabs } from '@/hooks/useTabs';
import { TabSelector } from 'common/tabs/TabSelector';
import NewActivitiesList from './NewActivitiesList';
import { activitiesWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { ActivitiesWidgetData } from '../../../modules/dashboard/interface/dashboard.interface';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const ActivitiesTab: React.FC = () => {
  const [selectedTab, setSelectedTab] = useTabs(['new activities', 'highlights']);
  const [activitiesWidgetResponse, setActivitiesWidgetResponse] = React.useState<ActivitiesWidgetData[]>();

  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  // eslint-disable-next-line no-unused-vars
  const [isDrag, setIsDrag] = useState<boolean>(true);

  React.useEffect(() => {
    getActivityWidgetData();
  }, [selectedTab]);

  React.useEffect(() => {
    if (startDate && endDate) {
      getActivityWidgetData();
    }
  }, [startDate, endDate]);

  const workspaceId = getLocalWorkspaceId();
  const location = useLocation();
  const navigate = useNavigate();

  // eslint-disable-next-line space-before-function-paren
  const getActivityWidgetData = async () => {
    const data: ActivitiesWidgetData[] = await activitiesWidgetDataService(
      workspaceId,
      selectedTab ? selectedTab : '',
      startDate ? startDate : undefined,
      endDate ? endDate : undefined
    );
    setActivitiesWidgetResponse(data);
  };

  const setWidgetNameAsParams = () => {
    const params = { widgetName: 'ActivitiesTab' };
    navigate({ pathname: location.pathname, search: `?${createSearchParams(params)}` });
  };

  return (
    <div className="my-6">
      <div>
        <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Activities Tab</h3>
      </div>
      <div
        className={`w-full h-full box-border bg-white dark:bg-secondaryDark dark:text-white  rounded-0.6 mt-1.868 border
           ${isDrag ? 'widget-border relative' : 'border-borderPrimary'} dark:border-borderDark shadow-profileCard `}
      >
        <div className="w-full mt-6 flex flex-col ">
          <nav>
            <TabSelector
              isActive={selectedTab === 'new activities'}
              onClick={() => setSelectedTab('new activities')}
              style={'ml-1.625 mt-0.438 text-sm pb-2  border-transparent'}
              styleActive={'gradient-bottom-border'}
            >
              New Activities
            </TabSelector>
            <TabSelector
              isActive={selectedTab === 'highlights'}
              onClick={() => setSelectedTab('highlights')}
              style={'ml-1.625 mt-0.438 text-sm pb-2  border-transparent'}
              styleActive={'gradient-bottom-border'}
            >
              Highlights
            </TabSelector>
          </nav>
          <div className="h-14.375 items-center relative overflow-y-auto block section ">
            <NewActivitiesList hidden={false} activitiesWidgetData={activitiesWidgetResponse ? activitiesWidgetResponse : []} />
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

export default ActivitiesTab;
