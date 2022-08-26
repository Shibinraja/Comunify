import React from 'react';
import { useTabs } from '@/hooks/useTabs';
import { TabSelector } from 'common/tabs/TabSelector';
import BillingHistory from './billingHistory/BillingHistory';
import Integration from './integration/Integration';
import Subscription from './subscription/Subscription';
import Tags from './tags/Tags';

const Settings = () => {
  const [selectedTab, setSelectedTab] = useTabs(['integrations', 'subscription', 'billing_history', 'tags']);

  return (
    <div className="flex flex-col ">
      <div className="font-Poppins  leading-35 text-infoData not-italic font-semibold mt-12 dark:text-white">Settings</div>
      <div className="w-full mt-10 ">
        <nav className="flex items-end">
          <TabSelector
            isActive={selectedTab === 'integrations'}
            onClick={() => setSelectedTab('integrations')}
            style={
              'text-center justify-center text-xs not-italic font-normal text-profileBlack dark:text-white leading-4 dark:bg-thirdDark font-medium w-12.87 h-[40px] border-solid border border-settingsTabBorder dark:border-[#E6E6E6] rounded-tl-sm'
            }
            styleActive={'h-[50px] border-b-2 border-b-solid border-b-settingsTabActive rounded-t-sm'}
            styleInActive={'text-profileBlack dark:text-white '}
          >
            INTEGRATIONS
          </TabSelector>
          <TabSelector
            isActive={selectedTab === 'subscription'}
            onClick={() => setSelectedTab('subscription')}
            style={
              'text-center justify-center text-xs not-italic font-normal text-profileBlack dark:text-white leading-4 dark:bg-thirdDark font-medium w-12.87 h-[40px] border border-solid border-settingsTabBorder dark:border-[#E6E6E6]'
            }
            styleActive={'h-[50px] border-b-2 border-b-solid border-b-settingsTabActive rounded-t-sm'}
            styleInActive={'text-profileBlack dark:text-white'}
          >
            SUBSCRIPTION
          </TabSelector>
          <TabSelector
            isActive={selectedTab === 'billing_history'}
            onClick={() => setSelectedTab('billing_history')}
            style={
              'text-center justify-center text-xs not-italic font-normal text-profileBlack dark:text-white leading-4 dark:bg-thirdDark font-medium w-12.87 h-[40px] border border-solid border-settingsTabBorder dark:border-[#E6E6E6]'
            }
            styleActive={'h-[50px] border-b-2 border-b-solid border-b-settingsTabActive rounded-t-sm'}
            styleInActive={'text-profileBlack dark:text-white'}
          >
            BILLING HISTORY
          </TabSelector>
          <TabSelector
            isActive={selectedTab === 'tags'}
            onClick={() => setSelectedTab('tags')}
            style={
              'text-center justify-center text-xs not-italic font-normal text-profileBlack dark:text-white leading-4 dark:bg-thirdDark font-medium w-12.87 h-[40px] border border-solid border-settingsTabBorder rounded-tr-sm dark:border-[#E6E6E6]'
            }
            styleActive={'h-[50px] border-b-2 border-b-solid border-b-settingsTabActive rounded-t-sm'}
            styleInActive={'text-profileBlack dark:text-white'}
          >
            TAGS
          </TabSelector>
        </nav>
        <div className="items-center block section ">
          <Integration hidden={selectedTab !== 'integrations'} />
          <Subscription hidden={selectedTab !== 'subscription'} />
          <BillingHistory hidden={selectedTab !== 'billing_history'} />
          <Tags hidden={selectedTab !== 'tags'} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
