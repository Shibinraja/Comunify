import React from 'react';
import Chart from 'react-apexcharts';
import { MemberGraphProps } from '../../interface/members.interface';

const MembersProfileGraph: React.FC<MemberGraphProps> = ({ activityGraphData }) => {
  const options = {
    xaxis: {
      categories: activityGraphData?.xAxis
    }
  };

  return (
    <div className="h-[18.75rem]">
      <Chart options={options} type="line" series={activityGraphData?.series} width="100%" height="100%" />
    </div>
  );
};

export default MembersProfileGraph;
