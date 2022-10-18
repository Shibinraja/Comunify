/* eslint-disable indent */
import React, { PropsWithChildren } from 'react';
import Chart from 'react-apexcharts';
import Skeleton from 'react-loading-skeleton';
import { count_5 } from 'constants/constants';
import { activityGrowthWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { MembersProfileActivityGraphData } from '../../../modules/members/interface/members.interface';
import { WidgetComponentProps } from '../../../common/widgetLayout/WidgetTypes';
import { useAppSelector } from '@/hooks/useRedux';

function InlineWrapperWithMargin({ children }: PropsWithChildren<unknown>) {
  return <span style={{ marginRight: '0.5rem' }}>{children}</span>;
}

const workspaceId = getLocalWorkspaceId();

const ActivityGrowth: React.FC<WidgetComponentProps> = (props: WidgetComponentProps) => {
  const { isManageMode, removeWidgetFromDashboard, widget, isSidePanelOpen, filters } = props;
  const [activityGrowthWidgetData, setActivityGrowthWidgetData] = React.useState<MembersProfileActivityGraphData>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const workspaceIdToken = useAppSelector((state) => state.auth.workspaceId);

  const options = {
    xaxis: {
      categories: !isManageMode
        ? activityGrowthWidgetData?.xAxis
          ? activityGrowthWidgetData?.xAxis
          : []
        : ['25 June 2022', '28 June 2022', '29 June 2022', '30 June 2022', '1 July 2022', '2 July 2022', '3 July 2022']
    }
  };

  React.useEffect(() => {
    if (isManageMode === false && !isSidePanelOpen) {
      getActivityGrowthData();
    }
  }, [isManageMode]);

  React.useEffect(() => {
    if (isManageMode === false && !isSidePanelOpen) {
      if (filters?.startDate && filters?.endDate) {
        getActivityGrowthData();
      }
    }
  }, filters && Object.values(filters));

  // eslint-disable-next-line space-before-function-paren
  const getActivityGrowthData = async () => {
    setIsLoading(true);
    const data: MembersProfileActivityGraphData = await activityGrowthWidgetDataService(workspaceId || workspaceIdToken, filters);
    setActivityGrowthWidgetData(data);
    setIsLoading(false);
  };

  const handleRemove = () => {
    removeWidgetFromDashboard(widget);
  };

  return (
    <div className={`mt-6 ${!isManageMode ? '' : 'cursor-grabbing'}  `}>
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Activity Growth</h3>
      <div
        className={`my-6 pb-10 bg-white dark:bg-secondaryDark dark:text-white rounded-0.6 border  
         dark:border-borderDark shadow-profileCard  h-[85%]${isManageMode ? 'widget-border relative' : 'border-borderPrimary'}`}
      >
        {!isManageMode && !isSidePanelOpen ? (
          <div className="relative h-[15rem] mt-7 bg-white rounded-xl">
            {isLoading ? (
              <Skeleton count={count_5} width={500} className={'m-4'} wrapper={InlineWrapperWithMargin} />
            ) : (
              <Chart
                options={options}
                type="line"
                series={activityGrowthWidgetData?.series ? activityGrowthWidgetData?.series : []}
                width="100%"
                height="100%"
              />
            )}
            {Boolean(activityGrowthWidgetData?.series?.length) === false && (
              <div
                className={`absolute font-Poppins text-infoBlack ${
                  isManageMode ? 'text-lg top-24 ' : 'text-xs top-28'
                } font-normal flex justify-center items-center w-full`}
              >
                <h4>No data available</h4>
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-[15rem] mt-7 bg-white rounded-xl">
            <Chart
              options={options}
              type="line"
              series={
                !isManageMode && !isSidePanelOpen
                  ? activityGrowthWidgetData?.series
                    ? activityGrowthWidgetData?.series
                    : []
                  : [
                      { name: 'Slack', data: [0, 1, 0, 3, 1, 1, 0] },
                      { name: 'Vanilla', data: [0, 2, 3, 1, 0, 0, 0] },
                      { name: 'Khoros', data: [0, 2, 0, 3, 1, 0, 0] }
                    ]
              }
              width="100%"
              height="100%"
            />
          </div>
        )}

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

export default ActivityGrowth;
