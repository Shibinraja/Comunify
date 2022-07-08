import unsplashIcon from "../../../../assets/images/unsplash.svg";
import slackIcon from "../../../../assets/images/slack.svg";
import nextIcon from "../../../../assets/images/unsplash_mj.svg";
import yellowDotted from "../../../../assets/images/yellow_dotted.svg";
import Vector from "../../../../assets/images/vector_line.svg";
import { TabPanel } from "common/tabs/TabPanel";

type Props = {
  hidden: boolean;
};

const activities = [
  {
    key: "Today",
    url: unsplashIcon,
    message: 'John posted a reply in "Last update"',
    createdAt: "2 hours ago",
  },
  {
    key: "Today",
    url: slackIcon,
    message: 'Nishita joined the channel Support"',
    createdAt: "2 hours ago",
  },
  {
    key: "Today",
    url: nextIcon,
    message: 'John posted a reply in "Last update"',
    createdAt: "2 hours ago",
  },
  {
    key: "Today",
    url: unsplashIcon,
    message: 'John posted a reply in "Last update"',
    createdAt: "2 hours ago",
  },
  {
    key: "Today",
    url: slackIcon,
    message: 'Nishita joined the channel Support"',
    createdAt: "2 hours ago",
  },
];

const NewActivitesList: React.FC<Props> = ({ hidden }) => {
  return (
    <TabPanel hidden={hidden}>
      <div>
        <ul>
          {activities.map((item, index) => (
            <>
              <li className="my-1.68">
                <div className="w-full flex justify-start items-center">
                  <div className="ml-2.024">
                    <img src={yellowDotted} alt="" />
                  </div>
                  <div className="ml-0.71 ">
                    <img className="h-1.835 w-1.918" src={item.url} alt="" />
                  </div>

                  <div className="ml-0.865">
                    <div>
                      <p className="font-medium text-card font-Poppins">
                        {item.message}
                      </p>
                    </div>
                    <div className="font-Poppins text-createdAt not-italic font-normal text-createdAtGrey">
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
};

export default NewActivitesList;
