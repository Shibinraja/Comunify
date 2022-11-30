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

  const handleCount = (num: number) => {
    if (num < 1000) {
      return num;
    }
    const series = [
      { v: 1e3, s: 'K' },
      { v: 1e6, s: 'M' },
      { v: 1e9, s: 'B' }
    ];
    let index;
    for (index = series.length - 1; index > 0 && num < series[index].v; index--) {
      /*empty statement*/
    }
    return (num / series[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + series[index].s;
  };

  return (
    <div className="">
      <div className="flex gap-2.28">
        <div className="flex  flex-col items-center justify-center bg-member1 rounded-0.9 w-full h-8.34 cursor-auto">
          {membersCountAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18 cursor-auto">{handleCount(totalMembers.count)}</div>
              <div className="font-Poppins font-semibold text-infoBlack text-member leading-4">{totalMembers.title}</div>
              <div className="text-[8px] xl:text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">{totalMembers.analyticMessage}</div>
            </Fragment>
          )}
        </div>
        <div className=" flex-col items-center justify-center flex bg-member2 rounded-0.9 w-full h-8.34 cursor-auto">
          {membersCountAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18 cursor-auto">{handleCount(newMembers.count)}</div>
              <div className="font-Poppins font-semibold text-infoBlack text-member leading-4">{newMembers.title}</div>
              <div className="text-[8px] xl:text-card  font-Poppins font-normal leading-1.12 text-status mt-0.151">{newMembers.analyticMessage}</div>
            </Fragment>
          )}
        </div>
        <div className=" flex-col items-center justify-center flex bg-member3 rounded-0.9 w-full h-8.34 cursor-auto">
          {membersActivityAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18 cursor-auto">{handleCount(activeMembers.count)}</div>
              <div className="font-Poppins font-semibold text-infoBlack text-member leading-4">{activeMembers.title}</div>
              <div className="text-[8px] xl:text-card  font-Poppins font-normal leading-1.12 text-status mt-0.151">
                {activeMembers.analyticMessage}
              </div>
            </Fragment>
          )}
        </div>
        <div className=" flex-col items-center justify-center flex bg-member4 rounded-0.9 w-full h-8.34 cursor-auto">
          {membersActivityAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18 cursor-auto">
                {handleCount(inActiveMembers.count)}
              </div>
              <div className="font-Poppins font-semibold text-infoBlack text-member leading-4">{inActiveMembers.title}</div>
              <div className="text-[8px] xl:text-card  font-Poppins font-normal leading-1.12 text-status mt-0.151">
                {inActiveMembers.analyticMessage}
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersCard;
