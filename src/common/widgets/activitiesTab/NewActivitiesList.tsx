import React from 'react';
import yellowDotted from '../../../assets/images/yellow_dotted.svg';
import { TabPanel } from 'common/tabs/TabPanel';
import { ActivitiesWidgetData } from '../../../modules/dashboard/interface/dashboard.interface';
import { generateDateAndTime } from '../../../lib/helper';
import Skeleton from 'react-loading-skeleton';
import { activities } from '../../../modules/dashboard/activitiesTab/pages/NewActivitesList';

type Props = {
  hidden: boolean;
  activitiesWidgetData: ActivitiesWidgetData[] | [];
  isLoading: boolean;
  isManageMode?: boolean;
  isSidePanelOpen: boolean;
};

const NewActivitiesList: React.FC<Props> = ({ hidden, activitiesWidgetData, isLoading, isManageMode, isSidePanelOpen }) => (
  <TabPanel hidden={hidden}>
    {isManageMode === false && !isSidePanelOpen ? (
      <div className="overflow-scroll overflow-y-scroll">
        {!isLoading ? (
          <ul>
            {activitiesWidgetData.map((item: ActivitiesWidgetData) => (
              <>
                <li key={`${item?.id + item.channelId + Math.random()}`} className="my-1.68 active-list relative">
                  <div className="w-full flex justify-start items-center">
                    <div className="ml-2.024 bottom-line ">
                      {yellowDotted ? <img src={yellowDotted} alt="" /> : <Skeleton width={10} height={10} count={1} />}
                    </div>
                    <div className="ml-0.71 ">
                      <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.platformLogoUrl} alt="" />
                    </div>
                    <div className="ml-0.865">
                      <div>
                        <p className="font-medium text-xs font-Poppins">
                          {item?.displayValue ? item?.displayValue : <Skeleton count={1} width={200} height={25} />}
                        </p>
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
        ) : (
          <Skeleton count={4} width={350} height={22} className="m-4" />
        )}
      </div>
    ) : (
      <div className="overflow-scroll overflow-y-scroll">
        <ul>
          {activities.map((item) => (
            <>
              <li key={`${Math.random()}`} className="my-1.68 active-list relative">
                <div className="w-full flex justify-start items-center">
                  <div className="ml-2.024 bottom-line ">
                    <img src={yellowDotted} />
                  </div>
                  <div className="ml-0.71 ">
                    <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.url} alt="" />
                  </div>
                  <div className="ml-0.865">
                    <div>
                      <p className="font-medium text-xs font-Poppins">{item?.message}</p>
                    </div>
                    <div className="font-Poppins text-createdAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                      <p> {generateDateAndTime(`${item?.createdAt}`, 'HH:MM')}</p>
                    </div>
                  </div>
                </div>
              </li>
            </>
          ))}
        </ul>
      </div>
    )}
  </TabPanel>
);

export default NewActivitiesList;
