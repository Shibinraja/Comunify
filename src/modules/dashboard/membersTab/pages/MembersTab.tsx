import React from "react";
import { TabSelector } from "common/tabs/TabSelector";
import { useTabs } from "@/hooks/useTabs";
import ActiveMembersList from "./ActiveMembersList";

function MembersTab() {
  const [selectedTab, setSelectedTab] = useTabs([
    "top_contributors",
    "active",
    "in-active",
  ]);
  return (
    <div className="w-29.9375 h-full   box-border bg-white  rounded-0.6 mt-1.868 app-input-card-border shadow-profileCard ">
      <div className="w-full mt-7 flex flex-col ">
        <nav>
          <TabSelector
            isActive={selectedTab === "top_contributors"}
            onClick={() => setSelectedTab("top_contributors")}
            style={"ml-1.625 mt-0.438 text-sm "}
          >
            Top Contributors
          </TabSelector>
          <TabSelector
            isActive={selectedTab === "active"}
            onClick={() => setSelectedTab("active")}
            style={"ml-1.625 mt-0.438 text-sm "}
          >
            Active
          </TabSelector>
          <TabSelector
            isActive={selectedTab === "in-active"}
            onClick={() => setSelectedTab("in-active")}
            style={"ml-1.625 mt-0.438 text-sm "}
          >
            Inactive
          </TabSelector>
        </nav>
        <div className="h-14.375 items-center relative overflow-y-auto ml-1.661 block section">
          <ActiveMembersList hidden={selectedTab !== "active"} />
        </div>
      </div>
    </div>
  );
}

export default MembersTab;
