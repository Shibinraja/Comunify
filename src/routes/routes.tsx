import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import authRoutes from "../modules/authentication/routes/auth.routes";
import dashboardRoutes from "../modules/dashboard/routes/dashboard.routes";
import settingsRoutes from "../modules/settings/routes/settings.routes";
import membersRoutes from "../modules/members/routes/members.routes";
import { RoutesArray } from "../interface/interface";

const MainLayout = React.lazy(() => import("../layout/MainLayout"));

let routes: RoutesArray[] = [
  ...authRoutes,
  {
    element: <MainLayout />,
    path: '/',
    children: [dashboardRoutes, membersRoutes , settingsRoutes],
  },
  //to redirect invalid routes back to the index route
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];

const Router = () => {
  return useRoutes(routes);
};

export default Router;
