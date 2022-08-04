/* eslint-disable no-console */
import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import membersSlice from '../../store/slice/members.slice';
import { MemberGraphProps } from '../../interface/members.interface';

const MembersProfileGraph: React.FC<MemberGraphProps> = ({ activityGraphData }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(membersSlice.actions.getMembersActivityGraphData({ memberId: 'e2612c51-a300-4c5e-8afe-a6585d24f7fc' }));
  }, []);

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
