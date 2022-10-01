import React, { Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { quickInfoWidgetService } from '../../../modules/dashboard/services/dashboard.services';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { QuickInfoData } from '../../../modules/dashboard/interface/dashboard.interface';

import { WidgetComponentProps } from '../../../common/widgetLayout/WidgetTypes';

const QuickInfo: React.FC<WidgetComponentProps> = (props: WidgetComponentProps) => {
  const { isManageMode, removeWidgetFromDashboard, widget, isShrunk } = props;
  const [quickInfoWidgetData, setQuickInfoWidgetData] = React.useState<QuickInfoData[] | []>();
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const workspaceId = getLocalWorkspaceId();

  React.useEffect(() => {
    getQuickInfoWidgetData();
  }, []);

  // eslint-disable-next-line space-before-function-paren
  const getQuickInfoWidgetData = async () => {
    const data: QuickInfoData[] = await quickInfoWidgetService(workspaceId, startDate ? startDate : undefined, endDate ? endDate : undefined);
    setQuickInfoWidgetData(data);
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

  React.useEffect(() => {
    if (startDate && endDate) {
      getQuickInfoWidgetData();
    }
  }, [startDate, endDate]);

  const handleRemove = () => {
    removeWidgetFromDashboard(widget);
  };

  return (
    <div className={`my-6`}>
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Quick Info</h3>
      <div
        className={`grid ${
          isShrunk ? 'grid-cols-2 ' : !isManageMode ? 'grid-cols-4 w-full' : 'grid-cols-4 widget-border relative w-full'
        }  info-data py-6 box-border bg-white dark:bg-secondaryDark
        rounded-0.6 mt-1.868 border border-borderPrimary dark:border-borderDark shadow-profileCard`}
      >
        <div className="flex flex-col justify-center items-center">
          <Fragment>
            <div
              className={`leading-3.18 text-infoBlack font-Poppins ${isShrunk ? 'text-[1.5858rem]' : 'text-signIn'}  font-semibold dark:text-white`}
            >
              {newActivitiesData?.count}
            </div>
            <div className={`mt-0.1512 ${isShrunk ? 'text-[0.5052rem]' : 'text-member'}  font-semibold font-Poppins leading-4 text-success`}>
              {newActivitiesData?.title}
            </div>
            <div
              className={`mt-0.1512 font-Poppins font-normal text-status leading-1.12 ${
                isShrunk ? 'text-[0.5597rem]' : 'text-xs'
              }  dark:text-greyDark`}
            >
              {newActivitiesData?.analyticMessage}
            </div>
          </Fragment>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Fragment>
            <div
              className={`leading-3.18 text-infoBlack font-Poppins ${isShrunk ? 'text-[1.5858rem]' : 'text-signIn'} font-semibold dark:text-white`}
            >
              {newMembersData?.count}
            </div>
            <div className={`mt-0.1512 ${isShrunk ? 'text-[0.5052rem]' : 'text-member'} font-semibold font-Poppins leading-4 text-primary`}>
              {newMembersData?.title}
            </div>
            <div
              className={`mt-0.1512 font-Poppins font-normal text-status leading-1.12  ${
                isShrunk ? 'text-[0.5597rem]' : 'text-xs'
              } dark:text-greyDark`}
            >
              {newMembersData?.analyticMessage}
            </div>
          </Fragment>
        </div>
        <div className={`flex flex-col justify-center items-center ${isShrunk ? 'hidden' : 'block'}`}>
          <Fragment>
            <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold dark:text-white">{activeMembersData?.count}</div>
            <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-warn">{activeMembersData?.title}</div>
            <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs dark:text-greyDark">
              {activeMembersData?.analyticMessage}
            </div>
          </Fragment>
        </div>
        <div className={`flex flex-col justify-center items-center ${isShrunk ? 'hidden' : 'block'}`}>
          <Fragment>
            <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold dark:text-white">{inActiveMembersData?.count}</div>
            <div className="mt-0.1512 text-member font-semibold font-Poppins leading-4 text-info">{inActiveMembersData?.title}</div>
            <div className="mt-0.1512 font-Poppins font-normal text-status leading-1.12 text-xs dark:text-greyDark">
              {inActiveMembersData?.analyticMessage}
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
