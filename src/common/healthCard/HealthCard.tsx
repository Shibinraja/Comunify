import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import healthUpArrowIcon from '../../assets/images/health-bar-up.svg';
import healthDownArrowIcon from '../../assets/images/health-bar-down.svg';
import ProgressProvider from './progressProvider';

const HealthCard = () => {
  const percentage = 66;
  const gradientTransform = `rotate(90)`;

  return (
    <div className="heathCard">
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18">Health</h3>
      <div className="flex w-full justify-between items-center border-table shadow-healtCardShadow bg-white box-border rounded-0.9 mt-5 py-5 px-20">
        <div className="flex items-center">
          <div className="w-[49.87px]">
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
            <div className="font-Poppins font-medium text-activityHealth leading-0.93 text-activityGray pb-1">Activities</div>
            <div className="font-Poppins font-semibold text-activityPercentage text-activityGray leading-4">20%</div>
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
            <div className="font-Poppins font-medium text-activityHealth leading-0.93 text-activityGray pb-1">Views</div>
            <div className="font-Poppins font-semibold text-activityPercentage text-activityGray leading-4">75%</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-[49.87px]">
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
            <div className="font-Poppins font-medium text-activityHealth leading-0.93 text-activityGray pb-1">Members</div>
            <div className="font-Poppins font-semibold text-activityPercentage text-activityGray leading-4">20%</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-[71.08px]">
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
            <div className="font-Poppins font-medium text-error leading-4 pb-2">Overall</div>
            <div className="font-Poppins font-semibold text-2xl leading-4">85%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCard;
