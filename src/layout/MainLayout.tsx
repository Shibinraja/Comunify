import React from "react";
import { Outlet } from "react-router";
import SideNav from "../common/sideNav/SideNav";
import TopBar from "../common/topBar/TopBar";

const MainLayout: React.FC = () => {
  return (
    <div className="flex w-full h-full">
      <SideNav />
      <div className="w-[83%] px-16">
        <TopBar />
        <div className="mt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
