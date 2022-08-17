import React, { lazy } from 'react';
import activityRoutes from 'modules/activities/routes/activities.routes';
import reportRoutes from 'modules/reports/routes/reports.routes';
import settingRoutes from 'modules/settings/routes/settings.routes';
import { Navigate, useRoutes } from 'react-router-dom';
import { RoutesArray } from '../interface/interface';
import authRoutes from '../modules/authentication/routes/auth.routes';
import dashboardRoutes from '../modules/dashboard/routes/dashboard.routes';
import membersRoutes from '../modules/members/routes/members.routes';
import PrivateRoute from './PrivateRoute';
import Loadable from './suspenseLoader';
import accountRoutes from 'modules/account/routes/account.routes';

const MainLayout = Loadable(lazy(() => import('../layout/MainLayout')));

const routes: RoutesArray[] = [
  ...authRoutes,
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: ':workspaceId',
        children: [dashboardRoutes, membersRoutes, settingRoutes, activityRoutes, reportRoutes, accountRoutes]
      }
    ]
  },
  //to redirect invalid routes back to the index route
  {
    path: '*',
    element: <Navigate to="/" />
  }
];

const Router = () => useRoutes(routes);

export default Router;
