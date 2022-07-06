import React from "react";
import { RoutesArray } from "../../../interface/interface";
import PrivateRoute from "../../../routes/PrivateRoute";

const Dashboard = React.lazy(() => import("../pages/Dashboard"));

const dashboardRoutes: RoutesArray = {
  element: (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  ),
  path: "/dashboard",
};

export default dashboardRoutes;
