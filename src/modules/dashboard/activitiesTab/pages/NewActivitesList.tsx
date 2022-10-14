import React from 'react';
import unsplashIcon from '../../../../assets/images/unsplash.svg';
import slackIcon from '../../../../assets/images/slack.svg';
import nextIcon from '../../../../assets/images/unsplash_mj.svg';
import yellowDotted from '../../../../assets/images/yellow_dotted.svg';
import { TabPanel } from 'common/tabs/TabPanel';

type Props = {
  hidden: boolean;
};

export const activities = [
  {
    key: 'Today',
    url: unsplashIcon,
    message: 'John posted a reply in "Last update"',
    createdAt: '2 hours ago'
  },
  {
    key: 'Today',
    url: slackIcon,
    message: 'Nishita joined the channel Support"',
    createdAt: '2 hours ago'
  },
  {
    key: 'Today',
    url: nextIcon,
    message: 'John posted a reply in "Last update"',
    createdAt: '2 hours ago'
  },
  {
    key: 'Today',
    url: unsplashIcon,
    message: 'John posted a reply in "Last update"',
    createdAt: '2 hours ago'
  },
  {
    key: 'Today',
    url: slackIcon,
    message: 'Nishita joined the channel Support"',
    createdAt: '2 hours ago'
  }
];

const NewActivitesList: React.FC<Props> = ({ hidden }) => (
  <TabPanel hidden={hidden}>
    <div>
      <ul>
        {activities.map((item, index: number) => (
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
                  <div className="font-Poppins text-[10px]] not-italic font-normal text-[#544e4e] dark:text-greyDark">
                    <p>{item.createdAt}</p>
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

export default NewActivitesList;
