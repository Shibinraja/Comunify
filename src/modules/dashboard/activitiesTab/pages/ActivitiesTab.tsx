import { useTabs } from "@/hooks/useTabs";
import { TabSelector } from "common/tabs/TabSelector";
import NewActivitesList from "./NewActivitesList";

export default function ActivitiesTab() {
  const [selectedTab, setSelectedTab] = useTabs(["activites", "highlights"]);

  return (
    <div className="w-29.9375 h-full   box-border bg-white  rounded-0.6 mt-1.868 app-input-card-border shadow-profileCard ">
      <div className="w-full mt-7 flex flex-col ">
        <nav>
          <TabSelector
            isActive={selectedTab === "activites"}
            onClick={() => setSelectedTab("activites")}
            style={"ml-1.625 mt-0.438 text-sm "}
          >
            New Activities
          </TabSelector>
          <TabSelector
            isActive={selectedTab === "highlights"}
            onClick={() => setSelectedTab("highlights")}
            style={"ml-1.625 mt-0.438 text-sm "}
          >
            Highlights
          </TabSelector>
        </nav>
        <div className="h-14.375 items-center relative overflow-y-auto block section ">
          <NewActivitesList hidden={selectedTab !== "activites"} />
        </div>
      </div>
    </div>
  );
}
