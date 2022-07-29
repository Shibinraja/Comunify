import React from 'react';
// import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
// import membersSlice from 'modules/members/store/slice/members.slice';
// import { useEffect } from 'react';
// import { AppDispatch } from '../../store/index';

const QuickInfo: React.FC = () => (
  //   const dispatch: AppDispatch = useAppDispatch();

  //   const {membersActiveCountData,membersTotalCountData,membersInActiveCountData,membersNewCountData} = useAppSelector((state) => state.members);

  //   useEffect(()=>{
  //     dispatch(membersSlice.actions.membersActiveCount());
  //     dispatch(membersSlice.actions.membersTotalCount());
  //     dispatch(membersSlice.actions.membersNewCount());
  //     dispatch(membersSlice.actions.membersInActiveCount());
  //   },[]);

  <div className="container mx-auto mt-5 ">
    <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18">Quick Info</h3>
    <div className="grid grid-cols-4 info-data py-6 box-border bg-white  rounded-0.6 mt-1.868 app-input-card-border shadow-profileCard">
      <div className="flex flex-col justify-center items-center">
        <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">162.9K</div>
        <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-success">New Members</div>
        <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs">10% Increase from last week</div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">4.3K</div>
        <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-primary">Active Members</div>
        <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs">12% Increase from last week</div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">2.1K</div>
        <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-warn">Inactive Members</div>
        <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs">3% Decrease from last week</div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">541</div>
        <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-info">New Activities</div>
        <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs">16% Decrease from last week</div>
      </div>
    </div>
  </div>
);
export default QuickInfo;
