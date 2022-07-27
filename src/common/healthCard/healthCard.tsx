import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const HealthCard=()=>{
    const percentage = 66;
    return(
        <div className="container mx-auto">
             <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18">Health</h3>
             <div className="flex w-full justify-between items-center border-table shadow-healtCardShadow bg-white box-border rounded-0.9 mt-5 py-10 px-16">
                <div className="w-[49.87px] h-[47.8px;] flex">
                <CircularProgressbar value={percentage} text={`${percentage}%`} />
                </div>
                <div className="w-[49.87px] h-[47.8px;]">
                <CircularProgressbar value={percentage} text={`${percentage}%`} />
                </div>
                <div className="w-[49.87px] h-[47.8px;]">
                <CircularProgressbar value={percentage} text={`${percentage}%`} />
                </div>
                <div className="w-[71.08px] h-[68.12px]">
                <CircularProgressbar value={percentage} text={`${percentage}%`} />
                </div>
             </div>
        </div>
    )
}

export default HealthCard;