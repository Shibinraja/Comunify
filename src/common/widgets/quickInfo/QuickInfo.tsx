import React, { FC, Fragment, useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
import { quickInfoWidgetService } from '../../../modules/dashboard/services/dashboard.services';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { QuickInfoData } from '../../../modules/dashboard/interface/dashboard.interface';

import { WidgetComponentProps } from '../../../common/widgetLayout/WidgetTypes';
import Skeleton from 'react-loading-skeleton';
import { useAppSelector } from '@/hooks/useRedux';

const QuickInfo: FC<WidgetComponentProps> = (props: WidgetComponentProps) => {
  const { isManageMode, removeWidgetFromDashboard, widget, isShrunk, isSidePanelOpen, filters } = props;
  const [quickInfoWidgetData, setQuickInfoWidgetData] = useState<QuickInfoData[] | []>();
  const workspaceIdToken = useAppSelector((state) => state.auth.workspaceId);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const workspaceId = getLocalWorkspaceId();

  useEffect(() => {
    if (isManageMode === false && !isSidePanelOpen) {
      getQuickInfoWidgetData();
    }
  }, [isManageMode]);

  useEffect(() => {
    if (isManageMode === false) {
      if (filters?.startDate && filters?.endDate) {
        getQuickInfoWidgetData();
      }
    }
  }, filters && Object.values(filters));

  // eslint-disable-next-line space-before-function-paren
  const getQuickInfoWidgetData = async () => {
    setIsLoading(true);
    const data: QuickInfoData[] = await quickInfoWidgetService(workspaceId || workspaceIdToken, filters);
    setQuickInfoWidgetData(data);
    setIsLoading(false);
  };

  const newMembersData: QuickInfoData | undefined = quickInfoWidgetData?.find(
    (data: QuickInfoData) => data?.title.toLocaleLowerCase().trim() === 'new members'
  );

  const activeMembersData: QuickInfoData | undefined = quickInfoWidgetData?.find(
    (data: QuickInfoData) => data?.title.toLocaleLowerCase().trim() === 'active members'
  );

  const inActiveMembersData: QuickInfoData | undefined = quickInfoWidgetData?.find(
    (data: QuickInfoData) => data?.title.toLocaleLowerCase().trim() === 'inactive members'
  );

  const newActivitiesData: QuickInfoData | undefined = quickInfoWidgetData?.find(
    (data: QuickInfoData) => data?.title.toLocaleLowerCase().trim() === 'new activities'
  );

  const handleRemove = () => {
    removeWidgetFromDashboard(widget);
  };

  return (
    <div className={`mt-6 ${isShrunk ? 'cursor-grabbing ' : !isManageMode ? '' : 'cursor-grabbing'}  `}>
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Quick Info</h3>
      <div
        className={`grid ${
          isShrunk ? 'grid-cols-2 h-[137px]' : !isManageMode ? 'grid-cols-4 w-full' : 'grid-cols-4 widget-border relative w-full'
        }  info-data py-6 box-border bg-white dark:bg-secondaryDark
        rounded-0.6 mt-1.868 border border-borderPrimary dark:border-borderDark shadow-profileCard`}
      >
        <div className="flex flex-col justify-center items-center">
          <Fragment>
            <div
              className={`leading-1 text-infoBlack font-Poppins ${isShrunk ? 'text-[1.5858rem]' : 'text-signIn'}  font-semibold dark:text-white`}
            >
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  newActivitiesData?.count
                ) : (
                  <Skeleton width={20} height={30} count={1} />
                )
              ) : (
                56
              )}
            </div>
            <div className={`mt-0.1512 ${isShrunk ? 'text-[0.5052rem]' : 'text-member'}  font-semibold font-Poppins leading-4 text-success`}>
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  newActivitiesData?.title ? (
                    newActivitiesData?.title
                  ) : (
                    'New Activities'
                  )
                ) : (
                  <Skeleton width={80} height={15} count={1} />
                )
              ) : (
                'New Activities'
              )}
            </div>
            <div
              className={`mt-0.1512 font-Poppins font-normal text-status leading-1.12 ${
                isShrunk ? 'text-[0.5597rem]' : 'text-xs'
              }  dark:text-greyDark`}
            >
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  newActivitiesData?.analyticMessage ? (
                    newActivitiesData?.analyticMessage
                  ) : (
                    'No data available'
                  )
                ) : (
                  <Skeleton width={190} height={15} count={1} />
                )
              ) : (
                '10.05% increase from last 7 days'
              )}
            </div>
          </Fragment>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Fragment>
            <div
              className={`leading-2 text-infoBlack font-Poppins ${isShrunk ? 'text-[1.5858rem]' : 'text-signIn'} font-semibold dark:text-white`}
            >
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  newMembersData?.count
                ) : (
                  <Skeleton width={20} height={30} count={1} />
                )
              ) : (
                7563
              )}
            </div>
            <div className={`mt-0.1512 ${isShrunk ? 'text-[0.5052rem]' : 'text-member'} font-semibold font-Poppins leading-4 text-primary`}>
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  newMembersData?.title ? (
                    newMembersData?.title
                  ) : (
                    'New Members'
                  )
                ) : (
                  <Skeleton width={80} height={15} count={1} />
                )
              ) : (
                'New Members'
              )}
            </div>
            <div
              className={`mt-0.1512 font-Poppins font-normal text-status leading-1.12  ${
                isShrunk ? 'text-[0.5597rem]' : 'text-xs'
              } dark:text-greyDark`}
            >
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  newMembersData?.analyticMessage ? (
                    newMembersData?.analyticMessage
                  ) : (
                    'No data available'
                  )
                ) : (
                  <Skeleton width={190} height={15} count={1} />
                )
              ) : (
                '10.05% increase from last 7 days'
              )}
            </div>
          </Fragment>
        </div>
        <div className={`flex flex-col justify-center items-center ${isShrunk ? 'hidden' : 'block'}`}>
          <Fragment>
            <div className="leading-2 text-infoBlack font-Poppins text-signIn font-semibold dark:text-white">
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  activeMembersData?.count
                ) : (
                  <Skeleton width={20} height={30} count={1} />
                )
              ) : (
                6564
              )}
            </div>
            <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-warn">
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  activeMembersData?.title ? (
                    activeMembersData?.title
                  ) : (
                    'Active Members'
                  )
                ) : (
                  <Skeleton width={80} height={15} count={1} />
                )
              ) : (
                'Active Members'
              )}
            </div>
            <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs dark:text-greyDark">
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  activeMembersData?.analyticMessage ? (
                    activeMembersData?.analyticMessage
                  ) : (
                    'No data available'
                  )
                ) : (
                  <Skeleton width={190} height={15} count={1} />
                )
              ) : (
                '10.05% increase from last 7 days'
              )}
            </div>
          </Fragment>
        </div>
        <div className={`flex flex-col justify-center items-center ${isShrunk ? 'hidden' : 'block'}`}>
          <Fragment>
            <div className="leading-2 text-infoBlack font-Poppins text-signIn font-semibold dark:text-white">
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  inActiveMembersData?.count
                ) : (
                  <Skeleton width={20} height={30} count={1} />
                )
              ) : (
                34534
              )}
            </div>
            <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-info">
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  inActiveMembersData?.title ? (
                    inActiveMembersData?.title
                  ) : (
                    'Inactive Members'
                  )
                ) : (
                  <Skeleton width={80} height={15} count={1} />
                )
              ) : (
                'Inactive Members'
              )}
            </div>
            <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs dark:text-greyDark">
              {!isManageMode && !isSidePanelOpen ? (
                !isLoading ? (
                  inActiveMembersData?.analyticMessage ? (
                    inActiveMembersData?.analyticMessage
                  ) : (
                    'No data available'
                  )
                ) : (
                  <Skeleton width={190} height={15} count={1} />
                )
              ) : (
                '10.05% increase from last 7 days'
              )}
            </div>
          </Fragment>
        </div>
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
export default QuickInfo;
