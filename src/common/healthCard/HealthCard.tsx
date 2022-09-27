/* eslint-disable max-len */
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import healthUpArrowIcon from '../../assets/images/health-bar-up.svg';
import healthDownArrowIcon from '../../assets/images/health-bar-down.svg';
import ProgressProvider from './progressProvider';
import { useState } from 'react';

const HealthCard = () => {
  const percentage = 66;
  const gradientTransform = `rotate(90)`;
  // eslint-disable-next-line no-unused-vars
  const [isDrag, setIsDrag] = useState<boolean>(true);

  return (
    <div className="heathCard">
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 dark:text-white">Health</h3>
      <div
        className={`flex  ${
          isDrag ? 'justify-start w-[19.0625rem] gap-5 py-8 px-5' : 'justify-between w-full py-5 px-20'
        }  items-center border-table border border-borderPrimary dark:border-borderDark shadow-healtCardShadow dark:shadow-none bg-white dark:bg-secondaryDark  box-border rounded-0.9 mt-5 `}
      >
        <div className="flex items-center">
          <div className={`${isDrag ? 'w-[3.8831rem]' : 'w-[3.1169rem]'}`}>
            <ProgressProvider valueStart={0} valueEnd={percentage}>
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
              className={`font-Poppins font-medium ${
                isDrag ? 'text-[0.6878rem]' : 'text-activityHealth'
              }  leading-0.93 text-activityGray pb-1 dark:text-greyDark`}
            >
              Activities
            </div>
            <div
              className={`font-Poppins font-semibold ${isDrag ? 'text-lg' : 'text-activityPercentage'}  text-activityGray leading-4 dark:text-white`}
            >
              20%
            </div>
          </div>
        </div>
        <div className={`flex items-center `}>
          <div className={`${isDrag ? 'w-[3.8831rem]' : 'w-[3.1169rem]'}`}>
            <svg style={{ height: 0 }}>
              <defs>
                <linearGradient id={'hai'} gradientTransform={gradientTransform}>
                  <stop offset="16.29%" stopColor={'#ED9333'} />
                  <stop offset="85.56%" stopColor={'#F9CB37'} />
                </linearGradient>
              </defs>
            </svg>
            <ProgressProvider valueStart={0} valueEnd={percentage}>
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
              75%
            </div>
          </div>
        </div>
        <div className="flex items-center hidden">
          <div className="w-[3.1169rem]">
            <ProgressProvider valueStart={0} valueEnd={percentage}>
              {(value: number) => (
                <CircularProgressbarWithChildren
                  value={value}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: '#F97A7A'
                  })}
                >
                  <img src={healthDownArrowIcon} alt="" />
                </CircularProgressbarWithChildren>
              )}
            </ProgressProvider>
          </div>
          <div className="flex flex-col pl-3">
            <div className="font-Poppins font-medium text-activityHealth leading-0.93 text-activityGray pb-1 dark:text-greyDark">Members</div>
            <div className="font-Poppins font-semibold text-activityPercentage text-activityGray leading-4 dark:text-white">20%</div>
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
            <ProgressProvider valueStart={0} valueEnd={percentage}>
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
            <div className="font-Poppins font-semibold text-2xl leading-4 dark:text-white">85%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCard;
