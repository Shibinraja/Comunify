/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { useTabs } from '@/hooks/useTabs';
import { TabSelector } from 'common/tabs/TabSelector';
import BillingHistory from './billingHistory/BillingHistory';
import Integration from './integration/Integration';
import Tags from './tags/Tags';
import { useLocation } from 'react-router';

const Subscription = React.lazy(() => import('./subscription/Subscription'));

const Settings = () => {
  const [selectedTab, setSelectedTab] = useTabs(['integrations', 'subscription', 'billing_history', 'tags']);
  const [loadingToast, setLoadingToast] = useState<string>('');
  const location: any | Location = useLocation();
  const redirectPath = location?.state?.selectedTab;
  const loadingToastCondition = location?.state?.loadingToastCondition;

  useEffect(() => {
    if (loadingToastCondition === 'showLoadingToast') {
      setLoadingToast(loadingToastCondition);
    }
  }, [loadingToastCondition]);

  useEffect(() => {
    redirectPath === 'billing_history' && setSelectedTab('billing_history');
  }, [redirectPath]);

  useEffect(() => {
    redirectPath === 'subscription' && setSelectedTab('subscription');
  }, [redirectPath]);

  const clearLoadingToastCondition = () => {
    setLoadingToast('');
  };
  return (
    <div className="flex flex-col ">
      <div className="font-Poppins  leading-35 text-infoData not-italic font-semibold mt-[73px] dark:text-white">Settings</div>
      <div className="w-full mt-[30px] ">
        <nav className="flex items-end">
          <TabSelector
            isActive={selectedTab === 'integrations'}
            onClick={() => setSelectedTab('integrations')}
            style={
              'text-center justify-center text-xs not-italic  text-profileBlack font-medium w-[200px] font-Poppins h-[40px] border-solid border border-settingsTabBorder rounded-tl-sm'
            }
            styleActive={' border-b-2 border-b-solid border-b-settingsTabActive rounded-t-sm'}
            styleInActive={'text-profileBlack'}
          >
            INTEGRATIONS
          </TabSelector>
          <TabSelector
            isActive={selectedTab === 'subscription'}
            onClick={() => setSelectedTab('subscription')}
            style={
              'text-center justify-center text-xs not-italic  text-profileBlack font-medium w-[200px] font-Poppins h-[40px] border border-solid border-settingsTabBorder dark:border-[#E6E6E6]'
            }
            styleActive={' border-b-2 border-b-solid border-b-settingsTabActive rounded-t-sm'}
            styleInActive={'text-profileBlack'}
          >
            SUBSCRIPTION
          </TabSelector>
          <TabSelector
            isActive={selectedTab === 'billing_history'}
            onClick={() => setSelectedTab('billing_history')}
            style={
              'text-center justify-center text-xs not-italic  text-profileBlack font-medium w-[200px] font-Poppins h-[40px] border border-solid border-settingsTabBorder dark:border-[#E6E6E6]'
            }
            styleActive={' border-b-2 border-b-solid border-b-settingsTabActive rounded-t-sm'}
            styleInActive={'text-profileBlack'}
          >
            BILLING HISTORY
          </TabSelector>
          <TabSelector
            isActive={selectedTab === 'tags'}
            onClick={() => setSelectedTab('tags')}
            style={
              'text-center justify-center text-xs not-italic  text-profileBlack font-medium w-[200px] font-Poppins h-[40px] border border-solid border-settingsTabBorder rounded-tr-sm dark:border-[#E6E6E6]'
            }
            styleActive={' border-b-2 border-b-solid border-b-settingsTabActive rounded-t-sm'}
            styleInActive={'text-profileBlack'}
          >
            TAGS
          </TabSelector>
        </nav>
        <div className="items-center block section ">
          <Integration hidden={selectedTab !== 'integrations'} selectedTab={selectedTab!} />
          <Subscription hidden={selectedTab !== 'subscription'} selectedTab={selectedTab!} />
          <BillingHistory
            hidden={selectedTab !== 'billing_history'}
            selectedTab={selectedTab!}
            loadingToastCondition={loadingToast}
            clearLoadingToastCondition={clearLoadingToastCondition}
          />
          <Tags hidden={selectedTab !== 'tags'} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
