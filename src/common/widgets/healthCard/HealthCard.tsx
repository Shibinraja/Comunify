/* eslint-disable max-len */
import React, { useEffect } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import healthUpArrowIcon from '../../../assets/images/health-bar-up.svg';
import healthDownArrowIcon from '../../../assets/images/health-bar-down.svg';
import ProgressProvider from './progressProvider';
import { getLocalWorkspaceId } from '../../../lib/helper';
import { healthScoreWidgetDataService } from '../../../modules/dashboard/services/dashboard.services';
import { HealthScoreWidgetData } from '../../widgetLayout/WidgetTypes';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const HealthCard: React.FC = () => {
  const gradientTransform = `rotate(90)`;
  const workspaceId = getLocalWorkspaceId();

  const [healthScoreData, setHealthScoreData] = React.useState<HealthScoreWidgetData[] | []>([]);

  React.useEffect(() => {
    fetchHealthScoreWidgetData();
  }, []);

  // eslint-disable-next-line space-before-function-paren
  const fetchHealthScoreWidgetData = async () => {
    const response: HealthScoreWidgetData[] = await healthScoreWidgetDataService(
      workspaceId,
      startDate ? startDate : undefined,
      endDate ? endDate : undefined
    );
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

  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (startDate && endDate) {
      fetchHealthScoreWidgetData();
    }
  }, [startDate, endDate]);
  // eslint-disable-next-line no-unused-vars
  const [isDrag, setIsDrag] = React.useState<boolean>(true);

  const setWidgetNameAsParams = () => {
    const params = { widgetName: 'HealthCard' };
    navigate({ pathname: location.pathname, search: `?${createSearchParams(params)}` });
  };

  return (
    <div className="heathCard my-6">
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Health</h3>
      <div
        className={`flex  ${
          isDrag ? 'justify-start w-[19.0625rem] gap-5 py-8 px-5 widget-border relative' : 'justify-between w-full py-5 px-20 border-borderPrimary'
        }  items-center border-table border  dark:border-borderDark shadow-healtCardShadow dark:shadow-none bg-white dark:bg-secondaryDark  box-border rounded-0.9 mt-5 `}
      >
        <div className="flex items-center">
          <div className={`${isDrag ? 'w-[3.8831rem]' : 'w-[3.1169rem]'}`}>
            <ProgressProvider valueStart={0} valueEnd={activitiesScoreData?.percentage ? activitiesScoreData?.percentage : 0}>
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
            <div className="font-Poppins font-medium text-activityHealth leading-0.93 text-activityGray pb-1 dark:text-greyDark">Activities</div>
            <div className="font-Poppins font-semibold text-activityPercentage text-activityGray leading-4 dark:text-white">
              {activitiesScoreData?.percentage}%
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-[49.87px]">
            <svg style={{ height: 0 }}>
              <defs>
                <linearGradient id={'hai'} gradientTransform={gradientTransform}>
                  <stop offset="16.29%" stopColor={'#ED9333'} />
                  <stop offset="85.56%" stopColor={'#F9CB37'} />
                </linearGradient>
              </defs>
            </svg>
            <ProgressProvider valueStart={0} valueEnd={membersScoreData?.percentage ? membersScoreData?.percentage : 0}>
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
              className={`font-Poppins font-medium ${
                isDrag ? 'text-[0.6878rem]' : 'text-activityHealth'
              } leading-0.93 text-activityGray pb-1 dark:text-greyDark`}
            >
              Members
            </div>
            <div
              className={`font-Poppins font-semibold ${isDrag ? 'text-lg' : 'text-activityPercentage'} text-activityGray leading-4 dark:text-white`}
            >
              {membersScoreData?.percentage}%
            </div>
          </div>
        </div>

        <div className={`flex items-center ${isDrag ? 'hidden' : 'block'}`}>
          <div className="w-[4.4425rem]">
            <svg style={{ height: 0 }}>
              <defs>
                <linearGradient id={'hello'} gradientTransform={gradientTransform}>
                  <stop offset="16.29%" stopColor={'#AACF6F'} />
                  <stop offset="85.56%" stopColor={'#6CB7E0'} />
                </linearGradient>
              </defs>
            </svg>
            <ProgressProvider valueStart={0} valueEnd={overallScoreData?.percentage ? overallScoreData?.percentage : 0}>
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
            <div className="font-Poppins font-medium text-error leading-4 pb-2 dark:text-greyDark">Overall</div>
            <div className="font-Poppins font-semibold text-2xl leading-4 dark:text-white">{overallScoreData?.percentage}%</div>
          </div>
        </div>
        <div
          onClick={setWidgetNameAsParams}
          className="absolute -right-3 bg-widgetClose rounded-full flex items-center justify-center h-6 w-6 text-white text-2xl -top-3 cursor-pointer"
        >
          -
        </div>
      </div>
    </div>
  );
};

export default HealthCard;
