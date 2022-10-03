import React from 'react';
import yellowDotted from '../../../assets/images/yellow_dotted.svg';
import { TabPanel } from 'common/tabs/TabPanel';
import { ActivitiesWidgetData } from '../../../modules/dashboard/interface/dashboard.interface';
import { generateDateAndTime } from '../../../lib/helper';

type Props = {
  hidden: boolean;
  activitiesWidgetData: ActivitiesWidgetData[] | [];
};

const NewActivitiesList: React.FC<Props> = ({ hidden, activitiesWidgetData }) => (
  <TabPanel hidden={hidden}>
    <div>
      <ul>
        {Boolean(activitiesWidgetData.length) &&
          activitiesWidgetData.map((item: ActivitiesWidgetData) => (
            <>
              <li key={`${item?.id + item.channelId + Math.random()}`} className="my-1.68 active-list relative">
                <div className="w-full flex justify-start items-center">
                  <div className="ml-2.024 bottom-line ">
                    <img src={yellowDotted} alt="" />
                  </div>
                  <div className="ml-0.71 ">
                    <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.platformLogoUrl} alt="" />
                  </div>

                  <div className="ml-0.865">
                    <div>
                      <p className="font-medium text-xs font-Poppins">{item?.displayValue}</p>
                    </div>
                    <div className="font-Poppins text-createdAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                      <p> {generateDateAndTime(`${item?.activityTime}`, 'HH:MM')}</p>
                    </div>
                  </div>
                </div>
              </li>
            </>
          ))}
      </ul>
    </div>
  </TabPanel>
);

export default NewActivitiesList;
