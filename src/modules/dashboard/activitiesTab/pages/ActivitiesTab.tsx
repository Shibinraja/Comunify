import React from 'react';
import { useTabs } from '@/hooks/useTabs';
import { TabSelector } from 'common/tabs/TabSelector';
import NewActivitiesList from './NewActivitiesList';

export default function ActivitiesTab() {
  const [selectedTab, setSelectedTab] = useTabs(['activites', 'highlights']);

  return (
    <div className="w-full h-full   box-border bg-white dark:bg-secondaryDark dark:text-white  rounded-0.6 mt-1.868 border  border-borderPrimary dark:border-borderDark shadow-profileCard ">
      <div className="w-full mt-6 flex flex-col ">
        <nav>
          <TabSelector
            isActive={selectedTab === 'activites'}
            onClick={() => setSelectedTab('activites')}
            style={'ml-1.625 mt-0.438 text-sm pb-2  border-transparent'}
            styleActive={'gradient-bottom-border'}
          >
            New Activities
          </TabSelector>
          <TabSelector
            isActive={selectedTab === 'highlights'}
            onClick={() => setSelectedTab('highlights')}
            style={'ml-1.625 mt-0.438 text-sm pb-2  border-transparent'}
            styleActive={'gradient-bottom-border'}
          >
            Highlights
          </TabSelector>
        </nav>
        <div className="h-14.375 items-center relative overflow-y-auto block section ">
          <NewActivitiesList hidden={selectedTab !== 'activites'} />
        </div>
      </div>
    </div>
  );
}
