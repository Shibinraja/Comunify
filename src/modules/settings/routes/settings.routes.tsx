import React from "react";
import { RoutesArray } from "../../../interface/interface";

const Settings = React.lazy(() => import("../pages/Settings"));

const settingRoutes: RoutesArray = {
  path: 'settings',
  children: [
      {
          path: '',
          element: <Settings/>,
      }
  ],
};

export default settingRoutes;
