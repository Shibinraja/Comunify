import React from "react";
import { RoutesArray } from "../../../interface/interface";
import PrivateRoute from "../../../routes/PrivateRoute";

const Settings = React.lazy(() => import("../pages/Settings"));

const membersRoutes: RoutesArray = {
  element: (
    <PrivateRoute>
      <Settings />
    </PrivateRoute>
  ),
  path: "/dashboard/settings",
};

export default membersRoutes;
