import React from 'react';
import unsplashIcon from '../../../../assets/images/unsplash.svg';
import slackIcon from '../../../../assets/images/slack.svg';
import nextIcon from '../../../../assets/images/unsplash_mj.svg';
import yellowDotted from '../../../../assets/images/yellow_dotted.svg';
import { TabPanel } from 'common/tabs/TabPanel';
import moment from 'moment';

type Props = {
  hidden: boolean;
};

export const activities = [
  {
    key: 'Today',
    url: unsplashIcon,
    message: 'John sj posted a reply in "Last update"',
    activityTime: moment().format()
  },
  {
    key: 'Today',
    url: slackIcon,
    message: 'Nishita joined the channel Support"',
    activityTime: moment().format()
  },
  {
    key: 'Today',
    url: nextIcon,
    message: 'John 10 posted a reply in "Last update"',
    activityTime: moment().subtract(1, 'days').format()
  },
  {
    key: 'Today',
    url: nextIcon,
    message: 'John 11 posted a reply in "Last update"',
    activityTime: moment().subtract(2, 'days').format()
  },
  {
    key: 'Today',
    url: unsplashIcon,
    message: 'John posted a reply in "Last update"',
    activityTime: '2022-10-13T09:45:30.224Z'
  },
  {
    key: 'Today',
    url: slackIcon,
    message: 'Nishita joined the channel Support"',
    activityTime: '2022-10-12T09:35:30.224Z'
  }
];

//flittering today date from the data
export const todayActivities = activities.filter((data) => moment(data.activityTime).format('DD-MMM-YYYY') === moment.utc().format('DD-MMM-YYYY'));

//flittering yesterday date from the data
export const yesterdayActivities = activities.filter(
  (data) => moment(data.activityTime).format('DD-MMM-YYYY') === moment().subtract(1, 'days').format('DD-MMM-YYYY')
);

//removing today and yesterdayDate from the data
const allDate: any = activities
  .filter(
    (data: { activityTime: moment.MomentInput }) =>
      moment(data?.activityTime).isBefore(moment.utc().subtract(1, 'days').format('DD-MMM-YYYY')) ||
      moment(data?.activityTime).isAfter(moment.utc().add(1, 'days').format('DD-MMM-YYYY'))
  )
  .sort(
    (a: { activityTime: string | number | Date }, b: { activityTime: string | number | Date }) =>
      new Date(a.activityTime).getTime() - new Date(b.activityTime).getTime()
  )
  .reverse();

//creating an object after sorting all the dates storing into an object
export const dateActivities: any = {};
allDate.forEach((element: { activityTime: string | number }) => {
  const arr: [] = dateActivities[moment(element.activityTime).format('DD-MMM-YYYY')];
  if (arr) {
    dateActivities[moment(element.activityTime).format('DD-MMM-YYYY')] = [...arr, element];
  } else {
    dateActivities[moment(element.activityTime).format('DD-MMM-YYYY')] = [element];
  }
});

const NewActivitiesList: React.FC<Props> = ({ hidden }) => (
  <TabPanel hidden={hidden}>
    <div>
      <ul>
        <h3 className=" text-black font-medium pl-7 text-m font-Poppins  text-xs pb-4">Today</h3>
        {todayActivities.map((item, index: number) => (
          <>
            <li key={index} className="my-1.68 active-list relative">
              <div className="w-full flex justify-start items-center">
                <div className="ml-2.024 bottom-line ">
                  <img src={yellowDotted} alt="" />
                </div>
                <div className="ml-0.71 ">
                  <img className="h-1.9 w-1.9" src={item.url} alt="" />
                </div>

                <div className="ml-0.865">
                  <div>
                    <p className="font-medium text-xs font-Poppins">{item.message}</p>
                  </div>
                  <div className="font-Poppins text-[10px] not-italic font-normal text-[#544e4e] dark:text-greyDark">
                    <p>{item.activityTime}</p>
                  </div>
                </div>
              </div>
            </li>
          </>
        ))}
        <h3 className=" text-black font-medium pl-7 text-m font-Poppins  text-xs pb-4">Yesterday</h3>
        {yesterdayActivities.map((item, index: number) => (
          <>
            <li key={index} className="my-1.68 active-list relative">
              <div className="w-full flex justify-start items-center">
                <div className="ml-2.024 bottom-line ">
                  <img src={yellowDotted} alt="" />
                </div>
                <div className="ml-0.71 ">
                  <img className="h-1.9 w-1.9" src={item.url} alt="" />
                </div>

                <div className="ml-0.865">
                  <div>
                    <p className="font-medium text-xs font-Poppins">{item.message}</p>
                  </div>
                  <div className="font-Poppins text-[10px] not-italic font-normal text-[#544e4e] dark:text-greyDark">
                    <p>{item.activityTime}.</p>
                  </div>
                </div>
              </div>
            </li>
          </>
        ))}
        {Object.entries(allDate).map((item: any) => (
          <>
            <h3 className="font-medium pl-7 text-m font-Poppins  text-xs pb-4"> {item[0]}</h3>
            {item[1].map((item: any) => (
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
                      <p className="font-medium text-xs font-Poppins">{item.message}</p>
                    </div>
                    <div className="font-Poppins text-[10px] not-italic font-normal text-[#544e4e] dark:text-greyDark">
                      <p>{item?.activityTime}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </>
        ))}
      </ul>
    </div>
  </TabPanel>
);

export default NewActivitiesList;
