import React, { lazy } from 'react';
import activityRoutes from 'modules/activities/routes/activities.routes';
import reportRoutes from 'modules/reports/routes/reports.routes';
import settingRoutes from 'modules/settings/routes/settings.routes';
import { useRoutes } from 'react-router-dom';
import { RoutesArray } from '../interface/interface';
import authRoutes from '../modules/authentication/routes/auth.routes';
import dashboardRoutes from '../modules/dashboard/routes/dashboard.routes';
import membersRoutes from '../modules/members/routes/members.routes';
import PrivateRoute from './PrivateRoute';
import Loadable from './suspenseLoader';
import accountRoutes from 'modules/account/routes/account.routes';
import GuestRoute from './GuestGuard';
import superAdminMembersRoutes from 'modules/superadmin/routes/superadmin.routes';
import { Notifications } from '../modules/notifications/Notification';

const MainLayout = Loadable(lazy(() => import('../layout/MainLayout')));
const ReportDetail = Loadable(lazy(() => import('../modules/reports/pages/reportHistory/ReportDetail')));
const NotFound = Loadable(lazy(() => import('common/pageNotFound/PageNotFound')));

const routes: RoutesArray[] | any = [
  ...authRoutes,
  {
    path: ':workspaceId/reports/:reportHistoryId/report-details',
    element: (
      <GuestRoute>
        <ReportDetail />
      </GuestRoute>
    )
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Notifications>
          <MainLayout />
        </Notifications>
      </PrivateRoute>
    ),
    children: [
      {
        path: ':workspaceId',
        children: [dashboardRoutes, membersRoutes, settingRoutes, activityRoutes, reportRoutes, accountRoutes]
      },
      {
        path: '/admin',
        children: [superAdminMembersRoutes]
      },
      //to redirect invalid routes back to the index route
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

const Router = () => useRoutes(routes);

export default Router;
