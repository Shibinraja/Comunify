import { useAppSelector } from '@/hooks/useRedux';
import Skeleton from 'react-loading-skeleton';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import { Fragment } from 'react';
import membersSlice from 'modules/members/store/slice/members.slice';
import { count_3, width_90 } from 'constants/constants';

const MembersCard: React.FC = () => {
  const membersCountAnalyticsLoading = useSkeletonLoading(membersSlice.actions.membersCountAnalytics.type);
  const membersActivityAnalyticsLoading = useSkeletonLoading(membersSlice.actions.membersActivityAnalytics.type);
  const {
    membersCountAnalyticsData: { totalMembers, newMembers },
    membersActivityAnalyticsData: { activeMembers, inActiveMembers }
  } = useAppSelector((state) => state.members);

  return (
    <div className="">
      <div className="flex gap-2.28">
        <div className="flex  flex-col items-center justify-center bg-member1 rounded-0.9 w-full h-8.34 cursor-pointer">
          {membersCountAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">{totalMembers.count}</div>
              <div className="font-Poppins font-semibold text-infoBlack text-member leading-4">{totalMembers.title}</div>
              <div className="text-[8px] xl:text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">{totalMembers.analyticMessage}</div>
            </Fragment>
          )}
        </div>
        <div className=" flex-col items-center justify-center flex bg-member2 rounded-0.9 w-full h-8.34 cursor-pointer">
          {membersCountAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">{newMembers.count}</div>
              <div className="font-Poppins font-semibold text-infoBlack text-member leading-4">{newMembers.title}</div>
              <div className="text-[8px] xl:text-card  font-Poppins font-normal leading-1.12 text-status mt-0.151">{newMembers.analyticMessage}</div>
            </Fragment>
          )}
        </div>
        <div className=" flex-col items-center justify-center flex bg-member3 rounded-0.9 w-full h-8.34 cursor-pointer">
          {membersActivityAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">{activeMembers.count}</div>
              <div className="font-Poppins font-semibold text-infoBlack text-member leading-4">{activeMembers.title}</div>
              <div className="text-[8px] xl:text-card  font-Poppins font-normal leading-1.12 text-status mt-0.151">{activeMembers.analyticMessage}</div>
            </Fragment>
          )}
        </div>
        <div className=" flex-col items-center justify-center flex bg-member4 rounded-0.9 w-full h-8.34 cursor-pointer">
          {membersActivityAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">{inActiveMembers.count}</div>
              <div className="font-Poppins font-semibold text-infoBlack text-member leading-4">{inActiveMembers.title}</div>
              <div className="text-[8px] xl:text-card  font-Poppins font-normal leading-1.12 text-status mt-0.151">{inActiveMembers.analyticMessage}</div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersCard;
