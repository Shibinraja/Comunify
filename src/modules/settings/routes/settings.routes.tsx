import React from "react";
import { Loadable } from 'routes/suspenseLoader';
import { RoutesArray } from "../../../interface/interface";

const Settings = Loadable(React.lazy(() => import("../pages/Settings")));

const settingRoutes: RoutesArray = {
  path: 'settings',
  element: <Settings/>
};

export default settingRoutes;
