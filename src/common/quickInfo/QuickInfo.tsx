import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import membersSlice from 'modules/members/store/slice/members.slice';
import { useEffect } from 'react';
import { AppDispatch } from '../../store/index';


const QuickInfo: React.FC = () => {

  const dispatch: AppDispatch = useAppDispatch();

  const {membersActiveCountData,membersTotalCountData,membersInActiveCountData,membersNewCountData} = useAppSelector((state) => state.members);

  useEffect(()=>{
    dispatch(membersSlice.actions.membersActiveCount());
    dispatch(membersSlice.actions.membersTotalCount());
    dispatch(membersSlice.actions.membersNewCount());
    dispatch(membersSlice.actions.membersInActiveCount());
  },[]);

  return (
    <div className="container mx-auto mt-5 ">
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18">Quick Info</h3>
      <div className="grid grid-cols-4 info-data h-8.37 box-border bg-white  rounded-0.6 mt-1.868 app-input-card-border shadow-profileCard">
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">{membersNewCountData.count}</div>
          <div className="mt-0.15 text-member font-semibold font-Poppins leading-4 text-success">{membersNewCountData.title}</div>
          <div className="mt-0.15 font-Poppins font-normal text-status leading-1.12 text-xs">{membersNewCountData.analyticMessage}</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">{membersActiveCountData.count}</div>
          <div className="mt-0.15 text-member font-semibold font-Poppins leading-4 text-primary">{membersActiveCountData.title}</div>
          <div className="mt-0.15 font-Poppins font-normal text-status leading-1.12 text-xs">{membersActiveCountData.analyticMessage}</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">{membersInActiveCountData.count}</div>
          <div className="mt-0.15 text-member font-semibold font-Poppins leading-4 text-warn">{membersInActiveCountData.title}</div>
          <div className="mt-0.15 font-Poppins font-normal text-status leading-1.12 text-xs">{membersInActiveCountData.analyticMessage}</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">{membersTotalCountData.count}</div>
          <div className="mt-0.15 text-member font-semibold font-Poppins leading-4 text-info">{membersTotalCountData.title}</div>
          <div className="mt-0.15 font-Poppins font-normal text-status leading-1.12 text-xs">{membersTotalCountData.analyticMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default QuickInfo;