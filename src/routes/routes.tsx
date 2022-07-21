import settingRoutes from 'modules/settings/routes/settings.routes';
import { lazy } from 'react';
import { Navigate, useRoutes } from "react-router-dom";
import { RoutesArray } from "../interface/interface";
import authRoutes from "../modules/authentication/routes/auth.routes";
import dashboardRoutes from "../modules/dashboard/routes/dashboard.routes";
import membersRoutes from "../modules/members/routes/members.routes";
import PrivateRoute from './PrivateRoute';
import { Loadable } from './suspenseLoader';

const MainLayout = Loadable(lazy(() => import("../layout/MainLayout")));

const routes: RoutesArray[] = [
  ...authRoutes,
  {
      element: (
          <PrivateRoute>
              <MainLayout />
          </PrivateRoute>
      ),
      path: '/',
      children:[dashboardRoutes,membersRoutes, settingRoutes]
  },
  //to redirect invalid routes back to the index route
  {
      path: '*',
      element: <Navigate to="/" />,
  },
];

const Router = () => {
  return useRoutes(routes);
};

export default Router;
