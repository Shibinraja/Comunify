import Button from 'common/button';
import { TabPanel } from 'common/tabs/TabPanel';
import ToggleButton from 'common/ToggleButton/ToggleButton';
import React, { useState } from 'react';
import tickIcon from '../../../..//assets/images/tostr.png';

type Props = {
  hidden: boolean;
};

const Subscription: React.FC<Props> = ({ hidden }) => {
  const [toggle, settoggle] = useState<boolean>(false);
  return (
    <TabPanel hidden={hidden}>
      <div className="subscription mt-2.625 pl-5">
        <h3 className="text-infoBlack font-Poppins font-semibold text-base leading-1.56 dark:text-white">Subscription</h3>
        <p className="font-Poppins text-error text-black leading-1.31 font-normal">
          To keep using this account after the trial ends, set up a subscription
        </p>
        <div className="flex border bg-paymentSubscription dark:bg-thirdDark w-full h-8.37 shadow-paymentSubscriptionCard box-border rounded-0.9 relative items-center px-[27px] mt-1.8">
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
            <div className="flex gap-4">
              <div className="flex items-center gap-x-1">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" className="bg-cover" />
                </div>
                <div className="text-renewalGray text-error  font-normal leading-1.31">Single User</div>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" className="bg-cover" />
                </div>
                <div className="text-renewalGray text-error  font-normal leading-1.31">5 Platforms</div>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" className="bg-cover" />
                </div>
                <div className="text-renewalGray text-error  font-normal leading-1.31">Customizable Reports</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col absolute right-10"></div>
        </div>
        <div className="upgrade mt-1.8 ">
          <h3 className="font-Poppins font-semibold text-infoBlack leading-2.18 text-infoData dark:text-white">Upgrade</h3>
          <div className="flex mt-1.8">
            <div className="bg-paymentSubscription dark:bg-thirdDark box-border w-13.31 pb-5 shadow-paymentSubscriptionCard flex flex-col items-center justify-center border-gradient-rounded">
              <h5 className="flex items-center justify-center">
                <span className="price font-Poppins font-semibold leading-2.8 text-renewalPrice ">$29</span>
                <span className="text-renewalPlan font-medium font-Poppins leading-1.43">/month</span>
              </h5>
              <div className="font-semibold font-Poppins leading-1.56 text-infoBlack text-base dark:text-white">Comunify Plus</div>
              <p className="text-center text-card font-Poppins font-normal w-[200px] text-renewalGray mt-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac nisi in turpis viverra convallis id sit amet eros.
              </p>
            </div>
            <div className="flex flex-col ml-5 bg-paymentSubscription w-13.31 h-14.31 box-border pb-10 shadow-paymentSubscriptionCard pt-[49px] pl-5 border-gradient-rounded">
              <div className="font-semibold font-Poppins leading-1.56 text-infoBlack text-base">Features</div>
              <div className="flex items-center gap-x-1 mt-[8px]">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" />
                </div>
                <div className="font-Poppins text-error text-renewalGray leading-1.31 font-normal">Single User</div>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" />
                </div>
                <div className="font-Poppins text-error text-renewalGray leading-1.31 font-normal">5 Platforms</div>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" />
                </div>
                <div className="font-Poppins text-error text-renewalGray leading-1.31 font-normal">Customizable Reports</div>
              </div>
              <div className="flex items-center gap-x-1">
                <div className="w-[12px]">
                  <img src={tickIcon} alt="" />
                </div>
                <div className="font-Poppins text-error text-renewalGray leading-1.31 font-normal">Configurable Dashboard</div>
              </div>
            </div>
          </div>
        </div>
        <div className="renewal mt-[44px]">
          <div className="flex justify-between px-5 items-center">
            <div className="flex flex-col">
              <h3 className="font-Poppins text-base text-renewalBlack leading-1.31 font-semibold">Auto Renewal</h3>
              <p className="text-renewalGray font-normal font-Poppins text-trial leading-1.31 mt-1">Your auto renewal is active</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-renewalLightGray text-trial font-medium leading-1.31 font-Poppins">NO</div>
              <ToggleButton value={toggle} onChange={() => settoggle(toggle ? false : true)} />
              <div className="text-trial font-medium leading-1.31 font-Poppins">YES</div>
            </div>
          </div>
        </div>
      </div>
    </TabPanel>
  );
};

export default Subscription;
