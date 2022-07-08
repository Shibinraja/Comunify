import profile1 from "../../../../assets/images/profile.svg";
import profile2 from "../../../../assets/images/profile2.svg";
import profile3 from "../../../../assets/images/profile3.svg";
import profile4 from "../../../../assets/images/profile4.svg";
import profile5 from "../../../../assets/images/ellip.svg";

import { TabPanel } from "common/tabs/TabPanel";

type Props = {
  hidden: boolean;
};

const members = [
  {
    url: profile1,
    name: 'Paityn Dias',
    createdAt: "2 hours ago",
  },
  {
    url: profile2,
    name: 'Kaiya Vetrovs',
    createdAt: "2 hours ago",
  },
  {
    url: profile3,
    name: 'Alena Aminoff',
    createdAt: "2 hours ago",
  },
  {
    url: profile4,
    name: 'Kianna Ekstrom Bothman',
    createdAt: "2 hours ago",
  },
  {
    url: profile5,
    name: 'Giana Press',
    createdAt: "2 hours ago",
  },
  {
    url: profile2,
    name: 'Kaiya Vetrovs',
    createdAt: "2 hours ago",
  },
  {
    url: profile3,
    name: 'Alena Aminoff',
    createdAt: "2 hours ago",
  },
];

const ActiveMembersList: React.FC<Props> = ({ hidden }) => {
  return (
    <TabPanel hidden={hidden}>
      <div>
        <ul>
          {members.map((item, index) => (
            <>
              <li className="my-1.474 ">
                <div className="w-full flex justify-start items-center">
                  <div className="ml-0.71 ">
                    <img className="h-1.835 w-1.959" src={item.url} alt="" />
                  </div>

                  <div className="ml-0.865">
                    <div>
                      <p className="font-medium pt-0.5 text-card font-Poppins">
                        {item.name}
                      </p>
                    </div>
                    <div className="font-Poppins text-membersCreatedAt not-italic font-normal text-createdAtGrey">
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

export default ActiveMembersList;
