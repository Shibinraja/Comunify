/* eslint-disable indent */
import React, { PropsWithChildren } from 'react';
import Chart from 'react-apexcharts';
import Skeleton from 'react-loading-skeleton';
import { count_5 } from 'constants/constants';
import { memberGrowthWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { MembersProfileActivityGraphData } from '../../../modules/members/interface/members.interface';
import { useSearchParams } from 'react-router-dom';

import { WidgetComponentProps } from '../../../common/widgetLayout/WidgetTypes';

function InlineWrapperWithMargin({ children }: PropsWithChildren<unknown>) {
  return <span style={{ marginRight: '0.5rem' }}>{children}</span>;
}

const MemberGrowth: React.FC<WidgetComponentProps> = (props: WidgetComponentProps) => {
  const { isManageMode, removeWidgetFromDashboard, widget, isSidePanelOpen } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [memberGrowthWidgetData, setMemberGrowthWidgetData] = React.useState<MembersProfileActivityGraphData>();
  const options = {
    xaxis: {
      categories: !isManageMode
        ? memberGrowthWidgetData?.xAxis
          ? memberGrowthWidgetData.xAxis
          : []
        : ['27 Dec 2022', '28 Dec 2022', '29 Dec 2022', '30 Dec 2022', '1 Jan 2022', '2 Jan 2022', '3 Jan 2022']
    }
  };

  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  React.useEffect(() => {
    if (isManageMode === false && !isSidePanelOpen) {
      getMemberGrowthWidgetData();
    }
  }, [isManageMode]);

  React.useEffect(() => {
    if (isManageMode === false && !isSidePanelOpen) {
      if (startDate && endDate) {
        getMemberGrowthWidgetData();
      }
    }
  }, [startDate, endDate]);

  const workspaceId = getLocalWorkspaceId();

  // eslint-disable-next-line space-before-function-paren
  const getMemberGrowthWidgetData = async () => {
    setIsLoading(true);
    const data: MembersProfileActivityGraphData = await memberGrowthWidgetDataService(
      workspaceId,
      startDate ? startDate : undefined,
      endDate ? endDate : undefined
    );
    setMemberGrowthWidgetData(data);
    setIsLoading(false);
  };

  const handleRemove = () => {
    removeWidgetFromDashboard(widget);
  };

  return (
    <div className={`my-6 ${
      !isManageMode ? '' : 'cursor-grabbing'
   }  `}>
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white ">Member Growth</h3>
      <div className={`my-6 pb-10 bg-white dark:bg-secondaryDark dark:text-white rounded-0.6 border  
         dark:border-borderDark shadow-profileCard ${isManageMode ? 'widget-border relative' : 'border-borderPrimary'}`}>
        {!isManageMode && !isSidePanelOpen ? (
          <div className="relative h-[15rem] mt-7 bg-white rounded-xl">
            {isLoading ? (
              <Skeleton count={count_5} width={500} className={'m-4'} wrapper={InlineWrapperWithMargin} />
            ) : (
              <Chart
                options={options}
                type="line"
                series={memberGrowthWidgetData?.series ? memberGrowthWidgetData?.series : []}
                width="100%"
                height="100%"
              />
            )}
            {Boolean(memberGrowthWidgetData?.series.length) === false && !isLoading && (
              <div
                className={`absolute top-24 font-Poppins text-infoBlack  ${
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
                  ? memberGrowthWidgetData?.series
                    ? memberGrowthWidgetData?.series
                    : []
                  : [
                      { name: 'Slack', data: [0, 0, 0, 3, 0, 0, 0] },
                      { name: 'Vanilla', data: [0, 0, 0, 1, 0, 0, 0] },
                      { name: 'Khoros', data: [0, 0, 0, 3, 1, 0, 0] }
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

export default MemberGrowth;
