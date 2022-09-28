import React, { PropsWithChildren } from 'react';
import Chart from 'react-apexcharts';
import Skeleton from 'react-loading-skeleton';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import membersSlice from 'modules/members/store/slice/members.slice';
import { count_5 } from 'constants/constants';
import { memberGrowthWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { MembersProfileActivityGraphData } from '../../../modules/members/interface/members.interface';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

function InlineWrapperWithMargin({ children }: PropsWithChildren<unknown>) {
  return <span style={{ marginRight: '0.5rem' }}>{children}</span>;
}

const MemberGrowth: React.FC = () => {
  const [memberGrowthWidgetData, setMemberGrowthWidgetData] = React.useState<MembersProfileActivityGraphData>();
  const options = {
    xaxis: {
      categories: memberGrowthWidgetData?.xAxis ? memberGrowthWidgetData.xAxis : []
    }
  };

  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const location = useLocation();
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [isDrag, setIsDrag] = React.useState<boolean>(true);

  React.useEffect(() => {
    getMemberGrowthWidgetData();
  }, []);

  React.useEffect(() => {
    if (startDate && endDate) {
      getMemberGrowthWidgetData();
    }
  }, [startDate, endDate]);

  const workspaceId = getLocalWorkspaceId();

  const graphDataLoader = useSkeletonLoading(membersSlice.actions.getMembersActivityGraphData.type);

  // eslint-disable-next-line space-before-function-paren
  const getMemberGrowthWidgetData = async () => {
    const data: MembersProfileActivityGraphData = await memberGrowthWidgetDataService(
      workspaceId,
      startDate ? startDate : undefined,
      endDate ? endDate : undefined
    );
    setMemberGrowthWidgetData(data);
  };

  const setWidgetNameAsParams = () => {
    const params = { widgetName: 'MemberGrowth' };
    navigate({ pathname: location.pathname, search: `?${createSearchParams(params)}` });
  };

  return (
    <div className={`my-6 rounded-0.6 p-5 pb-10 ${isDrag ? 'widget-border relative' : 'border-borderPrimary'}`}>
      <div>
        <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white ml-4">Member Growth</h3>
      </div>
      <div className="relative h-[15rem] mt-7 bg-white rounded-xl">
        {graphDataLoader ? (
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
        {Boolean(memberGrowthWidgetData?.series.length) === false && (
          <div className="absolute top-24 font-Poppins text-infoBlack text-lg font-normal flex justify-center items-center w-full">
            <h4>No data available</h4>
          </div>
        )}
      </div>
      <div
        onClick={setWidgetNameAsParams}
        className="absolute -right-3 bg-widgetClose rounded-full flex items-center justify-center h-6 w-6 text-white text-2xl -top-3 cursor-pointer"
      >
        -
      </div>
    </div>
  );
};

export default MemberGrowth;
