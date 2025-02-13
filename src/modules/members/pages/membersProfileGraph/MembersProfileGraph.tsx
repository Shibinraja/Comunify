import React, { PropsWithChildren } from 'react';
import Chart from 'react-apexcharts';
import { MemberGraphProps } from '../../interface/members.interface';
import Skeleton from 'react-loading-skeleton';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import membersSlice from 'modules/members/store/slice/members.slice';
import { count_5 } from 'constants/constants';

function InlineWrapperWithMargin({ children }: PropsWithChildren<unknown>) {
  return <span style={{ marginRight: '0.5rem' }}>{children}</span>;
}

const MembersProfileGraph: React.FC<MemberGraphProps> = ({ activityGraphData }) => {
  const options = {
    chart: {
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: activityGraphData?.xAxis
    }
  };
  const graphDataLoader = useSkeletonLoading(membersSlice.actions.getMembersActivityGraphData.type);

  return (
    <div className="h-[15rem]">
      {graphDataLoader ? (
        <Skeleton count={count_5} width={500} className={'m-4'} wrapper={InlineWrapperWithMargin} />
      ) : (
        activityGraphData.series.length ? (
          <Chart options={options} type="line" series={activityGraphData?.series} width="100%" height="100%" />
        ) : (
          <div className="font-Poppins font-semibold text-base leading-9 text-listGray flex justify-center h-full w-full">No data found</div>
        )
      )}
    </div>
  );
};

export default MembersProfileGraph;
