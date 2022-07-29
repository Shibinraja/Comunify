import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import healthUpArrowIcon from "../../assets/images/health-bar-up.svg";
import healthDownArrowIcon from '../../assets/images/health-bar-down.svg';
const HealthCard = () => {
    const percentage = 66;
    return (
        <div className="container mx-auto">
            <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18">Health</h3>
            <div className="flex w-full justify-between items-center border-table shadow-healtCardShadow bg-white box-border rounded-0.9 mt-5 py-5 px-20">
                <div className="flex items-center">
                    <div className='w-[49.87px]'>
                        <CircularProgressbarWithChildren value={percentage} strokeWidth={10} styles={buildStyles({
                            pathColor: '#F87A7A',
                        })}>
                            <img src={healthDownArrowIcon} alt="" />
                        </CircularProgressbarWithChildren>
                    </div>
                    <div className="flex flex-col pl-3">
                        <div className="font-Poppins font-medium text-activityHealth leading-0.93 text-activityGray pb-1">Activities</div>
                        <div className="font-Poppins font-semibold text-activityPercentage text-activityGray leading-4">20%</div>
                    </div>

                </div>
                <div className="flex items-center">
                    <div className='w-[49.87px]'>
                        <CircularProgressbarWithChildren value={percentage} strokeWidth={10} styles={buildStyles({
                            pathColor: '#ED9333',
                        })}>
                            <img src={healthDownArrowIcon} className="rotate-180" alt="" />
                        </CircularProgressbarWithChildren>
                    </div>
                    <div className="flex flex-col pl-3">
                        <div className="font-Poppins font-medium text-activityHealth leading-0.93 text-activityGray pb-1">Views</div>
                        <div className="font-Poppins font-semibold text-activityPercentage text-activityGray leading-4">75%</div>
                    </div>

                </div>
                <div className="flex items-center">
                    <div className='w-[49.87px]'>
                        <CircularProgressbarWithChildren value={percentage} strokeWidth={10} styles={buildStyles({
                            pathColor: '#F97A7A',
                        })}>
                            <img src={healthDownArrowIcon} alt="" />
                        </CircularProgressbarWithChildren>
                    </div>
                    <div className="flex flex-col pl-3">
                        <div className="font-Poppins font-medium text-activityHealth leading-0.93 text-activityGray pb-1">Members</div>
                        <div className="font-Poppins font-semibold text-activityPercentage text-activityGray leading-4">20%</div>
                    </div>

                </div>
                <div className="flex items-center">
                    <div className='w-[71.08px]'>
                        <CircularProgressbarWithChildren value={percentage}  strokeWidth={10} styles={buildStyles({
                            pathColor: '#AACF6F',
                        })}>
                            <img src={healthUpArrowIcon} alt="" />
                        </CircularProgressbarWithChildren>
                    </div>
                    <div className="flex flex-col pl-3">
                        <div className="font-Poppins font-medium text-error leading-4 pb-2">Overall</div>
                        <div className="font-Poppins font-semibold text-2xl leading-4">85%</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HealthCard;