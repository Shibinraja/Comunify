import React, { PropsWithChildren } from 'react';
import Chart from 'react-apexcharts';
import Skeleton from 'react-loading-skeleton';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import membersSlice from 'modules/members/store/slice/members.slice';
import { count_5 } from 'constants/constants';
import { activityGrowthWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { MembersProfileActivityGraphData } from '../../../modules/members/interface/members.interface';
import { useSearchParams } from 'react-router-dom';

import { WidgetComponentProps } from '../../../common/widgetLayout/WidgetTypes';

function InlineWrapperWithMargin({ children }: PropsWithChildren<unknown>) {
  return <span style={{ marginRight: '0.5rem' }}>{children}</span>;
}

const workspaceId = getLocalWorkspaceId();

const ActivityGrowth: React.FC<WidgetComponentProps> = (props: WidgetComponentProps) => {
  const { isManageMode, removeWidgetFromDashboard, widget } = props;

  const [activityGrowthWidgetData, setActivityGrowthWidgetData] = React.useState<MembersProfileActivityGraphData>();

  const options = {
    xaxis: {
      categories: activityGrowthWidgetData?.xAxis ? activityGrowthWidgetData?.xAxis : []
    }
  };

  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  React.useEffect(() => {
    getActivityGrowthData();
  }, []);

  React.useEffect(() => {
    if (startDate && endDate) {
      getActivityGrowthData();
    }
  }, [startDate, endDate]);

  // eslint-disable-next-line space-before-function-paren
  const getActivityGrowthData = async () => {
    const data: MembersProfileActivityGraphData = await activityGrowthWidgetDataService(
      workspaceId,
      startDate ? startDate : undefined,
      endDate ? endDate : undefined
    );
    setActivityGrowthWidgetData(data);
  };

  const handleRemove = () => {
    removeWidgetFromDashboard(widget);
  };

  const graphDataLoader = useSkeletonLoading(membersSlice.actions.getMembersActivityGraphData.type);

  return (
    <div>
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Activity Growth</h3>
      <div className={`my-6 rounded-0.6 pb-10 ${isManageMode ? 'widget-border relative' : 'border-borderPrimary'}`}>
        <div className="relative h-[15rem] mt-7 bg-white rounded-xl">
          {graphDataLoader ? (
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
          {Boolean(activityGrowthWidgetData?.series.length) === false && (
            <div
              className={`absolute font-Poppins text-infoBlack ${
                isManageMode ? 'text-lg top-24 ' : 'text-xs top-28'
              } font-normal flex justify-center items-center w-full`}
            >
              <h4>No data available</h4>
            </div>
          )}
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

export default ActivityGrowth;
