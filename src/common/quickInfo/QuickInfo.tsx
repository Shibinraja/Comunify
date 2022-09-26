/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import membersSlice from 'modules/members/store/slice/members.slice';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import { count_3, width_90 } from 'constants/constants';

const QuickInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const { workspaceId } = useParams();
  const membersCountAnalyticsLoading = useSkeletonLoading(membersSlice.actions.membersCountAnalytics.type);
  const membersActivityAnalyticsLoading = useSkeletonLoading(membersSlice.actions.membersActivityAnalytics.type);
  // eslint-disable-next-line no-unused-vars
  const [isDrag, setIsDrag] = useState(true);

  useEffect(() => {
    dispatch(membersSlice.actions.membersCountAnalytics({ workspaceId: workspaceId! }));
    dispatch(membersSlice.actions.membersActivityAnalytics({ workspaceId: workspaceId! }));
  }, []);

  const {
    membersCountAnalyticsData: { totalMembers, newMembers },
    membersActivityAnalyticsData: { activeMembers, inActiveMembers }
  } = useAppSelector((state) => state.members);

  return (
    <div className="mt-5 ">
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Quick Info</h3>
      <div
        // eslint-disable-next-line max-len
        className={`grid ${isDrag ? 'grid-cols-2 widget-border relative' : 'grid-cols-4'}  info-data py-6 box-border bg-white dark:bg-secondaryDark  
        rounded-0.6 mt-1.868 border border-borderPrimary dark:border-borderDark shadow-profileCard`}
      >
        <div className="flex flex-col justify-center items-center">
          {membersCountAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div
                className={`leading-3.18 text-infoBlack font-Poppins ${isDrag ? 'text-[1.5858rem]' : 'text-signIn'}  font-semibold dark:text-white`}
              >
                {totalMembers.count}
              </div>
              <div className={`mt-0.1512 ${isDrag ? 'text-[0.5052rem]' : 'text-member'}  font-semibold font-Poppins leading-4 text-success`}>
                {totalMembers.title}
              </div>
              <div
                className={`mt-0.1512 font-Poppins font-normal text-status leading-1.12 ${
                  isDrag ? 'text-[0.5597rem]' : 'text-xs'
                }  dark:text-greyDark`}
              >
                {totalMembers.analyticMessage}
              </div>
            </Fragment>
          )}
        </div>
        <div className="flex flex-col justify-center items-center">
          {membersCountAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div
                className={`leading-3.18 text-infoBlack font-Poppins ${isDrag ? 'text-[1.5858rem]' : 'text-signIn'} font-semibold dark:text-white`}
              >
                {newMembers.count}
              </div>
              <div className={`mt-0.1512 ${isDrag ? 'text-[0.5052rem]' : 'text-member'} font-semibold font-Poppins leading-4 text-primary`}>
                {newMembers.title}
              </div>
              <div
                className={`mt-0.1512 font-Poppins font-normal text-status leading-1.12  ${
                  isDrag ? 'text-[0.5597rem]' : 'text-xs'
                } dark:text-greyDark`}
              >
                {newMembers.analyticMessage}
              </div>
            </Fragment>
          )}
        </div>
        <div className={`flex flex-col justify-center items-center ${isDrag ? 'hidden' : 'block'}`}>
          {membersActivityAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold dark:text-white">{activeMembers.count}</div>
              <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-warn">{activeMembers.title}</div>
              <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs dark:text-greyDark">
                {activeMembers.analyticMessage}
              </div>
            </Fragment>
          )}
        </div>
        <div className={`flex flex-col justify-center items-center ${isDrag ? 'hidden' : 'block'}`}>
          {membersActivityAnalyticsLoading ? (
            <Skeleton count={count_3} width={width_90} />
          ) : (
            <Fragment>
              <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold dark:text-white">{inActiveMembers.count}</div>
              <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-info">{inActiveMembers.title}</div>
              <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs dark:text-greyDark">
                {inActiveMembers.analyticMessage}
              </div>
            </Fragment>
          )}
        </div>
        <div className="absolute -right-3 bg-widgetClose rounded-full flex items-center justify-center h-6 w-6 text-white text-2xl -top-3">-</div>
      </div>
    </div>
  );
};
export default QuickInfo;
