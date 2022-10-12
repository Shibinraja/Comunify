import React from 'react';
import { RoutesArray } from '../../../interface/interface';
import Loadable from 'routes/suspenseLoader';

const Report = Loadable(React.lazy(() => import('../pages/Report')));
const CreateReport = Loadable(React.lazy(() => import('../pages/createReport/CreateReport')));
const ReportWidgets = Loadable(React.lazy(() => import('../pages/widgetsReport/widgetsReports')));
const ReportHistory = Loadable(React.lazy(() => import('../pages/reportHistory/ReportHistory')));


const reportRoutes: RoutesArray = {
  path: 'reports',
  children: [
    {
      path: '',
      element: <Report />
    },
    {
      path: 'create-report',
      element: <CreateReport />
    },
    {
      path: 'edit-report',
      element: <CreateReport />
    },
    {
      path: ':reportId/report-history',
      element: <ReportHistory />
    },
    {
      path: 'report-widgets',
      element: <ReportWidgets />
    }
  ]
};

export default reportRoutes;
