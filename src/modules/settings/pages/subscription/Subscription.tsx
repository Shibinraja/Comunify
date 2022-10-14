import Button from 'common/button';
import { TabPanel } from 'common/tabs/TabPanel';
import ToggleButton from 'common/ToggleButton/ToggleButton';
import React, { useState } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import tickIcon from '../../../..//assets/images/tostr.png';
import ProgressProvider from './ProgressProvider';

type Props = {
  hidden: boolean;
};

const Subscription: React.FC<Props> = ({ hidden }) => {
  const [toggle, setToggle] = useState<boolean>(false);

  const gradientTransform = `rotate(90)`;

  return (
    <TabPanel hidden={hidden}>
      <div className="subscription mt-2.625 ">
        <h3 className="text-infoBlack font-Poppins font-semibold text-base leading-1.56 dark:text-white">Subscription</h3>
        <p className="font-Poppins text-error text-black dark:text-greyDark leading-1.31 font-normal">
          To keep using this account after the trial ends, set up a subscription
        </p>
        <div className="flex border bg-paymentSubscription dark:bg-thirdDark w-full h-8.37 shadow-paymentSubscriptionCard box-border rounded-0.9 justify-between items-center px-[27px] mt-1.8">
          <div className="flex">
            <div className="flex flex-col">
              <div className="font-semibold font-Poppins leading-1.56 text-infoBlack dark:text-white text-base">Current Plan</div>
              <div className="mt-0.313 ">
                <Button
                  type="button"
                  text="FREE TRIAL"
                  className="w-[87px] h-[26px] bg-trialButton border-none text-white text-error font-Poppins font-medium leading-1.31 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex flex-col pl-[98px] dark:text-createdAtGrey">
              <div className="font-semibold font-Poppins leading-1.56 text-infoBlack dark:text-white text-base">Features</div>
              <div className="flex gap-4 font-Poppins   ">
                <div className="flex items-center gap-x-1">
                  <div className="w-[12px]">
                    <img src={tickIcon} alt="" className="bg-cover" />
                  </div>
                  <div className="text-listGray text-error font-normal leading-1.31">Single User</div>
                </div>
                <div className="flex items-center gap-x-1">
                  <div className="w-[12px]">
                    <img src={tickIcon} alt="" className="bg-cover" />
                  </div>
                  <div className="text-listGray text-error font-normal leading-1.31">5 Platforms</div>
                </div>
                <div className="flex items-center gap-x-1">
                  <div className="w-[12px]">
                    <img src={tickIcon} alt="" className="bg-cover" />
                  </div>
                  <div className="text-listGray text-error font-normal leading-1.31">Customizable Reports</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="relative">
              <svg className="absolute">
                <defs>
                  <linearGradient id={'hello'} gradientTransform={gradientTransform}>
                    <stop offset="16.29%" stopColor={'#ED9333'} />
                    <stop offset="85.56%" stopColor={'#F9CB37'} />
                  </linearGradient>
                </defs>
              </svg>
              <ProgressProvider valueStart={0} valueEnd={67}>
                {(value: number) => (
                  <CircularProgressbarWithChildren
                    value={value}
                    strokeWidth={10}
                    styles={buildStyles({
                      pathColor: `url(#${'hello'})`
                    })}
                  >
                    <span className="font-medium font-Poppins text-[22.01px] text-[#151515]">67</span>
                  </CircularProgressbarWithChildren>
                )}
              </ProgressProvider>
            </div>
            <div className="pt-2">
              <div className="font-Poppins font-semibold text-[13px] leading-0.93 text-[#393A3A] pb-1 dark:text-greyDark">Days Left</div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E6E6E6] mt-8"></div>

        <div className="upgrade mt-1.8 ">
          <h3 className="font-Poppins font-semibold text-infoBlack leading-2.18 text-infoData dark:text-white">Upgrade</h3>
          <div className="flex mt-1.8">
            <div className="bg-paymentSubscription dark:bg-thirdDark box-border w-13.31 pb-5 shadow-paymentSubscriptionCard flex flex-col items-center justify-center border-gradient-rounded">
              <h5 className="flex items-center justify-center">
                <span className="price font-Poppins font-semibold leading-2.8 text-renewalPrice ">$49</span>
                <span className="text-renewalPlan font-medium font-Poppins leading-1.43">/month</span>
              </h5>
              <div className="font-semibold font-Poppins leading-1.56 text-infoBlack text-base dark:text-white">Comunify Plus</div>
              <p className="text-center text-card font-Poppins font-normal w-[200px] text-listGray mt-5 dark:text-greyDark">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac nisi in turpis viverra convallis id sit amet eros.
              </p>
            </div>
            <div className="flex flex-col ml-5 bg-paymentSubscription dark:bg-thirdDark w-13.31 h-14.31 box-border pb-10 shadow-paymentSubscriptionCard pt-[49px] pl-5 border-gradient-rounded">
              <div className="font-semibold font-Poppins leading-1.56 text-infoBlack text-base dark:text-white">Features</div>
              <div className="flex items-center gap-x-1 mt-[8px]">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" />
                </div>
                <div className="font-Poppins text-error text-listGray dark:text-greyDark leading-1.31 font-normal">Single User</div>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" />
                </div>
                <div className="font-Poppins text-error text-listGray dark:text-greyDark leading-1.31 font-normal">5 Platforms</div>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" />
                </div>
                <div className="font-Poppins text-error text-listGray dark:text-greyDark leading-1.31 font-normal">Customizable Reports</div>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" />
                </div>
                <div className="font-Poppins text-error text-listGray dark:text-greyDark leading-1.31 font-normal">Configurable Dashboard</div>
              </div>
            </div>
          </div>
        </div>
        <div className="renewal mt-[44px] mb-10">
          <div className="flex justify-between  items-center">
            <div className="flex flex-col">
              <h3 className="font-Poppins text-base text-renewalBlack leading-1.31 font-semibold dark:text-white">Auto Renewal</h3>
              <p className="text-listGray font-normal  text-trial leading-1.31 mt-1 dark:text-greyDark">Your auto renewal is active</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-renewalLightGray text-trial font-medium leading-1.31 font-Roboto dark:text-white">No</div>
              <ToggleButton value={toggle} onChange={() => setToggle(toggle ? false : true)} />
              <div className="text-trial font-medium leading-1.31 font-Roboto dark:text-white">Yes</div>
            </div>
          </div>
        </div>
      </div>
    </TabPanel>
  );
};

export default Subscription;
