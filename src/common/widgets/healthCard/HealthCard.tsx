/* eslint-disable indent */
/* eslint-disable max-len */
import React, { FC, useEffect, useState } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import healthUpArrowIcon from '../../../assets/images/health-bar-up.svg';
import healthDownArrowIcon from '../../../assets/images/health-bar-down.svg';
import ProgressProvider from './progressProvider';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { healthScoreWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { HealthScoreWidgetData } from '../../widgetLayout/WidgetTypes';
// import { useSearchParams } from 'react-router-dom';

import { WidgetComponentProps } from '../../../common/widgetLayout/WidgetTypes';
import { useAppSelector } from '@/hooks/useRedux';

const HealthCard: FC<WidgetComponentProps> = (props: WidgetComponentProps) => {
  const { isManageMode, removeWidgetFromDashboard, widget, isShrunk, isSidePanelOpen, filters } = props;
  const gradientTransform = `rotate(90)`;

  const workspaceIdToken = useAppSelector((state) => state.auth.workspaceId);
  const workspaceId = getLocalWorkspaceId();

  const [healthScoreData, setHealthScoreData] = useState<HealthScoreWidgetData[] | []>([]);

  useEffect(() => {
    if (!isManageMode && !isSidePanelOpen) {
      fetchHealthScoreWidgetData();
    }
  }, [isManageMode]);

  useEffect(() => {
    if (!isManageMode && !isSidePanelOpen) {
      if (filters?.startDate && filters?.endDate) {
        fetchHealthScoreWidgetData();
      }
    }
  }, filters && Object.values(filters));

  // eslint-disable-next-line space-before-function-paren
  const fetchHealthScoreWidgetData = async () => {
    const response: HealthScoreWidgetData[] = await healthScoreWidgetDataService(workspaceId || workspaceIdToken, filters);
    setHealthScoreData(response);
  };
  const activitiesScoreData: HealthScoreWidgetData | undefined = healthScoreData.find(
    (data: HealthScoreWidgetData) => data?.title.toLocaleLowerCase().trim() === 'activities'
  );
  const membersScoreData: HealthScoreWidgetData | undefined = healthScoreData.find(
    (data: HealthScoreWidgetData) => data?.title.toLocaleLowerCase().trim() === 'members'
  );
  const overallScoreData: HealthScoreWidgetData | undefined = healthScoreData.find(
    (data: HealthScoreWidgetData) => data?.title.toLocaleLowerCase().trim() === 'overall'
  );

  //   const [searchParams] = useSearchParams();
  //   const startDate = searchParams.get('startDate');
  //   const endDate = searchParams.get('endDate');

  const handleRemove = () => {
    removeWidgetFromDashboard(widget);
  };

  return (
    <div className={`mb-6 heathCard ${!isManageMode ? '' : 'cursor-grabbing'}  `}>
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Health</h3>
      <div
        className={`flex  ${isShrunk
            ? 'justify-around w-full gap-5 py-8 px-5 border-borderPrimary '
            : !isManageMode
              ? 'justify-between w-full py-5 px-20'
              : 'justify-between w-full py-5 px-20 widget-border relative '
          }  items-center border-table border  dark:border-borderDark shadow-healtCardShadow dark:shadow-none bg-white dark:bg-secondaryDark  box-border rounded-0.9 mt-5 `}
      >
        <div className="flex items-center">
          <div className={`${!isShrunk ? 'w-[3.1169rem]' : ' w-[3.8831rem]'}`}>
            <ProgressProvider
              valueStart={0}
              valueEnd={!isManageMode && !isSidePanelOpen ? (activitiesScoreData?.percentage ? activitiesScoreData?.percentage : 0) : 45}
            >
              {(value: number) => (
                <CircularProgressbarWithChildren
                  value={value}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: '#F87A7A'
                  })}
                >
                  <img src={healthDownArrowIcon} alt="" />
                </CircularProgressbarWithChildren>
              )}
            </ProgressProvider>
          </div>
          <div className="flex flex-col pl-3">
            <div
              className={`font-Poppins font-medium ${!isShrunk ? 'text-activityHealth' : 'text-[0.6878rem]'
                } leading-0.93  text-activityGray pb-1 dark:text-greyDark`}
            >
              Activities
            </div>
            <div
              className={`font-Poppins font-semibold ${!isShrunk ? 'text-activityPercentage ' : 'text-lg'
                } text-activityGray leading-4 dark:text-white`}
            >
              {!isManageMode && !isSidePanelOpen ? activitiesScoreData?.percentage : 45}%
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className={`${!isShrunk ? 'w-[3.1169rem]' : ' w-[3.8831rem]'}`}>
            <svg style={{ height: 0 }}>
              <defs>
                <linearGradient id={'hai'} gradientTransform={gradientTransform}>
                  <stop offset="16.29%" stopColor={'#ED9333'} />
                  <stop offset="85.56%" stopColor={'#F9CB37'} />
                </linearGradient>
              </defs>
            </svg>
            <ProgressProvider
              valueStart={0}
              valueEnd={!isManageMode && !isSidePanelOpen ? (membersScoreData?.percentage ? membersScoreData?.percentage : 0) : 78}
            >
              {(value: number) => (
                <CircularProgressbarWithChildren
                  value={value}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: `url(#${'hai'})`
                  })}
                >
                  <img src={healthDownArrowIcon} className="rotate-180" alt="" />
                </CircularProgressbarWithChildren>
              )}
            </ProgressProvider>
          </div>
          <div className="flex flex-col pl-3">
            <div
              className={`font-Poppins font-medium ${!isShrunk ? 'text-activityHealth' : 'text-[0.6878rem]'
                } leading-0.93 text-activityGray pb-1 dark:text-greyDark`}
            >
              Members
            </div>
            <div
              className={`font-Poppins font-semibold ${!isShrunk ? 'text-activityPercentage ' : 'text-lg'
                } text-activityGray leading-4 dark:text-white`}
            >
              {!isManageMode && !isSidePanelOpen ? membersScoreData?.percentage : 78}%
            </div>
          </div>
        </div>

        <div className={`flex items-center ${!isShrunk ? 'block' : 'hidden'}`}>
          <div className="w-[4.4425rem]">
            <svg style={{ height: 0 }}>
              <defs>
                <linearGradient id={'hello'} gradientTransform={gradientTransform}>
                  <stop offset="16.29%" stopColor={'#AACF6F'} />
                  <stop offset="85.56%" stopColor={'#6CB7E0'} />
                </linearGradient>
              </defs>
            </svg>
            <ProgressProvider
              valueStart={0}
              valueEnd={!isManageMode && !isSidePanelOpen ? (overallScoreData?.percentage ? overallScoreData?.percentage : 0) : 67}
            >
              {(value: number) => (
                <CircularProgressbarWithChildren
                  value={value}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: `url(#${'hello'})`
                  })}
                >
                  <img src={healthUpArrowIcon} alt="" />
                </CircularProgressbarWithChildren>
              )}
            </ProgressProvider>
          </div>
          <div className="flex flex-col pl-3">
            <div
              className={`font-Poppins font-medium ${!isShrunk ? 'text-activityHealth' : 'text-[0.6878rem]'
                } leading-0.93 text-activityGray pb-1 dark:text-greyDark`}
            >
              Overall
            </div>
            <div
              className={`font-Poppins font-semibold ${!isShrunk ? 'text-activityPercentage ' : 'text-lg'
                } text-activityGray leading-4 dark:text-white`}
            >
              {!isManageMode && !isSidePanelOpen ? overallScoreData?.percentage : 67}%
            </div>
          </div>
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

export default HealthCard;
