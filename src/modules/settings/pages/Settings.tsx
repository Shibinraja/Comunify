import { useTabs } from '@/hooks/useTabs';
import { TabSelector } from 'common/tabs/TabSelector';
import Integration from './integration/Integration';

const Settings = () => {
  const [selectedTab, setSelectedTab] = useTabs([
    'integrations',
    'subscription',
    'billing_history',
    'tags',
  ]);

  return (
    <div className="container lg">
      <div className="font-Poppins  leading-35 text-infoData not-italic font-semibold">
        Settings
      </div>
      <div className="w-full mt-10 flex flex-col ">
        <nav className="flex items-end">
          <TabSelector
            isActive={selectedTab === "integrations"}
            onClick={() => setSelectedTab("integrations")}
            style={
              "text-center justify-center text-xs font-Poppins not-italic font-normal text-profileBlack leading-4 font-medium w-12.87 h-2.68 border-solid border border-settingsTabBorder"
            }
            styleActive={
              "h-3.12 border-b-2 border-b-solid border-b-settingsTabActive"
            }
            styleInActive={"text-profileBlack "}
          >
            INTEGRATIONS
          </TabSelector>
          <TabSelector
            isActive={selectedTab === "subscription"}
            onClick={() => setSelectedTab("subscription")}
            style={
              "text-center justify-center text-xs font-Poppins not-italic font-normal text-profileBlack leading-4 font-medium w-12.87 h-2.68 border border-solid border-settingsTabBorder"
            }
            styleActive={
              "h-3.12 border-b-2 border-b-solid border-b-settingsTabActive"
            }
            styleInActive={"text-profileBlack"}
          >
            SUBSCRIPTION
          </TabSelector>
          <TabSelector
            isActive={selectedTab === "billing_history"}
            onClick={() => setSelectedTab("billing_history")}
            style={
              "text-center justify-center text-xs font-Poppins not-italic font-normal text-profileBlack leading-4 font-medium w-12.87 h-2.68 border border-solid border-settingsTabBorder"
            }
            styleActive={
              "h-3.12 border-b-2 border-b-solid border-b-settingsTabActive"
            }
            styleInActive={"text-profileBlack"}
          >
            BILLING HISTORY
          </TabSelector>
          <TabSelector
            isActive={selectedTab === "tags"}
            onClick={() => setSelectedTab("tags")}
            style={
              "text-center justify-center text-xs font-Poppins not-italic font-normal text-profileBlack leading-4 font-medium w-12.87 h-2.68 border border-solid border-settingsTabBorder"
            }
            styleActive={
              "h-3.12 border-b-2 border-b-solid border-b-settingsTabActive"
            }
            styleInActive={"text-profileBlack"}
          >
            TAGS
          </TabSelector>
        </nav>
        <div className="items-center relative overflow-y-auto block section ">
          <Integration hidden={selectedTab !== "integrations"} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
